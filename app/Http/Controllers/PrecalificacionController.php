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
use Illuminate\Support\Facades\DB;

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
        'estado' => 'required|in:Pendiente,Aprobada,Rechazada'
    ]);


        $precalificacion = Precalificacion::findOrFail($id);
        $precalificacion->estado = $validated['estado'];
        $precalificacion->save();

        if ($validated['estado'] === 'Aprobada') {
            Licitacion::create([
                'empresa_id'       => $precalificacion->empresa_id,
                'division_id'      => $precalificacion->division_id,
                'nombre_proyecto'  => $precalificacion->nombre_precalificacion, 
                'descripcion'      => $precalificacion->descripcion ?? $precalificacion->resumen_visita,
                'monto_estimado'   => $precalificacion->monto_estimado,
                'monto_adjudicado' => 0,
                'estado_pipeline'  => 'Evaluación',
            ]);
        }

        return redirect()->back()->with('message', 'Estado actualizado correctamente.');


}
    public function storeInteraccion(Request $request, $id)
{
    $validated = $request->validate([
        'comentario'    => 'required|string',
        'tipo_contacto' => 'required|string|in:Reunión Presencial,Llamada,Correo,WhatsApp,Otro' // 🌟 Validamos el canal
    ]);

    $precalificacion = Precalificacion::findOrFail($id);

    $precalificacion->interacciones()->create([
        'comentario'    => $validated['comentario'],
        'tipo_contacto' => $validated['tipo_contacto'], // 🌟 Guardado dinámico
        'persona_id'    => $precalificacion->persona_id, 
        'user_id'       => auth()->id(),                 
        'fecha'         => now()->format('Y-m-d'),       
        'licitacion_id' => null,                         
    ]);

    return redirect()->back()->with('message', 'Nota registrada en la bitácora.');
}
}