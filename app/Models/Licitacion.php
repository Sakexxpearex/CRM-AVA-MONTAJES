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
        'fecha_cierre', 
        'fecha_adjudicacion', 
        'estado_pipeline', 
        'proyecto_id'
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
    
}