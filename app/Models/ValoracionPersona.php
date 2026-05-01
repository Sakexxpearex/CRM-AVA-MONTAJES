<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValoracionPersona extends Model
{
    // 1. Conexión y tabla
    protected $connection = 'crm';
    protected $table = 'valoracion_persona';

    // 2. Campos asignables
    protected $fillable = [
        'persona_id',
        'user_id',
        'valoracion',
        'comentario_evaluacion',
    ];

    // 3. Casteos (aseguramos que la valoración siempre se trate como un número entero)
    protected $casts = [
        'valoracion' => 'integer',
    ];

    // 4. RELACIONES

    /**
     * Esta valoración pertenece a una persona específica.
     */
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'persona_id');
    }

    /**
     * El usuario interno (AVA) que emitió esta valoración.
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}