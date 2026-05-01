<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialLaboral extends Model
{
    protected $connection = 'crm';
    protected $table = 'historial_laboral';

    protected $fillable = [
        'persona_id',
        'division_id',
        'cargo',
        'estado_actual',
        'fecha_inicio',
        'fecha_fin',
    ];

    protected $casts = [
        'estado_actual' => 'boolean',
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    
    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}