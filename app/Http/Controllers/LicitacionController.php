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
        $estadosganadores = ['Adjudicada', 'Operativa'];
        $stats = [
            'montoTotal'  => $todas->sum('monto_estimado'),
            'activos'     => $todas->where('estado_pipeline', '!=', 'Ganada')->count(),
            'montoGanado' => $todas->wherein('estado_pipeline', $estadosganadores)->sum('monto_adjudicado'),
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
    public function comandoVoz(Request $request)
{
    // Recibimos los datos ya masticados por React
    $nombreBuscado = $request->nombre_proyecto; // Ej: "mantenimiento enap"
    $nuevoEstado = $request->estado_nuevo;        // Ej: "Adjudicada"

    // Buscamos la primera licitación que CONTENGA ese nombre (LIKE)
    $licitacion = Licitacion::where('nombre_proyecto', 'LIKE', '%' . $nombreBuscado . '%')->first();

    if ($licitacion) {
        $licitacion->estado_pipeline = $nuevoEstado;

        // La lógica del flujo de caja que ya tenías
        if (in_array($nuevoEstado, ['Adjudicada', 'Operativa'])) {
            $licitacion->monto_adjudicado = $licitacion->monto_estimado;
            $licitacion->fecha_adjudicacion = now();
        }

        $licitacion->save();

        return back()->with('success', 'Actualizado por voz');
    }

    // Si no encuentra nada parecido, tira error y salta el "onError" de React
    return back()->withErrors(['error' => 'Licitación no encontrada']);
}
}