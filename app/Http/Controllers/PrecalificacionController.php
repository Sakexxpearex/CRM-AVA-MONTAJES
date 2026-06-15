<?php

namespace App\Http\Controllers;

use App\Models\Precalificacion;
use App\Models\Empresa;
use App\Models\Division;
use App\Models\Persona;
use App\Models\Licitacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PrecalificacionController extends Controller
{
    public function index(Request $request)
    {
        // Traemos las precalificaciones filtrando SOLO las 'Pendiente'
        $precalificaciones = Precalificacion::with(['empresa', 'division', 'persona','interacciones.user'])
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
            'empresa_id'           => 'required|exists:crm.empresas,id',
            'division_id'          => 'required|exists:crm.divisiones,id',
            'persona_id'           => 'nullable|exists:crm.personas,id',
            'nombre_precalificacion' => 'required|string|max:255',
            'resumen_visita'       => 'required|string',
            'monto_estimado'       => 'nullable|numeric|min:0',
            'descripcion'          => 'nullable|string',
        ]);

        $validated['estado'] = 'Pendiente';
        Precalificacion::create($validated);

        return redirect()->back()->with('message', 'Precalificación registrada con éxito');
    }


    public function show($id)
    {
        // Traemos la precalificación con sus relaciones y sus interacciones/bitácora ordenadas
        $precalificacion = Precalificacion::with([
            'empresa', 
            'division', 
            'persona', 
            'interacciones.persona',
            'interacciones.user' // Ajusta el nombre de la relación si es distinto
        ])->findOrFail($id);

        return Inertia::render('precalificaciones/Show', [
            'precalificacion' => $precalificacion,
            'empresas' => Empresa::orderBy('nombre')->get(),
            'divisiones' => Division::orderBy('nombre')->get(),
            'personas' => Persona::with('trabajoActual.division')->get(),
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
                'empresa_id'      => $precalificacion->empresa_id,
                'division_id'     => $precalificacion->division_id,
                'nombre_proyecto' => $precalificacion->nombre_precalificacion, 
                'descripcion'     => $precalificacion->descripcion ?? $precalificacion->resumen_visita,
                'monto_estimado'  => $precalificacion->monto_estimado,
                'estado_pipeline' => 'Evaluación',
            ]);
        }

        return redirect()->back()->with('message', 'Estado actualizado correctamente.');
    }

    public function storeInteraccion(Request $request, $id)
{
    $validated = $request->validate([
        'comentario' => 'required|string',
        'tipo_contacto' => 'required|in:Reunión Presencial,Llamada,Correo,WhatsApp,Otro',
    ]);

    $precalificacion = Precalificacion::findOrFail($id);

    $precalificacion->interacciones()->create([
        'comentario'       => $validated['comentario'],
        'tipo_contacto' => $validated['tipo_contacto'],
        'user_id'          => Auth::id(), 
        'fecha'            => now(),
        'persona_id'       => $precalificacion->persona_id,
    ]);

    return redirect()->route('precalificaciones.show', $id)
        ->with('message', 'Nota registrada en la bitácora.');
}



    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre_precalificacion' => 'required|string|max:255',
            'empresa_id'             => 'required|exists:crm.empresas,id',
            'division_id'            => 'required|exists:crm.divisiones,id',
            'persona_id'             => 'nullable|exists:crm.personas,id',
            'monto_estimado'         => 'nullable|numeric|min:0',
            'resumen_visita'         => 'required|string',
        ]);

        $precalificacion = Precalificacion::findOrFail($id);
        $precalificacion->update($validated);

        return redirect()->route('precalificaciones.show', $id)
            ->with('message', 'Propuesta actualizada correctamente.');
    }


    public function alertasIndex()
    {
        $alertas = Precalificacion::with(['empresa', 'division', 'interacciones.persona'])
            ->enAlerta() 
            ->get()
            ->filter(fn($p) => $p->dias_retraso_alerta > 0)
            ->map(fn($p) => [
                'id' => $p->id,
                'nombre_proyecto' => $p->nombre_precalificacion, 
                'empresa' => $p->empresa->nombre ?? 'N/A',
                'division' => $p->division->nombre ?? 'N/A',
                'ultima_interaccion_fecha' => $p->interacciones->first() ? Carbon::parse($p->interacciones->first()->fecha)->format('d/m/Y') : 'Sin gestiones',
                'ultima_interaccion_tipo'  => $p->interacciones->first()->tipo_contacto ?? 'N/A',
                'ultima_interaccion_quien' => $p->interacciones->first()?->persona ? $p->interacciones->first()->persona->nombre_1 . ' ' . $p->interacciones->first()->persona->apellido_1 : 'N/A',
                'dias_retraso' => $p->dias_retraso_alerta 
            ]);

        return Inertia::render('alertas/PrecalificacionesIndex', [
            'alertas' => $alertas
        ]);
    }
}