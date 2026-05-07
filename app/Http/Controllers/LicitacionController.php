<?php

namespace App\Http\Controllers;

use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Division;
use App\Models\Proyecto;
use Illuminate\Http\Request;
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

        return Inertia::render('licitaciones/Index', [
            'licitaciones' => $licitaciones,
            'empresas' => $empresas,
            'divisiones' => $divisiones
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
    public function show(Licitacion $licitacion)
    {
        return Inertia::render('Licitaciones/Show', [
            'licitacion' => $licitacion->load([
                'empresa', 
                'division', 
                'proyecto', 
                'interacciones.user', 
                'interacciones.persona'
            ])
        ]);
    }
}