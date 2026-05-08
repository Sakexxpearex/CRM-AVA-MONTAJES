<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpresaController extends Controller
{
    public function index()
    {
       return Inertia::render('empresas/Index', [
            'empresas' => Empresa::all(),
            'empresas' => Empresa::with('divisiones')->get()
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
        return Inertia::render('Empresas/Show', [
            'empresa' => $empresa->load('divisiones')
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