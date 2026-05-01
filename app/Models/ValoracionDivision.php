<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValoracionDivision extends Model
{
    // 1. Conexión y tabla
    protected $connection = 'crm';
    protected $table = 'valoracion_division';

    // 2. Campos asignables
    protected $fillable = [
        'division_id',
        'user_id',
        'valoracion',
        'comentario_evaluacion',
    ];

    protected $casts = [
        'valoracion' => 'integer',
    ];

    // 3. RELACIONES

    /**
     * Esta valoración pertenece a una división específica.
     */
    public function division()
    {
        return $this->belongsTo(Division::class, 'division_id');
    }

    /**
     * El usuario interno (AVA) que emitió esta valoración.
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}