<?php

namespace App\Http\Controllers;

use App\Models\HistorialLaboral;
use Illuminate\Http\Request;

class HistorialController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'persona_id'    => 'required|exists:crm.personas,id',
            'division_id'   => 'required|exists:crm.divisiones,id',
            'cargo'         => 'required|string',
            'fecha_inicio'  => 'required|date',
            'estado_actual' => 'boolean',
        ]);

        // Si el nuevo cargo es el actual, ponemos los anteriores en false
        if ($request->estado_actual) {
            HistorialLaboral::where('persona_id', $request->persona_id)
                ->update(['estado_actual' => false]); // Ajusta 'actual' según tu columna en la DB
        }

        $division = \App\Models\Division::findOrFail($validated['division_id']);

        HistorialLaboral::create([
            'persona_id'  => $validated['persona_id'],
            'division_id' => $validated['division_id'],
            'empresa_id'  => \App\Models\Division::find($validated['division_id'])->empresa_id,
            'cargo'       => $validated['cargo'],
            'fecha_inicio'=> $validated['fecha_inicio'],
            'fecha_fin'     => $request->fecha_fin,
            'estado_actual'      => $request->estado_actual ?? false,
        ]);

        return back()->with('message', 'Trayectoria actualizada');
    }
}