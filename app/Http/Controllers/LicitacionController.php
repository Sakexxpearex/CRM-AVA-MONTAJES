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
            'montoGanado' => $todas->where('estado_pipeline', 'Ganada')->sum('monto_estimado'),
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
            'empresa', 
            'division', 
            'proyecto', 
            'interacciones.user', 
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
            'descripcion'     => 'nullable|string',
            'fecha_cierre'    => 'nullable|date',
        ]);

        $licitacion->update($validated);

        return back()->with('message', 'Ficha técnica actualizada');
    }

    public function updatePipeline(Request $request, Licitacion $licitacion)
    {
        $rules = [
            'estado_pipeline' => 'required|string',
            'comentario_cierre' => 'nullable|string',
        ];

        if ($request->estado_pipeline === 'Perdida') {
            $rules['competencia_ganadora_id'] = 'required|exists:crm.empresas,id';
        }

        $validated = $request->validate($rules);
        $licitacion->update($validated);

        return back()->with('message', 'Pipeline actualizado correctamente');
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

            $licitacion->update([
                'estado_pipeline' => 'Ganada',
                // Si tienes campo comentario_cierre, también lo guardamos aquí
                'comentario_cierre' => $request->comentario_cierre ?? $licitacion->comentario_cierre,
            ]);
        });

        return redirect()->route('licitaciones.index')->with('message', 'Licitación adjudicada con éxito.');
    }
}