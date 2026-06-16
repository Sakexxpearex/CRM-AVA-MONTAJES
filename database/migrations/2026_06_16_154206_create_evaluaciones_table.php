<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up()
    {
        Schema::connection('crm')->create('evaluaciones', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('licitacion_id')->constrained('crm.licitaciones')->onDelete('cascade');
            
            // Agregamos los 3 niveles jerárquicos
            $table->foreignId('empresa_id')->nullable()->constrained('crm.empresas')->onDelete('cascade');
            $table->foreignId('division_id')->nullable()->constrained('crm.divisiones')->onDelete('cascade');
            $table->foreignId('persona_id')->nullable()->constrained('crm.personas')->onDelete('cascade');
            
            // Notas
            $table->integer('estrellas_empresa')->nullable(); // Esta nota le pega a la división y a la empresa
            $table->text('comentario_empresa')->nullable();
            
            $table->integer('estrellas_persona')->nullable(); // Esta nota le pega solo al contacto
            $table->text('comentario_persona')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::connection('crm')->dropIfExists('evaluaciones');
    }
};