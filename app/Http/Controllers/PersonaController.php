<?php

namespace App\Http\Controllers;

use App\Models\Persona; 
use App\Models\Empresa;
use App\Models\Division;
use App\Models\Licitacion;
use App\Models\HistorialLaboral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PersonaController extends Controller
{
    public function index()
    {
        // Traemos a las personas y el nombre de la empresa donde trabajan
        $personas = Persona::with(['trabajoActual.division.empresa'])->get();

        // Traemos las divisiones con sus empresas para el <select>
        $divisiones = Division::with('empresa')->get();
        
        // Mandamos las empresas para el <select> del modal de creación
        $empresas = Empresa::all();

        return Inertia::render('personas/Index', [
            'personas' => $personas,
            'divisiones' => $divisiones,
            'empresas' => $empresas
        ]);
    }

public function store(Request $request)
{
    $telefono = preg_replace('/\D/', '', $request->input('telefono', ''));

    $request->merge([
        'telefono' => $telefono
        ? '+56' . substr($telefono, -9)
        :null,
    ]);

    // 1. Validamos
    $validated = $request->validate([
        'nombre_1'      => 'required|string',
        'apellido_1'    => 'required|string',
        'rut'           => 'required|unique:crm.personas,rut',
        'empresa_id'    => 'required|exists:crm.empresas,id',
        'telefono'      => 'required|regex:/^\+56[0-9]{9}$/',
        'cargo_actual'  => 'required|string',
        'division_id'   => 'nullable|exists:crm.divisiones,id',
    ]);

    return DB::transaction(function () use ($request, $validated) {
        
        // 2. Creamos la persona INCLUYENDO el division_id
        $persona = Persona::create([
            'nombre_1'    => $validated['nombre_1'],
            'nombre_2'    => $request->nombre_2,
            'apellido_1'  => $validated['apellido_1'],
            'apellido_2'  => $request->apellido_2,
            'rut'         => $request->rut,
            'email'       => $request->email,
            'telefono'    => $request->telefono,
            'division_id' => $validated['division_id'], // <-- ESTO ARREGLA EL ERROR 500
        ]);

        // 3. Creamos el historial laboral inicial (esto se mantiene igual)
        $persona->historialLaboral()->create([
            'empresa_id'    => $validated['empresa_id'],
            'division_id'   => $validated['division_id'],
            'cargo'         => $validated['cargo_actual'],
            'fecha_inicio'  => now(),
            'estado_actual' => true
        ]);

        return redirect()->route('personas.index')->with('message', 'Contacto creado con éxito');
    });
}
    public function show(Persona $persona)
    {
        // Cargamos todas las relaciones para que la página de Detalle se vea completa
        $persona->load([
            'historialLaboral.division.empresa',
            'trabajoActual.division.empresa',
            'notas.user',
            'interacciones' => function($query) {
                $query->with(['user', 'licitacion'])->latest();
            },
           
        ]);

        return Inertia::render('personas/Show', [
            'persona' => $persona,
            'divisiones' => Division::with('empresa')->get(),
            'licitaciones' => Licitacion::select('id', 'nombre_proyecto as nombre')->get()
        ]);
    }

    public function interacciones(Persona $persona)
    {
        return Inertia::render('personas/Interacciones', [
            'persona' => $persona->load(['interacciones.user', 'interacciones.licitacion']),
        ]);
    }

    public function update(Request $request, Persona $persona)
    {
        $telefono = preg_replace('/\D/', '', $request->input('telefono', ''));

        $request->merge([
            'telefono' => $telefono
            ? '+56' . substr($telefono, -9)
            :null,
        ]);

        $validated = $request->validate([
            'rut'           => 'required|string',
            'nombre_1'      => 'required|string',
            'nombre_2'      => 'required|string',
            'apellido_1'    => 'required|string',
            'apellido_2'    => 'required|string',
            'email'         => 'nullable|email',
            'telefono'      => 'required|regex:/^\+56[0-9]{9}$/'
        ]);

        $persona->update($validated);

        return back()->with('message', 'Datos actualizados');
    }

    public function destroy(Persona $persona)
    {
        $persona->delete();
        return redirect()->route('personas.index');
    }
}