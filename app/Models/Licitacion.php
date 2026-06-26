<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Licitacion extends Model
{
    // 1. Especificar la conexión y el nombre exacto de la tabla
    // (Laravel a veces traduce mal los plurales en español, así evitamos que busque "licitacions")
    protected $connection = 'crm';
    protected $table = 'licitaciones';
    

    // 2. Definir los campos que pueden ser llenados a través de formularios
protected $fillable = [
        'empresa_id', 
        'division_id', 
        'nombre_proyecto', 
        'descripcion', 
        'monto_estimado', 
        'monto_adjudicado', 
        'certidumbre',
        'fecha_cierre', 
        'fecha_inicio', 
        'fecha_adjudicacion', 
        'estado_pipeline', 
        'proyecto_id'
    ];

    protected $appends = ['dias_retraso_alerta'];
    protected $casts = [
        'fecha_cierre' => 'date',
        'fecha_inicio' => 'date',
        'fecha_adjudicacion' => 'date',
    ];

    // 3. RELACIONES

    /**
     * Una licitación pertenece a una empresa.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    /**
     * Una licitación pertenece a una división.
     */
    public function division()
    {
        return $this->belongsTo(Division::class, 'division_id');
    }

    /**
     * Una licitación puede estar asociada a un proyecto (es nullable, así que puede devolver null).
     */
    public function proyecto()
{
    // Aunque estén en bases de datos distintas, Eloquent lo resuelve
    return $this->belongsTo(Proyecto::class, 'proyecto_id');
}

    public function interacciones(): HasMany
    {
        return $this->hasMany(Interaccion::class, 'licitacion_id');
    }
    
   // En tu modelo Licitacion.php

public function scopeEnAlerta($query)
{
    // Restamos 30 días exactos desde hoy hacia atrás
    $limiteDias = now()->subDays(30)->toDateString();

    // Envolvemos TODO dentro de un único where para que respete filtros externos del controlador
    return $query->where(function ($mainQuery) use ($limiteDias) {
        
        // =================================================================
        // CASO 1: Licitaciones SIN interacciones
        // =================================================================
        $mainQuery->where(function ($q) use ($limiteDias) {
            $q->whereDoesntHave('interacciones')
              ->where(function ($sub) use ($limiteDias) {
                  // Si tiene fecha_inicio y ya pasaron los 30 días
                  $sub->where('fecha_inicio', '<', $limiteDias)
                      // O si no tiene fecha_inicio, medimos desde su creación
                      ->orWhere(function ($nullQuery) use ($limiteDias) {
                          $nullQuery->whereNull('fecha_inicio')
                                    ->where('created_at', '<', $limiteDias);
                      });
              });
        })
        
        // =================================================================
        // CASO 2: Licitaciones CON interacciones, pero la última es vieja
        // =================================================================
        ->orWhere(function ($q) use ($limiteDias) {
            $q->whereHas('interacciones')
              ->whereDoesntHave('interacciones', function ($subQ) use ($limiteDias) {
                  // Nos aseguramos de que NO existan gestiones comerciales recientes
                  $subQ->where('fecha', '>=', $limiteDias);
              });
        });

    });
}

public function getDiasRetrasoAlertaAttribute()
{
    // 1. Extraemos la última interacción
    $ultimaInteraccion = $this->interacciones->sortByDesc('fecha')->first();
    
    // 2. Buscamos la fecha base con comprobaciones estrictas (!is_null es más seguro que empty)
    if ($ultimaInteraccion && !is_null($ultimaInteraccion->fecha)) {
        $fechaRef = $ultimaInteraccion->fecha;
    } elseif (!is_null($this->fecha_inicio)) {
        $fechaRef = $this->fecha_inicio;
    } else {
        $fechaRef = $this->created_at;
    }

    // Prevención de errores si algo llega totalmente nulo
    if (!$fechaRef) return 0;

    // 3. Forzamos la conversión
    $fechaBase = \Carbon\Carbon::parse($fechaRef)->startOfDay();
    $hoy = \Carbon\Carbon::now()->startOfDay();
    
    // Si por error de tipeo en base de datos la fecha está en el futuro, evitamos números raros
    if ($fechaBase->isFuture()) {
        return 0;
    }
        
    // 4. Calculamos la diferencia
    $diasTranscurridos = $fechaBase->diffInDays($hoy);
    
    // 5. Restamos los 30 días de gracia
    if ($diasTranscurridos > 30) {
        return (int) $diasTranscurridos - 30;
    }
    
    return 0;
}
}