<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $connection = 'crm';
    protected $table = 'notas';

    protected $fillable = ['detalle', 'user_id', 'notable_id', 'notable_type'];

    // Relación polimórfica: Esta nota pertenece a "algo" (Persona o Empresa)
    public function notable()
    {
        return $this->morphTo();
    }
}