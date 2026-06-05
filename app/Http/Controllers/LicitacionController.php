<?php

namespace App\Http\Controllers;

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
    public function index()
    {
        $todas = Licitacion::all();

        $licitacionesActivas = Licitacion::with(['empresa', 'division'])
            ->where('estado_pipeline', '!=', 'Ganada')
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'montoTotal'  => $todas->sum('monto_estimado'),
            'activos'     => $todas->where('estado_pipeline', '!=', 'Ganada')->count(),
            'montoGanado' => $todas->where('estado_pipeline', 'Adjudicada')->sum('monto_adjudicado'),
        ];

        return Inertia::render('licitaciones/Index', [
            'licitaciones' => $licitacionesActivas,
            'empresas'     => Empresa::all(),
            'divisiones'   => Division::with('empresa')->get(),
            'stats'        => $stats
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
        'estado_pipeline' => 'nullable|string', // Por si lo cambian aquí
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
    if ($request->estado_pipeline === 'Adjudicada') {
        $licitacion->monto_adjudicado = $licitacion->monto_estimado;
        $licitacion->fecha_adjudicacion = now();
    }

    $licitacion->estado_pipeline = $request->estado_pipeline;
    $licitacion->save(); // Usar save() después de asignar manualmente es más seguro

    return back();
}


}