<?php

namespace App\Http\Controllers;

use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Division;
// use App\Models\Proyecto; // Descomenta si necesitas listar los proyectos disponibles en el form
use Illuminate\Http\Request;
use Inertia\Inertia;

class LicitacionController extends Controller
{
    public function index()
    {
        // busca las licitaciones y trae a sus tablas "familiares"
        $licitaciones = Licitacion::with(['empresa', 'division', 'proyecto'])->get();
        
        // También mandamos las empresas y divisiones para llenar los <select> del formulario en React
        $empresas = Empresa::all();
        $divisiones = Division::all();

        return Inertia::render('Licitaciones/Index', [
            'licitaciones' => $licitaciones,
            'empresas' => $empresas,
            'divisiones' => $divisiones
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validamos que la información que llega de React sea correcta
        $validated = $request->validate([
            'empresa_id' => 'required|exists:crm.empresas,id',
            'division_id' => 'required|exists:crm.divisiones,id',
            'nombre_proyecto' => 'required|string|max:255',
            'estado_pipeline' => 'required|string',
            'descripcion' => 'nullable|string',
            'monto_estimado' => 'nullable|numeric',
            'fecha_cierre' => 'nullable|date',
            'fecha_adjudicacion' => 'nullable|date',
            
        ]);

        // 2. Guardamos en la base de datos
        Licitacion::create($validated);

        // 3. Le decimos a Inertia que vuelva a la página anterior
        return back();
    }

    public function update(Request $request, $id)
    {
        $licitacion = Licitacion::findOrFail($id);

        $validated = $request->validate([
            'empresa_id' => 'required|exists:crm.empresas,id',
            'division_id' => 'required|exists:crm.divisiones,id',
            'nombre_proyecto' => 'required|string|max:255',
            'estado_pipeline' => 'required|string',
            'descripcion' => 'nullable|string',
            'monto_estimado' => 'nullable|numeric',
            'fecha_cierre' => 'nullable|date',
            'fecha_adjudicacion' => 'nullable|date',
            'proyecto_id' => 'nullable|integer' 
        ]);

        $licitacion->update($validated);

        return back();
    }

    public function destroy($id)
    {
        $licitacion = Licitacion::findOrFail($id);
        $licitacion->delete();

        return back();
    }
}