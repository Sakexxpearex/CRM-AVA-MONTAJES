<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

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
        'fecha_inicio',
    ];

    protected $appends = ['dias_retraso_alerta'];

    // --- RELACIONES ---

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

    // --- LÓGICA DE ALERTAS (Espejo de Licitacion.php pero con 15 días) ---

    public function scopeEnAlerta($query)
    {
        $limiteDias = now()->subDays(15)->toDateString();

        return $query->where(function ($mainQuery) use ($limiteDias) {
            
            // CASO 1: SIN interacciones
            $mainQuery->where(function ($q) use ($limiteDias) {
                $q->whereDoesntHave('interacciones')
                  ->where(function ($sub) use ($limiteDias) {
                      $sub->where('fecha_inicio', '<', $limiteDias)
                          ->orWhere(function ($nullQuery) use ($limiteDias) {
                              $nullQuery->whereNull('fecha_inicio')
                                        ->where('created_at', '<', $limiteDias);
                          });
                  });
            })
            
            // CASO 2: CON interacciones, pero la última es vieja
            ->orWhere(function ($q) use ($limiteDias) {
                $q->whereHas('interacciones')
                  ->whereDoesntHave('interacciones', function ($subQ) use ($limiteDias) {
                      $subQ->where('fecha', '>=', $limiteDias);
                  });
            });
        });
    }

    public function getDiasRetrasoAlertaAttribute()
    {
        $ultimaInteraccion = $this->interacciones->sortByDesc('fecha')->first();
        
        if ($ultimaInteraccion && !is_null($ultimaInteraccion->fecha)) {
            $fechaRef = $ultimaInteraccion->fecha;
        } elseif (!is_null($this->fecha_inicio)) {
            $fechaRef = $this->fecha_inicio;
        } else {
            $fechaRef = $this->created_at;
        }

        if (!$fechaRef) return 0;

        $fechaBase = Carbon::parse($fechaRef)->startOfDay();
        $hoy = Carbon::now()->startOfDay();
        
        if ($fechaBase->isFuture()) return 0;
            
        $diasTranscurridos = $fechaBase->diffInDays($hoy);
        
        return ($diasTranscurridos > 15) ? (int) ($diasTranscurridos - 15) : 0;
    }
}