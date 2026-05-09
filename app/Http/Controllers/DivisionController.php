<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class DivisionController extends Controller
{
    /**
     * Almacena una nueva división vinculada a una empresa.
     */
    public function store(Request $request)
    {
        // 1. Validación estricta
        $validated = $request->validate([
            'nombre'     => 'required|string|max:255',
            'empresa_id' => 'required|exists:crm.empresas,id', // Validamos en la conexión crm
            'alias'      => 'nullable|string|max:50',
        ], [
            'nombre.required'     => 'El nombre de la división es obligatorio.',
            'empresa_id.exists'   => 'La empresa seleccionada no es válida.',
        ]);

        // 2. Creación del registro
        Division::create($validated);

        // 3. Redirección con feedback para Inertia
        return Redirect::back()->with('success', 'División creada correctamente.');
    }

    /**
     * Eliminar una división (opcional)
     */
    public function destroy(Division $division)
    {
        // Verificar si tiene personas asociadas antes de borrar si quieres evitar errores
        if ($division->historialesLaborales()->count() > 0) {
            return Redirect::back()->with('error', 'No se puede eliminar una división con personal asociado.');
        }

        $division->delete();
        return Redirect::back()->with('success', 'División eliminada.');
    }
}