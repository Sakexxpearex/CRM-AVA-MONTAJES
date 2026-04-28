<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    public function index()
    {
       return response()->json(Empresa::all());
        //return response()->json(
        //    Empresa::with('divisiones')->get()
        //);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'rut' => 'required|string|max:20|unique:empresas,rut',
            'nombre' => 'nullable|string|max:255',
            'tipo' => 'required|in:Cliente,Competencia,Subcontratista',
        ]);

        $empresa = Empresa::create($data);

        return response()->json([
            'message' => 'Empresa creada correctamente',
            'empresa' => $empresa,
        ], 201);
    }

    public function show(Empresa $empresa)
    {
        return response()->json(
            $empresa->load('divisiones')
        );
    }

    public function update(Request $request, Empresa $empresa)
    {
        $data = $request->validate([
            'rut' => 'sometimes|required|string|max:20|unique:empresas,rut,' . $empresa->id,
            'nombre' => 'sometimes|nullable|string|max:255',
            'tipo' => 'sometimes|required|in:Cliente,Competencia,Subcontratista',
        ]);

        $empresa->update($data);

        return response()->json([
            'message' => 'Empresa actualizada correctamente',
            'empresa' => $empresa,
        ]);
    }

    public function destroy(Empresa $empresa)
    {
        $empresa->delete();

        return response()->json([
            'message' => 'Empresa eliminada correctamente',
        ]);
    }
}