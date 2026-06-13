<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::on('usuarios')->updateOrCreate(
            ['email' => 'usuario@ava.cl'], 
            [
                'nombre_1'   => 'Juan',
                'nombre_2'   => 'Carlos',
                'apellido_1' => 'Pérez',
                'apellido_2' => 'Gómez',
                'cargo'      => 'Administrador CRM',
                'rut'        => '12.345.678-9',
                'password'   => 'password123', 
            ]
        );


        $this->call([
            CrmEcosystemSeeder::class,
        ]);
    }


}
