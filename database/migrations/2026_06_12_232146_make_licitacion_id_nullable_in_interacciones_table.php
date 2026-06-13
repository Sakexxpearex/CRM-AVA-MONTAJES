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
        Schema::connection('crm')->table('interacciones', function (Blueprint $table) {
            // 🌟 El truco está en volver a declarar la columna, agregar ->nullable() y finalizar con ->change()
            $table->foreignId('licitacion_id')
                ->nullable()
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('crm')->table('interacciones', function (Blueprint $table) {
            // Si necesitas revertir la migración, vuelve a dejarla obligatoria (sin nullable)
            $table->foreignId('licitacion_id')
                ->nullable(false)
                ->change();
        });
    }
};