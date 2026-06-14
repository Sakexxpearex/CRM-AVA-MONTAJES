<?php

namespace App\Http\Controllers;

use App\Services\CommandParserService;
use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Division;
use App\Models\Proyecto;
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
            'alertasVencidas' => $alertasVencidas,
            'empresas'        => Empresa::all(),
            'divisiones'      => Division::with('empresa')->get(),
            'stats'           => $stats,
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
            'empresasCompetencia' => Empresa::where('tipo', 'Competencia')->orderBy('nombre')->get(),
            'empresas'            => Empresa::all(),
            'divisiones'          => Division::all(),
        ]);
    }

    public function update(Request $request, Licitacion $licitacion)
    {
        $validated = $request->validate([
            'nombre_proyecto'  => 'required|string|max:255',
            'empresa_id'       => 'required|exists:crm.empresas,id',
            'division_id'      => 'required|exists:crm.divisiones,id',
            'monto_estimado'   => 'nullable|numeric',
            'monto_adjudicado' => 'nullable|numeric', 
            'descripcion'      => 'nullable|string',
            'fecha_cierre'     => 'nullable|date',
            'estado_pipeline'  => 'nullable|in:Evaluación,Preparación,Presentada,Filtro,Adjudicada,Operativa,Perdida,Desierta', 
        ]);

        // Ya están las llaves correctamente alineadas aquí:
        if (in_array($request->estado_pipeline ?? $licitacion->estado_pipeline, ['Adjudicada', 'Operativa'])) {
            if (empty($validated['monto_adjudicado'])) {
                $validated['monto_adjudicado'] = $request->monto_estimado ?? $licitacion->monto_estimado;
            }
        }

        $licitacion->update($validated);
        return back()->with('message', 'Ficha técnica actualizada');
    }

    public function updatePipeline(Request $request, Licitacion $licitacion)
    {
        $validated = $request->validate([
            'estado_pipeline' => 'required|string',
        ]);

        if (in_array($request->estado_pipeline, ['Adjudicada', 'Operativa'])) {
            $licitacion->monto_adjudicado = $licitacion->monto_estimado;
            $licitacion->fecha_adjudicacion = now();
        }

        $licitacion->estado_pipeline = $request->estado_pipeline;
        $licitacion->save(); 

        return back();
    }

    public function adjudicar(Request $request, $id)
    {
        $licitacion = Licitacion::findOrFail($id);

        $request->validate([
            'centro_costo' => 'required|string|unique:usuarios.proyectos,centro_costo'
        ]);

        DB::transaction(function () use ($licitacion, $request) {
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
        if (!$request->hasFile('audio')) {
            return response()->json(['res' => 'No llega el archivo audio'], 500);
        }

        try {
            $file = $request->file('audio');
            $apiKey = env('GROQ_API_KEY');

            $response = Http::withToken($apiKey)
                ->attach('file', file_get_contents($file->getRealPath()), 'audio.wav')
                ->post('https://api.groq.com/openai/v1/audio/transcriptions', [
                    'model'    => 'whisper-large-v3',
                    'language' => 'es',
                ]);

            return $response->json();

        } catch (\Exception $e) {
            return response()->json([
                'error_real' => $e->getMessage(),
                'donde'      => $e->getFile() . ' linea ' . $e->getLine()
            ], 500);
        }
    }

    public function comandoVoz(Request $request, CommandParserService $parser)
    {
        $comando = $parser->parseCommand($request->texto_hablado);
        
        $intent          = strtoupper($comando['intent'] ?? 'DESCONOCIDO');
        $codigoDpc       = $comando['codigo_dpc'] ?? null; 
        $nombre          = $comando['nombre'] ?? 'vacio';
        $estado          = $comando['nuevo_estado'] ?? ($comando['estado'] ?? 'vacio');

        $contacto        = $comando['contacto'] ?? 'No especificado';
        $tipoInteraccion = $comando['tipo'] ?? 'No especificado'; 
        $descripcion     = $comando['nota'] ?? ($comando['descripcion'] ?? null);

        $criterio   = $comando['criterio'] ?? null;
        $competidor = $comando['empresa_competidora'] ?? null;

        $licitacion = null;
        $busquedaRealizada = ''; 

        if ($codigoDpc) {
            $busquedaRealizada = "DPC {$codigoDpc}";
            $codigoLimpio = preg_replace('/[^a-zA-Z0-9]/', '', $codigoDpc);

            $licitacion = \App\Models\Licitacion::whereRaw("regexp_replace(nombre_proyecto, '[^a-zA-Z0-9]', '', 'g') ILIKE ?", ["%DPC%{$codigoLimpio}%"])
                                                ->orWhereRaw("regexp_replace(nombre_proyecto, '[^a-zA-Z0-9]', '', 'g') ILIKE ?", ["%{$codigoLimpio}%"])
                                                ->first();
        }
        
        if (!$licitacion && $nombre !== 'vacio') {
            $busquedaRealizada = $nombre;
            $licitacion = \App\Models\Licitacion::where('nombre_proyecto', 'ILIKE', '%' . $nombre . '%')->first();
        }

        if ($intent === 'CAMBIAR_ESTADO') {
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

        if ($intent === 'REGISTRAR_BITACORA') {
            if ($licitacion && $descripcion) {
                
                $quitarTildes = function($cadena) {
                    return str_replace(
                        ['á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú'],
                        ['a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u'],
                        strtolower(trim($cadena))
                    );
                };

                $textoHablado = $quitarTildes($request->texto_hablado ?? $descripcion);
                $contactosAsociados = \App\Models\Persona::where('division_id', $licitacion->division_id)->get();

                $personaId = 1; 
                $encontrado = false;

                if ($contactosAsociados && $contactosAsociados->count() > 0) {
                    foreach ($contactosAsociados as $persona) {
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

                    if (!$encontrado && $contactosAsociados->count() === 1) {
                        $personaId = $contactosAsociados->first()->id;
                        $encontrado = true;
                    }
                }

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

                $licitacion->interacciones()->create([
                    'persona_id'    => $personaId, 
                    'user_id'       => auth()->id() ?? 1, 
                    'fecha'         => now(), 
                    'comentario'    => $descripcion,
                    'tipo_contacto' => $tipoStr,
                ]);

                $licitacion->touch(); 

                $personaAsignada = \App\Models\Persona::find($personaId);
                $nombreFinal = $personaAsignada ? $personaAsignada->nombre_completo : 'Contacto por defecto';
                
                return back()->with('message', "Nota guardada. Cliente asignado: {$nombreFinal}");
            }
            return back()->withErrors(['error' => "Faltan datos para registrar la nota."]);
        }

        if ($intent === 'REGISTRAR_COMPETENCIA') {
            if ($licitacion && $competidor) {
                
                $empresa = \App\Models\Empresa::firstOrCreate(
                    ['nombre' => trim($competidor)],
                    ['tipo'   => 'Competencia'] 
                );

                \App\Models\CompetenciaEnLicitacion::firstOrCreate([
                    'licitacion_id' => $licitacion->id,
                    'empresa_id'    => $empresa->id, 
                ]);

                $licitacion->touch();

                return back()->with('message', " Competencia registrada: {$empresa->nombre} asociada a {$licitacion->nombre_proyecto}");
            }
            return back()->withErrors(['error' => " No encontré el proyecto '{$busquedaRealizada}' para registrar la competencia."]);
        }
        
        if ($intent === 'BUSCAR') {
            $terminoBusqueda = $codigoDpc ? "DPC {$codigoDpc}" : ($nombre !== 'vacio' ? $nombre : ($comando['empresa'] ?? ''));
            return redirect()->route('licitaciones.index', ['search' => $terminoBusqueda]);
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
            $ultima = $licitacion->interacciones->first(); 
            
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