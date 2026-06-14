<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proyecto;
use App\Models\Licitacion;
use App\Models\Division;

class LicitacionesSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Simular que los profesores de AVA crearon un Proyecto
        // ¡Solo usamos centro_costo, nombre y alias!
        $proyectoAva = Proyecto::firstOrCreate(
            ['centro_costo' => 'CC-MIN-001'],
            [
                'nombre' => 'Ejecución Contrato Chuquicamata 2026',
                'alias' => 'DCH-2026'
            ]
        );

        // 2. Rescatar las divisiones
        $chuquicamata = Division::where('alias', 'DCH')->first();
        $escondida = Division::where('alias', 'MEL')->first();

        if (!$chuquicamata || !$escondida) {
            $this->command->error('No encontré las divisiones. ¿Corriste el ecosistema primero?');
            return;
        }

        // 3. CASO A: Licitación GANADA (Conectada al proyecto AVA y con todos los campos nuevos)
        Licitacion::create([
            'empresa_id' => $chuquicamata->empresa_id,
            'division_id' => $chuquicamata->id,
            'nombre_proyecto' => 'Renovación Sistemas de Control DCH',
            'descripcion' => 'Reemplazo de tableros y sistemas SCADA en planta chancadora.',
            'estado_pipeline' => 'Adjudicada',
            'monto_estimado' => 1500000.00,
            'fecha_cierre' => now()->subDays(10),
            'fecha_adjudicacion' => now()->subDays(2),
            'proyecto_id' => $proyectoAva->id, // <-- ¡El puente!
        ]);

        // 4. CASO B: Licitación NUEVA (Solo comercial, en evaluación)
        Licitacion::create([
            'empresa_id' => $escondida->empresa_id,
            'division_id' => $escondida->id,
            'nombre_proyecto' => 'Mantención Chancadores MEL',
            'descripcion' => 'Mantenimiento preventivo anual de la flota de chancadores primarios.',
            'estado_pipeline' => 'Evaluación',
            'monto_estimado' => 3500000.00,
            'fecha_cierre' => now()->addDays(20),
            'fecha_adjudicacion' => null,
            'proyecto_id' => null, // <-- Aún no tiene proyecto
        ]);

        // 5. CASO C: Licitación PERDIDA (Data ideal para el modelo predictivo)
        Licitacion::create([
            'empresa_id' => $chuquicamata->empresa_id,
            'division_id' => $chuquicamata->id,
            'nombre_proyecto' => 'Ampliación Campamento Minero',
            'descripcion' => 'Construcción de 50 nuevos módulos habitacionales.',
            'estado_pipeline' => 'Perdida',
            'monto_estimado' => 850000.00,
            'fecha_cierre' => now()->subDays(45),
            'fecha_adjudicacion' => now()->subDays(30),
            'proyecto_id' => null,
        ]);
    }
}