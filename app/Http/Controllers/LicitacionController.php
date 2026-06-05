<?php

namespace App\Http\Controllers;

use App\Services\CommandParserService;
use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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
            'activos'     => $todas->whereIn('estado_pipeline', [
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
        $request->validate([
            'estado_pipeline' => 'required|string',
        ]);

        if ($request->estado_pipeline === 'Adjudicada' || $request->estado_pipeline === 'Operativa') {
            $licitacion->monto_adjudicado = $licitacion->monto_estimado;
            $licitacion->fecha_adjudicacion = now();
        }

        $licitacion->estado_pipeline = $request->estado_pipeline;
        $licitacion->save(); 

        return back();
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
                ->post('https://api.api.groq.com/openai/v1/audio/transcriptions' ?: 'https://api.groq.com/openai/v1/audio/transcriptions', [
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
        
        $intent = strtoupper($comando['intent'] ?? 'DESCONOCIDO');
        $nombre = $comando['nombre'] ?? 'vacio';
        $estado = $comando['estado'] ?? 'vacio';

        if ($intent === 'CAMBIAR_ESTADO') {
            
            $licitacion = Licitacion::where('nombre_proyecto', 'ILIKE', '%' . $nombre . '%')->first();
            
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
}