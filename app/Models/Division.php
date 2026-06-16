<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $connection = 'crm';
    protected $table = 'divisiones';

    protected $fillable = [
        'empresa_id',
        'nombre',
        'alias',
    ];

    // 1. Relación con la Empresa (Papá)
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    // 2. Relación Directa con Personas (Tus contactos actuales)
    // Usamos esta porque acabas de añadir division_id a la tabla personas
    public function personas()
    {
        return $this->hasMany(Persona::class, 'division_id');
    }

    // 3. Relación Histórica (Por si quieres ver quién trabajó aquí antes)
    public function historialPersonas()
    {
        return $this->belongsToMany(Persona::class, 'historial_laboral')
            ->withPivot([
                'cargo',
                'estado_actual',
                'fecha_inicio',
                'fecha_fin',
            ])
            ->withTimestamps();
    }
    // Relación con las evaluaciones de esa sucursal
    public function evaluaciones()
    {
        return $this->hasMany(Evaluacion::class, 'division_id');
    }

    // Calcula el promedio de estrellas de la EMPRESA en esta división
    public function getPromedioEstrellasAttribute()
    {
        $promedio = $this->evaluaciones()->avg('estrellas_empresa');
        return $promedio ? round($promedio, 1) : 0;
    }

    // Fuerza a Laravel a enviar este dato siempre
    protected $appends = ['promedio_estrellas'];

    // 4. Atributo para mostrar "Empresa - División" (Ej: Codelco - El Teniente)
    public function getNombreCompletoAttribute()
    {
        // Cargamos la relación si no está para evitar errores
        $empresaNombre = $this->empresa->alias ?: $this->empresa->nombre;
        $divisionNombre = $this->alias ?: $this->nombre;
        return "{$empresaNombre} - {$divisionNombre}";
    }
}