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
        // Cargamos las licitaciones con sus relaciones para la tabla
        $licitaciones = Licitacion::with(['empresa', 'division'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Necesitamos empresas y divisiones para el modal de creación
        $empresas = Empresa::all();
        $divisiones = Division::with('empresa')->get();
        $stats = [
        'montoTotal' => $licitaciones->sum('monto_estimado'),
        'activos'     => $licitaciones->where('estado_pipeline', '!=', 'Ganada')->count(),
        'montoGanado' => $licitaciones->where('estado_pipeline', 'Ganada')->sum('monto_estimado'),
        ];

        return Inertia::render('licitaciones/Index', [
            'licitaciones' => $licitaciones,
            'empresas' => $empresas,
            'divisiones' => $divisiones,
            'licitaciones' => $licitaciones,
            'stats' => $stats
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:crm.empresas,id',
            'division_id' => 'required|exists:crm.divisiones,id',
            'nombre_proyecto' => 'required|string|max:255',
            'estado_pipeline' => 'required|string', // Ej: Prospecto, Cotización, Negociación
            'monto_estimado' => 'nullable|numeric',
            'descripcion' => 'nullable|string',
            'fecha_cierre' => 'nullable|date',
        ]);

        Licitacion::create($validated);

        //return redirect()->route('licitaciones.index')->with('message', 'Licitación creada con éxito');
        return redirect()->back();
    }

    // El show para ver el detalle (donde irán las interacciones después)
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
            // Convertimos a array para limpiar cualquier rastro de lógica de objeto que confunda a React
            'licitacion' => $licitacion->toArray() 
        ]);
    }

    public function adjudicar(Licitacion $licitacion)
    {
        // Usamos una transacción para que si algo falla, no se cree el proyecto a medias
        DB::transaction(function () use ($licitacion) {
            
            // 1. Crear el Proyecto en el esquema 'usuarios'
            $proyecto = Proyecto::create([
                'nombre' => $licitacion->nombre_proyecto,
                'alias'  => strtoupper(Str::limit($licitacion->nombre_proyecto, 10, '')),
                'centro_costo' => 'CC-' . rand(1000, 9999), // O tu lógica de códigos
            ]);

            // 2. Actualizar la Licitación: marcar como ganada y vincular el ID del proyecto
            $licitacion->update([
                'estado_pipeline' => 'Ganada',
                'proyecto_id' => $proyecto->id,
                'fecha_adjudicacion' => now(),
            ]);
        });

        return redirect()->back()->with('message', '¡Licitación adjudicada y Proyecto creado!');
    }

}