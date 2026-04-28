<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $table = 'divisiones';

    protected $fillable = [
        'empresa_id',
        'nombre',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function historialesLaborales()
    {
        return $this->hasMany(HistorialLaboral::class);
    }

    public function personas()
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
}