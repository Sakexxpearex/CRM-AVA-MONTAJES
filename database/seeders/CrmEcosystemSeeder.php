<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;
use App\Models\Division;
use App\Models\Persona;
use App\Models\HistorialLaboral;
use App\Models\Nota;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CrmEcosystemSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Obtenemos un usuario para asociar las notas (tu usuario de AVA)
        $admin = DB::connection('usuarios')->table('usuarios.users')->first();
        

        // 2. Datos de la imagen (Mineras y Divisiones)
        $clientes = [
            [
                'nombre' => 'CORPORACION NACIONAL DEL COBRE DE CHILE',
                'rut' => '61704000-K',
                'alias' => 'CODELCO',
                'divisiones' => [
                    ['nombre' => 'DIVISIÓN CHUQUICAMATA', 'alias' => 'DCH'],
                    ['nombre' => 'DIVISIÓN EL TENIENTE', 'alias' => 'DET'],
                    ['nombre' => 'DIVISIÓN ANDINA', 'alias' => 'DAND'],
                ]
            ],
            [
                'nombre' => 'BHP CHILE INC.',
                'rut' => '86160300-8',
                'alias' => 'BHP',
                'divisiones' => [
                    ['nombre' => 'MINERA ESCONDIDA LTDA.', 'alias' => 'MEL'],
                    ['nombre' => 'MINERA SPENCE S.A.', 'alias' => 'MSSA'],
                ]
            ],
            [
                'nombre' => 'ANTOFAGASTA MINERALS S.A.',
                'rut' => '93920002-2',
                'alias' => 'AMSA',
                'divisiones' => [
                    ['nombre' => 'MINERA CENTINELA', 'alias' => 'MCEN'],
                    ['nombre' => 'MINERA LOS PELAMBRES', 'alias' => 'MLP'],
                ]
            ]
        ];

        foreach ($clientes as $c) {
            $empresa = Empresa::create([
                'nombre' => $c['nombre'],
                'rut' => $c['rut'],
                'alias' => $c['alias'],
                'tipo' => 'Cliente'
            ]);

            foreach ($c['divisiones'] as $d) {
                $division = Division::create([
                    'empresa_id' => $empresa->id,
                    'nombre' => $d['nombre'],
                    'alias' => $d['alias']
                ]);

                // 3. Crear un contacto (Persona) por cada división para poblar el CRM
                $persona = Persona::create([
                    'nombre_1' => 'Juan',
                    'nombre_2' => 'Ignacio',
                    'apellido_1' => 'Pérez',
                    'apellido_2' => 'García',
                    'email' => "contacto.{$d['alias']}@minera.cl",
                    'telefono' => '+56912345678',
                    'division_id' => $division->id
                ]);

                // 4. Vincular Persona con su Trabajo Actual
                HistorialLaboral::create([
                    'persona_id' => $persona->id,
                    'division_id' => $division->id,
                    'cargo' => 'Gerente de Operaciones',
                    'estado_actual' => true,
                    'fecha_inicio' => now()->subYears(2),
                    
                ]);

                // 5. Crear una nota polimórfica inicial
                if ($admin) {
                    $persona->notas()->create([
                        'detalle' => "Contacto clave para futuras licitaciones en {$d['nombre']}.",
                        'user_id' => $admin->id
                    ]);
                }
            }
        }
    }
}