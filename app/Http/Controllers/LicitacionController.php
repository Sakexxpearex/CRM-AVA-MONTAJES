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
        // 1. Obtenemos TODAS las licitaciones para calcular los stats globales
        $todas = Licitacion::all();

        // 2. Filtramos las licitaciones para la tabla: Solo las que NO están ganadas
        // Esto hace que "desaparezcan" de la vista y se muevan a Proyectos
        $licitacionesActivas = Licitacion::with(['empresa', 'division'])
            ->where('estado_pipeline', '!=', 'Ganada')
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Stats (Mantenemos la lógica sobre el total para ver el rendimiento)
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
            'licitacion' => $licitacion->toArray() 
        ]);
    }

    /**
     * Proceso de Adjudicación:
     * Cambia el estado en CRM y crea el registro en la DB de Usuarios/Proyectos
     */
    public function adjudicar(Request $request, $id)
    {
        $licitacion = Licitacion::findOrFail($id);

        // Validamos que el centro de costo venga en la petición (desde un modal o input)
        $request->validate([
            'centro_costo' => 'required|string|unique:usuarios.proyectos,centro_costo'
        ]);

        DB::transaction(function () use ($licitacion, $request) {
            
            // 1. Crear el Proyecto en la conexión 'usuarios' (fiel a tu migración)
            Proyecto::create([
                'centro_costo' => $request->centro_costo,
                'nombre'       => $licitacion->nombre_proyecto,
                'alias'        => strtoupper(Str::limit($licitacion->nombre_proyecto, 10, '')),
            ]);

            // 2. Actualizar Licitación en CRM:
            // Al pasar a 'Ganada', el método Index ya no la mostrará
            $licitacion->update([
                'estado_pipeline' => 'Ganada',
                // Si tienes los campos proyecto_id o fecha_adjudicacion en crm.licitaciones:
                // 'proyecto_id' => $proyecto->id, 
                // 'fecha_adjudicacion' => now(),
            ]);
        });

        // Redirigimos al Index de Proyectos para que el usuario vea el resultado
        return redirect()->route('proyectos.index')->with('message', 'Licitación adjudicada con éxito.');
    }
}