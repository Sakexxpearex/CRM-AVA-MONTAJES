<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $connection = 'crm';    
    protected $table = 'empresas';

    protected $fillable = [
        'rut',
        'nombre',
        'tipo',
    ];

    public function divisiones()
    {
        return $this->hasMany(Division::class);
    }
}