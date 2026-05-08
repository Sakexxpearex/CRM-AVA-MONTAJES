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
        'estado_pipeline',
        'proyecto_id',
        'descripcion',       
        'monto_estimado',   
        'fecha_cierre',      
        'fecha_adjudicacion' 
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
        return $this->belongsTo(Proyecto::class, 'proyecto_id')->withDefault([
                'nombre' => 'Sin Proyecto Asignado (Aún en Licitación)'
        ]);
    }

    public function interacciones(): HasMany
    {
        return $this->hasMany(Interaccion::class, 'licitacion_id');
    }
    
}