<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluacion extends Model
{
    use HasFactory;

    protected $connection = 'crm';
    protected $table = 'evaluaciones';

    protected $fillable = [
        'licitacion_id',
        'empresa_id',
        'persona_id',
        'estrellas_empresa',
        'comentario_empresa',
        'estrellas_persona',
        'comentario_persona',
    ];

    public function licitacion()
    {
        return $this->belongsTo(Licitacion::class);
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }
}