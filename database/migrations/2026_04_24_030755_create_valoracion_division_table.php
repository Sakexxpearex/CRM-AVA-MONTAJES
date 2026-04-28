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
        Schema::connection('crm')->create('valoracion_division', function (Blueprint $table){
            $table->id();
            // ¿A qué división evaluamos?
            $table->foreignId('division_id')->constrained('divisiones')->onDelete('cascade');
            // ¿Quién evalúa? (Usuario de AVA)
            $table->foreignId('user_id')->constrained('usuarios.users');
            
            $table->integer('valoracion');
            $table->text('comentario_evaluacion')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valoracion_division');
    }
};
