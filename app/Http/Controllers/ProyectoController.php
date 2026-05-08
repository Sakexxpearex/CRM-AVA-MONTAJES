<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProyectoController extends Controller
{
    /**
     * Muestra la lista de proyectos (Centros de Costo).
     */
    public function index()
    {
        // Obtenemos los proyectos de la conexión 'usuarios'
        $proyectos = Proyecto::all();

        return Inertia::render('proyectos/Index', [
            'proyectos' => $proyectos
        ]);
    }

    /**
     * Muestra el detalle de un proyecto.
     */
    public function show($id)
    {
        $proyecto = Proyecto::findOrFail($id);

        return Inertia::render('proyectos/Show', [
            'proyecto' => $proyecto
        ]);
    }
}