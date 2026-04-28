<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('crm')->create('interacciones', function (Blueprint $table) {
            $table->id();
            
            // 1. ¿En qué contexto? (Licitación)
            $table->foreignId('licitacion_id')->constrained('licitaciones')->onDelete('cascade');
            
            // 2. ¿Con quién del cliente? (Persona externa)
            $table->foreignId('persona_id')->constrained('personas')->onDelete('cascade');
            
            // 3. ¿Quién de AVA hizo la gestión? (Usuario interno de la tabla de los profes)
            // Aquí referenciamos el esquema 'usuarios' y la tabla 'users'
            $table->foreignId('user_id')->constrained('usuarios.users');
            
            // Datos de la reunión/gestión
            $table->date('fecha');
            $table->text('comentario'); // Aquí el gerente escribe el "chisme" de la reunión
            
            // Tipo de contacto para filtrar después
            $table->enum('tipo_contacto', ['Reunión Presencial', 'Llamada', 'Correo', 'WhatsApp', 'Otro']);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interacciones');
    }
};