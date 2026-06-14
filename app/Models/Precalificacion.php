<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Precalificacion extends Model
{
    
    protected $connection = 'crm';
    protected $table = 'precalificaciones';

    protected $fillable = [
        'empresa_id',
        'division_id',
        'persona_id',
        'nombre_precalificacion',
        'monto_estimado',
        'descripcion',
        'resumen_visita',
        'archivo_multimedia',
        'estado',
    ];

    

    
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'division_id');
    }

    
    public function persona(): BelongsTo
    {
        return $this->belongsTo(Persona::class, 'persona_id');
    }

    
    public function interacciones(): HasMany
    {
        return $this->hasMany(Interaccion::class, 'precalificacion_id');
    }

   
}