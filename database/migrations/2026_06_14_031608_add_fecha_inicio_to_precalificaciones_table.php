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
        Schema::connection('crm')->table('precalificaciones', function (Blueprint $table) {
            $table->date('fecha_inicio')->nullable()->after('estado');
        });
    }

    public function down(): void
    {
        Schema::connection('crm')->table('precalificaciones', function (Blueprint $table) {
            $table->dropColumn('fecha_inicio');
        });
    }
};
