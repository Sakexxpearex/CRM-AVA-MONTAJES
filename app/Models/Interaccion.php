<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interaccion extends Model
{
    // 1. Especificar conexión y tabla explícitamente
    protected $connection = 'crm';
    protected $table = 'interacciones';

    // 2. Definir campos asignables masivamente
    protected $fillable = [
        'licitacion_id',
        'persona_id',
        'user_id',
        'fecha',
        'comentario',
        'tipo_contacto',
        'precalificacion_id', 
    ];

    // 3. Casteos (Para que Laravel sepa automáticamente que 'fecha' es un objeto Date y no un simple texto)
    protected $casts = [
        'fecha' => 'date',
    ];

    // 4. RELACIONES

    /**
     * Una interacción pertenece a una licitación específica.
     */
    public function licitacion()
    {
        return $this->belongsTo(Licitacion::class, 'licitacion_id');
    }

    /**
     * Una interacción se realiza con un contacto (persona) específico del cliente.
     */
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'persona_id');
    }

    /**
     * Una interacción es registrada por un usuario interno (quien hizo la gestión).
     * Nota: Laravel resolverá automáticamente que el modelo User está en otra conexión
     * si tu modelo App\Models\User tiene configurado protected $connection = 'usuarios';
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function precalificacion()
{
    return $this->belongsTo(Precalificacion::class, 'precalificacion_id');
}

    public function getOrigenAttribute(): string
{
    if ($this->precalificacion_id) {
        return 'Precalificación';
    }
    
    if ($this->licitacion_id) {
        return 'Licitación Pipeline';
    }
    
    return 'Contacto General';
}

// Opcional: Para asegurar que se incluya siempre en las respuestas JSON/Inertia
protected $appends = ['origen'];
}