<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('crm')->create('valoracion_persona', function (Blueprint $table) {
            $table->id();
            // ¿A quién evaluamos?
            $table->foreignId('persona_id')->constrained('personas')->onDelete('cascade');
            // ¿Quién evalúa? (Usuario de AVA)
            $table->foreignId('user_id')->constrained('usuarios.users');
            
            $table->integer('valoracion'); // Ej: 1 a 5
            $table->text('comentario_evaluacion')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valoracion_persona');
    }
};
