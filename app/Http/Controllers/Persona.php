<?php

namespace App\Http\Controllers;

use App\Models\Persona; 
use App\Models\Empresa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonaController extends Controller
{
    public function index()
    {
        // Traemos a las personas y el nombre de la empresa donde trabajan
        $personas = Persona::with('empresa')->get();
        
        // Mandamos las empresas para el <select> del modal de creación
        $empresas = Empresa::all();

        return Inertia::render('Personas/Index', [
            'personas' => $personas,
            'empresas' => $empresas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:crm.empresas,id',
            'nombre' => 'required|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:20',
        ]);

        Persona::create($validated);

        return back();
    }

    public function update(Request $request, $id)
    {
        $persona = Persona::findOrFail($id);

        $validated = $request->validate([
            'empresa_id' => 'required|exists:crm.empresas,id',
            'nombre' => 'required|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:20',
        ]);

        $persona->update($validated);

        return back();
    }

    public function destroy($id)
    {
        $persona = Persona::findOrFail($id);
        $persona->delete();

        return back();
    }
}