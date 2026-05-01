<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    
    protected $connection = 'crm';
    
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

    // --- RELACIONES ---

    public function historialLaboral()
    {
        return $this->hasMany(HistorialLaboral::class, 'persona_id');
    }

    public function trabajoActual()
    {
        return $this->hasOne(HistorialLaboral::class, 'persona_id')
            ->where('estado_actual', true);
    }

    public function divisiones()
    {
        
        return $this->belongsToMany(Division::class, 'historial_laboral', 'persona_id', 'division_id')
            ->withPivot([
                'cargo',
                'estado_actual',
                'fecha_inicio',
                'fecha_fin',
            ])
            ->withTimestamps();
    }

    // Una persona tiene muchas interacciones/reuniones
    public function interacciones()
    {
        return $this->hasMany(Interaccion::class, 'persona_id');
    }

    public function notas()
    {
        return $this->morphMany(Nota::class, 'notable');
    }

    // --- ACCESORIOS ---

    public function getNombreCompletoAttribute()
    {
        
        return trim(preg_replace('/\s+/', ' ', "{$this->nombre_1} {$this->nombre_2} {$this->apellido_1} {$this->apellido_2}"));
    }
}