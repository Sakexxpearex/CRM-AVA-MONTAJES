<?php

namespace App\Http\Controllers;

use App\Models\Precalificacion;
use App\Models\Empresa;
use App\Models\Division;
use App\Models\Persona;
use App\Models\Licitacion; // Importación indispensable para clonar la data
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PrecalificacionController extends Controller
{
    
    public function index(Request $request)
    {
        // Traemos las precalificaciones filtrando SOLO las 'Pendiente'
        $precalificaciones = Precalificacion::with(['empresa', 'division', 'persona'])
            ->where('estado', 'Pendiente') 
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('nombre_precalificacion', 'ILIKE', '%' . $request->string('search')->trim() . '%');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('precalificaciones/Index', [
            'precalificaciones' => $precalificaciones,
            'empresas'          => Empresa::all(),
            'divisiones'        => Division::with('empresa')->get(),
            'filters'           => $request->only(['search']), 
            'personas'          => Persona::with(['trabajoActual.division'])->get(),
        ]);
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            
            'empresa_id'             => 'required|exists:crm.empresas,id',
            'division_id'            => 'required|exists:crm.divisiones,id',
            'persona_id'             => 'nullable|exists:crm.personas,id',
            'nombre_precalificacion' => 'required|string|max:255',
            'resumen_visita'         => 'required|string',
            'monto_estimado'         => 'nullable|numeric|min:0',
            'descripcion'            => 'nullable|string',
        ], );

    
        // Definir el estado por defecto inicial
        $validated['estado'] = 'Pendiente';

        // Guardar en la base de datos
        Precalificacion::create($validated);

        return redirect()->back()->with('message', 'Precalificación registrada con éxito');
    }

    
    public function show($id)
    {
        $precalificacion = Precalificacion::with([
            'empresa',
            'division',
            'persona',
            'interacciones.persona' // Historial de notas de terreno vinculadas
        ])->findOrFail($id);

        return Inertia::render('precalificaciones/Show', [
            'precalificacion' => $precalificacion
        ]);
    }

    
    public function cambiarEstado(Request $request, $id)
    {
        
        $validated = $request->validate([
            'estado'                 => 'required|string|in:Pendiente,Aprobada,Rechazada',
            'nombre_precalificacion' => 'nullable|string|max:255',
        ]);

        
        $precalificacion = Precalificacion::findOrFail($id);

        
        $updateData = [
            'estado' => $validated['estado']
        ];

        if (!empty($validated['nombre_precalificacion'])) {
            $updateData['nombre_precalificacion'] = $validated['nombre_precalificacion'];
            $precalificacion->nombre_precalificacion = $validated['nombre_precalificacion']; 
        }

        $precalificacion->update($updateData);

        
        if ($validated['estado'] === 'Aprobada') {
            
          
            $existeLicitacion = Licitacion::where('nombre_proyecto', $precalificacion->nombre_precalificacion)
                ->where('empresa_id', $precalificacion->empresa_id)
                ->exists();

            if (!$existeLicitacion) {
               
                $licitacion = new Licitacion();
                
                $licitacion->nombre_proyecto = $precalificacion->nombre_precalificacion;
                $licitacion->empresa_id      = $precalificacion->empresa_id;
                $licitacion->division_id     = $precalificacion->division_id;
                $licitacion->persona_id      = $precalificacion->persona_id;
                $licitacion->monto_estimado  = $precalificacion->monto_estimado;
                $licitacion->descripcion     = $precalificacion->descripcion;
                $licitacion->estado_pipeline = 'Evaluación'; 
                $licitacion->save();
            }

        }
        
        return redirect()->back()->with('message', 'Evaluación procesada con éxito y licitación añadida al pipeline.');
    }
    public function alertasIndex()
    {
        $alertas = Precalificacion::with([
            'empresa',
            'division',
            'interacciones' => function ($query) {
                $query->orderBy('fecha', 'desc')->with('persona');
            }
        ])
  
        ->enAlerta() 
        ->get()
        ->filter(function ($precalificacion) {

            return $precalificacion->dias_retraso_alerta > 0;
        })
        ->map(function ($p) {
            $ultima = $p->interacciones->first(); 
            
            return [
                'id'                       => $p->id,
                'nombre_proyecto'          => $p->nombre_precalificacion, 
                'empresa'                  => $p->empresa->nombre ?? 'N/A',
                'division'                 => $p->division->nombre ?? 'N/A',
                'ultima_interaccion_fecha' => $ultima ? Carbon::parse($ultima->fecha)->format('d/m/Y') : 'Sin gestiones',
                'ultima_interaccion_tipo'  => $ultima->tipo ?? 'N/A',
                'ultima_interaccion_quien' => $ultima && $ultima->persona 
                    ? $ultima->persona->nombre_1 . ' ' . $ultima->persona->apellido_1 
                    : 'N/A',
                'dias_retraso'             => $p->dias_retraso_alerta 
            ];
        });

        return Inertia::render('alertas/PrecalificacionesIndex', [
            'alertas' => $alertas
        ]);
    }
}