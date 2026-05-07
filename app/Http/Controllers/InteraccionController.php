<?php

namespace App\Http\Controllers;

use App\Models\Interaccion;
use App\Models\Licitacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InteraccionController extends Controller
{
    public function store(Request $request)
    {
        // Validamos usando los nombres de tu $fillable
        $validated = $request->validate([
            'persona_id'    => 'required|exists:crm.personas,id',
            'licitacion_id' => 'nullable|exists:crm.licitaciones,id',
            'tipo_contacto' => 'required|string',
            'fecha'         => 'required|date',
            'comentario'    => 'required|string',
        ]);

        // Creamos la interacción
        Interaccion::create([
            'persona_id'    => $validated['persona_id'],
            'licitacion_id' => $validated['licitacion_id'],
            'tipo_contacto' => $validated['tipo_contacto'],
            'fecha'         => $validated['fecha'],
            'comentario'    => $validated['comentario'],
            'user_id'       => Auth::id(), // Tomamos el ID del usuario logueado
        ]);

        // Volvemos atrás para que Inertia refresque la bitácora automáticamente
        return back()->with('success', 'Gestión guardada.');
    }
}