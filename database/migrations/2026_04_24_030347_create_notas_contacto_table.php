<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notas_contacto', function (Blueprint $table) {
            $table->id();
            
            // 1. ¿Sobre quién es la nota? (Persona)
            $table->foreignId('persona_id')->constrained('personas')->onDelete('cascade');
            
            // 2. ¿Quién escribió la nota? (Usuario del esquema de los profes)
            $table->foreignId('user_id')->constrained('usuarios.users');
            
            // El contenido de la nota
            $table->text('detalle'); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notas_contacto');
    }
};