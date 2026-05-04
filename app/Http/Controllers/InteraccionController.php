<?php

namespace App\Http\Controllers;

use App\Models\Interaccion;
use App\Models\Licitacion;
use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InteraccionController extends Controller
{
    public function index()
    {
       
        $interacciones = Interaccion::with(['persona', 'licitacion'])->orderBy('fecha', 'desc')->get();
        
       
        $personas = Persona::all();
        $licitaciones = Licitacion::all();

        return Inertia::render('Interacciones/Index', [
            'interacciones' => $interacciones,
            'personas' => $personas,
            'licitaciones' => $licitaciones
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'licitacion_id' => 'nullable|exists:crm.licitaciones,id',
            'persona_id' => 'required|exists:crm.personas,id', // O contactos, según tu tabla
            'tipo' => 'required|string|in:Llamada,Correo,Reunión,WhatsApp', // Ajusta tus opciones
            'fecha' => 'required|date',
            'notas' => 'required|string',
        ]);

        Interaccion::create($validated);

        return back();
    }

    public function update(Request $request, $id)
    {
        $interaccion = Interaccion::findOrFail($id);

        $validated = $request->validate([
            'licitacion_id' => 'nullable|exists:crm.licitaciones,id',
            'persona_id' => 'required|exists:crm.personas,id',
            'tipo' => 'required|string|in:Llamada,Correo,Reunión,WhatsApp',
            'fecha' => 'required|date',
            'notas' => 'required|string',
        ]);

        $interaccion->update($validated);

        return back();
    }

    public function destroy($id)
    {
        $interaccion = Interaccion::findOrFail($id);
        $interaccion->delete();

        return back();
    }
}