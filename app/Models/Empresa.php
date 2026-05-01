<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    // 1. Conexión y tabla explícitas
    protected $connection = 'crm';
    protected $table = 'empresas';

    // 2. Campos asignables masivamente
    protected $fillable = [
        'rut',
        'nombre',
        'tipo',
    ];

    // 3. RELACIONES

    /**
     * Una empresa puede tener múltiples divisiones.
     */
    public function divisiones()
    {
        return $this->hasMany(Division::class, 'empresa_id');
    }

    /**
     * Una empresa (tipo 'Cliente') puede tener muchas licitaciones publicadas.
     */
    public function licitaciones()
    {
        return $this->hasMany(Licitacion::class, 'empresa_id');
    }

    /**
     * Una empresa (tipo 'Competencia') puede aparecer compitiendo en muchas licitaciones.
     */
    public function competenciasEnLicitaciones()
    {
        return $this->hasMany(CompetenciaEnLicitacion::class, 'empresa_id');
    }

    /**
     * Relación Polimórfica: Una empresa puede tener muchas notas internas.
     */
    public function notas()
    {
        return $this->morphMany(Nota::class, 'notable');
    }
}