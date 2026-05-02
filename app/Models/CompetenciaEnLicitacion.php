<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetenciaEnLicitacion extends Model
{
    // 1. Conexión y tabla explícitas
    protected $connection = 'crm';
    protected $table = 'competencia_en_licitacion';

    // 2. Campos asignables masivamente
    protected $fillable = [
        'licitacion_id',
        'empresa_id',
    ];

    // 3. RELACIONES

    /**
     * Esta competencia pertenece a una licitación en específico.
     */
    public function licitacion()
    {
        return $this->belongsTo(Licitacion::class, 'licitacion_id');
    }

    /**
     * La empresa que está compitiendo.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }
}