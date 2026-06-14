<?php

namespace App\Http\Controllers;

use App\Services\CommandParserService;
use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Inertia\Inertia;

class LicitacionController extends Controller
{
    public function index(Request $request)
    {
        $todas = Licitacion::all();
        
        $montoOrder = $request->input('monto_order');

        $licitacionesActivas = Licitacion::with(['empresa', 'division'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('nombre_proyecto', 'ILIKE', '%' . $request->string('search')->trim() . '%');
            })
            ->when($request->filled('estado'), function ($query) use ($request) {
                $query->where('estado_pipeline', $request->string('estado'));
            })
            // NUEVO FILTRO: Filtrar por la empresa seleccionada. 
            // Comprueba si el request tiene el parámetro 'empresa' y aplica el 'where'.
            ->when($request->filled('empresa'), function ($query) use ($request) {
                $query->where('empresa_id', $request->string('empresa'));
            })
            ->when(in_array($montoOrder, ['asc', 'desc'], true), function ($query) use ($montoOrder) {
                $query->orderBy('monto_estimado', $montoOrder);
            }, function ($query) {
                $query->orderBy('created_at', 'desc');
            })
            ->get();
        
        $alertasVencidas = Licitacion::with(['empresa', 'division'])
            ->whereNotIn('estado_pipeline', ['Ganada', 'Adjudicada', 'Operativa', 'Perdida', 'Cerrada', 'Desierta'])
            ->enAlerta()
            ->get();

        $estadosganadores = ['Adjudicada', 'Operativa'];
              
        $stats = [
            'montoTotal'  => $todas->sum('monto_estimado'),

            'activos'     => $todas->whereIn('estado_pipeline', [
                'Preparación', 'Filtro', 'Presentada', 'Evaluación'
            ])->count(),
            'montoGanado' => $todas->whereIn('estado_pipeline', $estadosganadores)->sum('monto_adjudicado'),
        ];

        return Inertia::render('licitaciones/Index', [
            'licitaciones'    => $licitacionesActivas,
            'alertasVencidas' => $alertasVencidas, // <-- Corregido: Ahora se envía a la vista
            'empresas'        => Empresa::all(),
            'divisiones'      => Division::with('empresa')->get(),
            'stats'           => $stats,
            // MODIFICACIÓN: Agregado 'empresa' a los filtros retornados a la vista para que el estado persista
            'filters'         => $request->only(['search', 'estado', 'monto_order', 'empresa']),
            'estados'         => [
                'Evaluación',
                'Preparación',
                'Presentada',
                'Adjudicada',
                'Operativa',
                'Perdida',
                'Desierta'
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empresa_id'      => 'required|exists:crm.empresas,id',
            'division_id'     => 'required|exists:crm.divisiones,id',
            'nombre_proyecto' => 'required|string|max:255',
            'estado_pipeline' => 'required|string',
            'monto_estimado'  => 'nullable|numeric',
            'descripcion'     => 'nullable|string',
            'fecha_cierre'    => 'nullable|date',
        ]);

        Licitacion::create($validated);

        return redirect()->back();
    }

    public function show($id)
    {
        $licitacion = Licitacion::with([
            'division.personas', 
            'empresa',
            'interacciones.persona'
        ])->findOrFail($id);

        return Inertia::render('licitaciones/Show', [
            'licitacion'          => $licitacion,
            // Para el PipelineModal
            'empresasCompetencia' => Empresa::where('tipo', 'Competencia')->orderBy('nombre')->get(),
            // Para el LicitacionEditModal
            'empresas'            => Empresa::all(),
            'divisiones'          => Division::all(),
        ]);
    }

    // Método para editar datos estructurales (Nombre, Empresa, etc.)
public function update(Request $request, Licitacion $licitacion)
{
    $validated = $request->validate([
        'nombre_proyecto' => 'required|string|max:255',
        'empresa_id'      => 'required|exists:crm.empresas,id',
        'division_id'     => 'required|exists:crm.divisiones,id',
        'monto_estimado'  => 'nullable|numeric',
        'monto_adjudicado' => 'nullable|numeric', // Agregamos esto por si quieren editarlo a mano
        'descripcion'     => 'nullable|string',
        'fecha_cierre'    => 'nullable|date',
        'estado_pipeline' => 'nullable|in:Evaluación,Preparación,Presentada,Filtro,Adjudicada,Operativa,Perdida,Desierta', // Por si lo cambian aquí
    ]);

    // Si al editar la ficha técnica el estado ya es ganador, aseguramos el monto
    if (in_array($request->estado_pipeline ?? $licitacion->estado_pipeline, ['Adjudicada'])) {
        if (empty($validated['monto_adjudicado'])) {
            $validated['monto_adjudicado'] = $request->monto_estimado ?? $licitacion->monto_estimado;
        }

        $licitacion->update($validated);
        return back()->with('message', 'Ficha técnica actualizada');
    }

    public function updatePipeline(Request $request, Licitacion $licitacion)
    {
        $validated = $request->validate([
            'estado_pipeline' => 'required|string',
        ]);

        // Si pasa a ganada, forzamos el valor del dinero antes de guardar
        if (in_array($request->estado_pipeline, ['Adjudicada', 'Operativa'])) {
            $licitacion->monto_adjudicado = $licitacion->monto_estimado;
            $licitacion->fecha_adjudicacion = now();
        }

        $licitacion->estado_pipeline = $request->estado_pipeline;
        $licitacion->save(); // Usar save() después de asignar manualmente es más seguro

        return back();
    }
  
  

    public function adjudicar(Request $request, $id)
    {
        // 1. Buscamos la licitación
        $licitacion = Licitacion::findOrFail($id);

        // 2. Validamos el Centro de Costo (para la tabla proyectos en la conexión 'usuarios')
        $request->validate([
            'centro_costo' => 'required|string|unique:usuarios.proyectos,centro_costo'
        ]);

        // 3. Iniciamos la transacción para asegurar que ambos pasos ocurran
        DB::transaction(function () use ($licitacion, $request) {
            
            // PASO A: Crear el Proyecto en la base de datos de Ingeniería
            Proyecto::create([
                'centro_costo' => $request->centro_costo,
                'nombre'       => $licitacion->nombre_proyecto,
                'alias'        => strtoupper(Str::limit($licitacion->nombre_proyecto, 10, '')),
            ]);

        });

        return redirect()->route('licitaciones.index')->with('message', '¡Éxito! Proyecto creado y métricas de AVA actualizadas.');
    }

    public function transcribe(Request $request)
    {
        // 1. Verificar si el archivo llega
        if (!$request->hasFile('audio')) {
            return response()->json(['res' => 'No llega el archivo audio'], 500);
        }

        try {
            $file = $request->file('audio');
            $apiKey = env('GROQ_API_KEY');

            // 2. Intentar la conexión usando el Facade ya importado
            $response = Http::withToken($apiKey)
                ->attach('file', file_get_contents($file->getRealPath()), 'audio.wav')
                ->post('https://api.groq.com/openai/v1/audio/transcriptions', [
                    'model'    => 'whisper-large-v3',
                    'language' => 'es',
                ]);
            return $response->json();

        } catch (\Exception $e) {
            // ESTO va a hacer que el error 500 se convierta en un mensaje de texto
            return response()->json([
                'error_real' => $e->getMessage(),
                'donde'      => $e->getFile() . ' linea ' . $e->getLine()
            ], 500);
        }
    }
public function comandoVoz(Request $request, CommandParserService $parser)
    {
        $comando = $parser->parseCommand($request->texto_hablado);

        $intent = strtoupper($comando['intent'] ?? 'DESCONOCIDO');
        $nombre = $comando['nombre'] ?? 'vacio';
        $estado = $comando['estado'] ?? 'vacio';

        if ($intent === 'CAMBIAR_ESTADO') {

            $licitacion = Licitacion::where('nombre_proyecto', 'ILIKE', '%' . $nombre . '%')->first();

    } catch (\Exception $e) {
        
        return response()->json([
            'error_real' => $e->getMessage(),
            'donde' => $e->getFile() . ' linea ' . $e->getLine()
        ], 500);
    }
}


public function comandoVoz(Request $request, CommandParserService $parser)
{
    // 1. Hablamos con Llama 3
    $comando = $parser->parseCommand($request->texto_hablado);
    
    // 2. Extraemos la intención y las variables de forma segura
    $intent    = strtoupper($comando['intent'] ?? 'DESCONOCIDO');
    $codigoDpc = $comando['codigo_dpc'] ?? null; 
    $nombre    = $comando['nombre'] ?? 'vacio';
    $estado    = $comando['nuevo_estado'] ?? ($comando['estado'] ?? 'vacio');

    // Variables nuevas para la Interacción/Bitácora
    $contacto        = $comando['contacto'] ?? 'No especificado';
    $tipoInteraccion = $comando['tipo'] ?? 'No especificado'; // Ej: Llamada, Reunión
    $descripcion     = $comando['nota'] ?? ($comando['descripcion'] ?? null);

    // Variables para Radar y Competencia
    $criterio   = $comando['criterio'] ?? null;
    $competidor = $comando['empresa_competidora'] ?? null;

    // BÚSQUEDA DE LA LICITACIÓN 
    // (La sacamos del if para que sirva tanto para cambiar estado como para la bitácora)
    $licitacion = null;
    $busquedaRealizada = ''; 

    // PLAN A: Búsqueda elástica avanzada (Limpia espacios, guiones y símbolos)
    if ($codigoDpc) {
        $busquedaRealizada = "DPC {$codigoDpc}";
        
        $codigoLimpio = preg_replace('/[^a-zA-Z0-9]/', '', $codigoDpc);

        $licitacion = \App\Models\Licitacion::whereRaw("regexp_replace(nombre_proyecto, '[^a-zA-Z0-9]', '', 'g') ILIKE ?", ["%DPC%{$codigoLimpio}%"])
                                            ->orWhereRaw("regexp_replace(nombre_proyecto, '[^a-zA-Z0-9]', '', 'g') ILIKE ?", ["%{$codigoLimpio}%"])
                                            ->first();
    }
    
    // PLAN B: Si no mandó código (o si el código falló), buscamos por el nombre del proyecto
    if (!$licitacion && $nombre !== 'vacio') {
        $busquedaRealizada = $nombre;
        $licitacion = \App\Models\Licitacion::where('nombre_proyecto', 'ILIKE', '%' . $nombre . '%')->first();
    }
    // ----------------------------------------------


    // 3. ESCENARIO: CAMBIAR ESTADO 
    if ($intent === 'CAMBIAR_ESTADO') {
        if ($licitacion) {
            $licitacion->estado_pipeline = $estado;
            
            // Automatización financiera
            if (in_array($estado, ['Adjudicada', 'Operativa'])) {
                $licitacion->monto_adjudicado = $licitacion->monto_estimado;
                $licitacion->fecha_adjudicacion = now();
            }
            
            $licitacion->save();
            return back()->with('message', " Éxito: La licitación '{$licitacion->nombre_proyecto}' ahora está en estado {$estado}");
        } else {
            // ERROR TIPO 1: La IA entendió todo, pero no existe en la BD
            return back()->withErrors(['error' => " La IA buscó el proyecto por '{$busquedaRealizada}', pero no existe en tu base de datos."]);
        }
    }

// 4. ESCENARIO: REGISTRAR BITACORA / INTERACCION
    if ($intent === 'REGISTRAR_BITACORA') {
        if ($licitacion && $descripcion) {
            
            // 1. Funcion para normalizar el texto (quitar tildes y mayusculas)
            $quitarTildes = function($cadena) {
                return str_replace(
                    ['á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú'],
                    ['a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u'],
                    strtolower(trim($cadena))
                );
            };

            $textoHablado = $quitarTildes($request->texto_hablado ?? $descripcion);
            
            // 2. Filtramos los contactos que pertenecen a la misma division que la licitacion
            // Esto equivale exactamente a la lista de "Contactos Asociados" de la pantalla
            $contactosAsociados = \App\Models\Persona::where('division_id', $licitacion->division_id)->get();

            $personaId = 1; // ID de resguardo por defecto
            $encontrado = false;

            if ($contactosAsociados && $contactosAsociados->count() > 0) {
                // PLAN A: Buscar al contacto correcto dentro de la division de la licitacion palabra por palabra
                foreach ($contactosAsociados as $persona) {
                    $nombreLimpio = $quitarTildes($persona->nombre_completo);
                    $palabrasDelNombre = explode(' ', $nombreLimpio);

                    foreach ($palabrasDelNombre as $palabra) {
                        if (strlen($palabra) > 2 && str_contains($textoHablado, $palabra)) {
                            $personaId = $persona->id;
                            $encontrado = true;
                            break 2; // Rompe ambos bucles al encontrar la coincidencia
                        }
                    }
                }

                // PLAN B: Si no mencionaste ningun nombre en el audio, pero la licitacion tiene un UNICO contacto,
                // se lo asignamos a el por logica pura.
                if (!$encontrado && $contactosAsociados->count() === 1) {
                    $personaId = $contactosAsociados->first()->id;
                    $encontrado = true;
                }
            }

            // PLAN C: Si no habia contactos en la division o no hubo coincidencia, buscamos a nivel global
            if (!$encontrado) {
                $personasGlobales = \App\Models\Persona::all(); 
                foreach ($personasGlobales as $persona) {
                    $nombreLimpio = $quitarTildes($persona->nombre_completo);
                    $palabrasDelNombre = explode(' ', $nombreLimpio);

                    foreach ($palabrasDelNombre as $palabra) {
                        if (strlen($palabra) > 2 && str_contains($textoHablado, $palabra)) {
                            $personaId = $persona->id;
                            $encontrado = true;
                            break 2;
                        }
                    }
                }
            }

            // 3. Normalizamos el tipo de contacto
            $tipoExtraido = strtolower(trim($tipoInteraccion));
            $tipoStr = 'Otro'; 

            if (str_contains($tipoExtraido, 'presencial') || str_contains($tipoExtraido, 'reunion')) {
                $tipoStr = 'Reunión Presencial';
            } elseif (str_contains($tipoExtraido, 'llamada') || str_contains($tipoExtraido, 'fono')) {
                $tipoStr = 'Llamada';
            } elseif (str_contains($tipoExtraido, 'correo') || str_contains($tipoExtraido, 'email')) {
                $tipoStr = 'Correo';
            } elseif (str_contains($tipoExtraido, 'whatsapp') || str_contains($tipoExtraido, 'wsp')) {
                $tipoStr = 'WhatsApp';
            }

            // 4. Guardamos la interaccion inyectando el ID verificado
            $licitacion->interacciones()->create([
                'persona_id'    => $personaId, 
                'user_id'       => auth()->id() ?? 1, 
                'fecha'         => now(), 
                'comentario'    => $descripcion,
                'tipo_contacto' => $tipoStr,
            ]);

            $licitacion->touch(); 

            // 5. Retornamos confirmando el nombre_completo real del contacto asignado
            $personaAsignada = \App\Models\Persona::find($personaId);
            $nombreFinal = $personaAsignada ? $personaAsignada->nombre_completo : 'Contacto por defecto';
            
            return back()->with('message', "Nota guardada. Cliente asignado: {$nombreFinal}");
        }
        return back()->withErrors(['error' => "Faltan datos para registrar la nota."]);
    }

// 5. ESCENARIO: REGISTRAR COMPETENCIA
    if ($intent === 'REGISTRAR_COMPETENCIA') {
        if ($licitacion && $competidor) {
            
            // 1. Buscamos por nombre. Si NO existe, la crea asignándole el tipo "Competidor".
            // (Ajusta 'Competidor' si en tu BD usas otro término como 'Competencia' o 'Rival')
            $empresa = \App\Models\Empresa::firstOrCreate(
                ['nombre' => trim($competidor)],
                ['tipo'   => 'Competencia'] // <-- Aquí matamos el error del Not Null
            );

            // 2. Asociamos el competidor a la licitación en la tabla pivote
            \App\Models\CompetenciaEnLicitacion::firstOrCreate([
                'licitacion_id' => $licitacion->id,
                'empresa_id'    => $empresa->id, 
            ]);

            // 3. Actualizamos la fecha
            $licitacion->touch();

            return back()->with('message', " Competencia registrada: {$empresa->nombre} asociada a {$licitacion->nombre_proyecto}");
        }
        return back()->withErrors(['error' => " No encontré el proyecto '{$busquedaRealizada}' para registrar la competencia."]);
    }
    
    // 6. ESCENARIO: BUSCAR / FILTRAR (Tu código intacto)
    if ($intent === 'BUSCAR') {
        $terminoBusqueda = $codigoDpc ? "DPC {$codigoDpc}" : ($nombre !== 'vacio' ? $nombre : ($comando['empresa'] ?? ''));
        return redirect()->route('licitaciones.index', ['search' => $terminoBusqueda]);
    }

    // 9. ERROR TIPO 2: La IA devolvió un JSON raro o no entendió
    $respuestaIA = json_encode($comando);
    return back()->withErrors(['error' => "No se entendio el Mensaje."]);
}
            if ($licitacion) {
                $licitacion->estado_pipeline = $estado;

                if (in_array($estado, ['Adjudicada', 'Operativa'])) {
                    $licitacion->monto_adjudicado = $licitacion->monto_estimado;
                    $licitacion->fecha_adjudicacion = now();
                }

                $licitacion->save();
                return back()->with('message', "✅ Éxito: {$nombre} ahora es {$estado}");
            } else {
                return back()->withErrors(['error' => "❌ La IA buscó el proyecto '{$nombre}', pero no existe en tu base de datos con ese nombre."]);
            }
        }

        if ($intent === 'BUSCAR') {
            return redirect()->route('licitaciones.index', ['search' => $nombre ?? $comando['empresa']]);
        }

        $respuestaIA = json_encode($comando);
        return back()->withErrors(['error' => "🤖 La IA se confundió. Esto fue lo que intentó devolver: {$respuestaIA}"]);
    }
    public function alertas()
    {
        return Licitacion::with(['empresa', 'division'])
            ->whereNotIn('estado_pipeline', ['Ganada', 'Adjudicada', 'Operativa', 'Perdida', 'Cerrada', 'Desierta'])
            ->enAlerta()
            ->get()
            ->filter(function ($licitacion) {
                return $licitacion->dias_retraso_alerta > 0;
            })
            ->values();
    }

    public function alertasIndex()
    {
        $alertas = Licitacion::with([
            'empresa',
            'division',
            'interacciones' => function ($query) {
                $query->orderBy('fecha', 'desc')->with('persona');
            }
        ])
        ->whereNotIn('estado_pipeline', ['Ganada', 'Adjudicada', 'Operativa', 'Perdida', 'Cerrada', 'Desierta'])
        ->enAlerta()
        ->get()
        ->filter(function ($licitacion) {
            return $licitacion->dias_retraso_alerta > 0;
        })
        ->map(function ($licitacion) {
            $ultima = $licitacion->interacciones->first(); // Tomamos solo la última interacción
            
            return [
                'id'                       => $licitacion->id,
                'nombre_proyecto'          => $licitacion->nombre_proyecto,
                'empresa'                  => $licitacion->empresa->nombre ?? 'N/A',
                'division'                 => $licitacion->division->nombre ?? 'N/A',
                'ultima_interaccion_fecha' => $ultima ? Carbon::parse($ultima->fecha)->format('d/m/Y') : 'Sin gestiones',
                'ultima_interaccion_tipo'  => $ultima->tipo ?? 'N/A',
                'ultima_interaccion_quien' => $ultima && $ultima->persona 
                    ? $ultima->persona->nombre_1 . ' ' . $ultima->persona->apellido_1 
                    : 'N/A',
                'dias_retraso'             => $licitacion->dias_retraso_alerta 
            ];
        });

        return Inertia::render('alertas/index', [
            'alertas' => $alertas
        ]);
    }
}