<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    protected $table = 'personas';

    protected $fillable = [
        'rut',
        'nombre_1',
        'nombre_2',
        'apellido_1',
        'apellido_2',
        'email',
        'telefono',
        'perfil_linkedin',
    ];

    protected $casts = [
        // Por si se agregan fechas
    ];

    public function historialLaboral()
    {
        return $this->hasMany(HistorialLaboral::class);
    }

    public function trabajoActual()
    {
        return $this->hasOne(HistorialLaboral::class)
            ->where('estado_actual', true);
    }

    public function divisiones()
    {
        return $this->belongsToMany(Division::class, 'historial_laboral')
            ->withPivot([
                'cargo',
                'estado_actual',
                'fecha_inicio',
                'fecha_fin',
            ])
            ->withTimestamps();
    }

    public function getNombreCompletoAttribute()
    {
        return trim("{$this->nombre_1} {$this->nombre_2} {$this->apellido_1} {$this->apellido_2}");
    }
    public function notas()
    {
        return $this->morphMany(Nota::class, 'notable');
    }
}