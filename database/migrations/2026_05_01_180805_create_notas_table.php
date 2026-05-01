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
        Schema::connection('crm')->create('notas', function (Blueprint $table) {
            $table->id();
            $table->text('detalle'); // El contenido de la nota
            
            // Crea automáticamente 'notable_id' y 'notable_type'
            $table->morphs('notable'); 
            
            // Quien escribe la nota (Usuario de AVA)
            $table->foreignId('user_id')->constrained('usuarios.users');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notas');
    }
};
