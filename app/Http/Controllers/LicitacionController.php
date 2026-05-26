<?php

namespace App\Http\Controllers;

use App\Services\CommandParserService;
use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Division;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LicitacionController extends Controller
{
    public function index(Request $request)
    {
        $todas = Licitacion::all();
        
        $montoOrder = $request->input('monto_order');

        $licitacionesActivas = Licitacion::with(['empresa', 'division'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->whereRaw("unaccent(nombre_proyecto) ILIKE unaccent(?)", ['%' . $request->string('search')->trim() . '%']);
            })
            ->when($request->filled('estado'), function($query) use ($request) {
                $query->where('estado_pipeline', $request->string('estado'));
            })
            ->when(in_array($montoOrder, ['asc', 'desc'], true), function ($query) use ($montoOrder) {
                $query->orderBy('monto_estimado', $montoOrder);
            }, function ($query) {
                $query->orderBy('created_at', 'desc');
            })
            ->get();

        $estadosganadores = ['Adjudicada', 'Operativa'];
            $stats = [
            'montoTotal'  => $todas->sum('monto_estimado'),
            'activos' => $todas->whereIn('estado_pipeline', [ // <-- Asegúrate que use guion bajo
                'Preparación', 'Filtro', 'Presentada', 'Evaluación'
            ])->count(),
            'montoGanado' => $todas->whereIn('estado_pipeline', $estadosganadores)->sum('monto_adjudicado'),
        ];

        return Inertia::render('licitaciones/Index', [
            'licitaciones' => $licitacionesActivas,
            'empresas'     => Empresa::all(),
            'divisiones'   => Division::with('empresa')->get(),
            'stats'        => $stats,
            'filters'      => $request->only(['search', 'estado', 'monto_order']),
            'estados'      => [
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
            'division.personas', // <-- CLAVE: Trae los contactos de la división específica
            'empresa',
            'proyecto',
            'interacciones.persona'
        ])->findOrFail($id);

        return Inertia::render('licitaciones/Show', [
            'licitacion' => $licitacion,
            // Para el PipelineModal
            'empresasCompetencia' => Empresa::where('tipo', 'Competencia')->orderBy('nombre')->get(),
            // Para el LicitacionEditModal (Corregido: faltaba coma y sobran llaves)
            'empresas' => Empresa::all(),
            'divisiones' => Division::all(),
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

    // Si pasa a ganada, forzamos el valor del dinero antes de guardar
    if ($request->estado_pipeline === 'Adjudicada' || $request->estado_pipeline === 'Operativa' ) {
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

        // 2. Intentar la conexión
        $response = \Illuminate\Support\Facades\Http::withToken($apiKey)
            ->attach('file', file_get_contents($file->getRealPath()), 'audio.wav')
            ->post('https://api.groq.com/openai/v1/audio/transcriptions', [
                'model' => 'whisper-large-v3',
                'language' => 'es',
            ]);

        return $response->json();

    } catch (\Exception $e) {
        // ESTO va a hacer que el error 500 se convierta en un mensaje de texto
        return response()->json([
            'error_real' => $e->getMessage(),
            'donde' => $e->getFile() . ' linea ' . $e->getLine()
        ], 500);
    }
}

    // 2. Ejecuta la acción (Cambiar estado o buscar)
public function comandoVoz(Request $request, CommandParserService $parser)
{
    // 1. Hablamos con la IA
    $comando = $parser->parseCommand($request->texto_hablado);
    
    // 2. Extraemos la intención de forma segura
    $intent = strtoupper($comando['intent'] ?? 'DESCONOCIDO');
    $nombre = $comando['nombre'] ?? 'vacio';
    $estado = $comando['estado'] ?? 'vacio';

    // 3. Si la IA entendió que es cambiar estado...
    if ($intent === 'CAMBIAR_ESTADO') {
        
        $licitacion = Licitacion::where('nombre_proyecto', 'ILIKE', '%' . $nombre . '%')->first();
        
        if ($licitacion) {
            $licitacion->estado_pipeline = $estado;
            
            // Automatización
            if (in_array($estado, ['Adjudicada', 'Operativa'])) {
                $licitacion->monto_adjudicado = $licitacion->monto_estimado;
                $licitacion->fecha_adjudicacion = now();
            }
            
            $licitacion->save();
            return back()->with('message', "✅ Éxito: {$nombre} ahora es {$estado}");
        } else {
            // ERROR TIPO 1: La IA entendió, pero la Base de Datos no encontró el nombre
            return back()->withErrors(['error' => "❌ La IA buscó el proyecto '{$nombre}', pero no existe en tu base de datos con ese nombre."]);
        }
    }

    if ($intent === 'BUSCAR') {
        return redirect()->route('licitaciones.index', ['search' => $nombre ?? $comando['empresa']]);
    }

    // ERROR TIPO 2: La IA devolvió algo raro o se mareó. Te mostramos qué diablos pensó Llama 3.
    $respuestaIA = json_encode($comando);
    return back()->withErrors(['error' => "🤖 La IA se confundió. Esto fue lo que intentó devolver: {$respuestaIA}"]);
}
}