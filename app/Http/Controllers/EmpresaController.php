<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\Persona;
use App\Models\Division;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpresaController extends Controller
{
    public function index(Request $request)
    {
       return Inertia::render('empresas/Index', [
            'empresas' => Empresa::with('divisiones')
                ->when($request->filled('search'), function ($query) use ($request){
                    $query->where('nombre', 'like', '%' . $request->string('search')->trim(). '%');
                })
                ->when($request->filled('tipo'), function ($query) use ($request) {
                    $query->where('tipo', $request->string('tipo'));
                })
                ->orderBy('nombre')
                ->get(),
            'filters' => $request->only(['search', 'tipo']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'rut' => 'required|string|max:20|unique:crm.empresas,rut',
            'nombre' => 'nullable|string|max:255',
            'tipo' => 'required|in:Cliente,Competencia,Subcontratista',
        ]);

        $empresa = Empresa::create($data);

        return redirect()->route('empresas.index')->with('message', 'Empresa creada correctamente');
    }
    

    public function show(Empresa $empresa)
{
    return Inertia::render('empresas/Show', [
        'empresa' => $empresa,
        'divisiones' => $empresa->divisiones()->withCount('personas')->get(),
        'contactos' => Persona::whereHas('divisiones', function ($query) use ($empresa) {
            $query->where('empresa_id', $empresa->id)->where('estado_actual', true);
        })->with(['divisiones' => function($query) {
            $query->where('estado_actual', true); // Esto trae el 'pivot' con el cargo
        }])->get(),

        
    ]);
}

    

    public function update(Request $request, Empresa $empresa)
    {
        $data = $request->validate([
            'rut' => 'sometimes|required|string|max:20|unique:crm.empresas,rut,' . $empresa->id,
            'nombre' => 'sometimes|nullable|string|max:255',
            'tipo' => 'sometimes|required|in:Cliente,Competencia,Subcontratista',
        ]);

        $empresa->update($data);

        return redirect()->route('empresas.index');
    }

    public function destroy(Empresa $empresa)
    {
        $empresa->delete();

        return redirect()->route('empresas.index');
    }
}