<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;
use App\Models\Division;
use App\Models\HistorialLaboral;
use App\Models\Licitacion;
use App\Models\Persona;

class CrmEcosystemSeeder extends Seeder
{
    public function run(): void
    {
        // Clientes y divisiones base del CRM.
        $clientes = [
            [
                'nombre' => 'COMPAÑIA MINERA DOÑA INES DE COLLAHUASI SCM',
                'rut' => '89468900-5',
                'alias' => 'CMDIC',
                'divisiones' => [
                    ['nombre' => 'COLLAHUASI', 'alias' => null],
                    ['nombre' => 'PUERTO PATACHE', 'alias' => null],
                ],
            ],
            [
                'nombre' => 'BHP CHILE INC.',
                'rut' => '86160300-8',
                'alias' => 'BHP',
                'divisiones' => [
                    ['nombre' => 'MINERA ESCONDIDA', 'alias' => 'MEL'],
                    ['nombre' => 'MINERA SPENCE', 'alias' => 'MSSA'],
                ],
            ],
            [
                'nombre' => 'SIERRA GORDA S.C.M.',
                'rut' => '76081590-K',
                'alias' => 'SGSCM',
                'divisiones' => [
                    ['nombre' => 'SIERRA GORDA', 'alias' => 'SG'],
                ],
            ],
            [
                'nombre' => 'CORPORACION NACIONAL DEL COBRE DE CHILE',
                'rut' => '61704000-K',
                'alias' => 'CODELCO',
                'divisiones' => [
                    ['nombre' => 'DIVISIÓN CHUQUICAMATA', 'alias' => 'DCH'],
                    ['nombre' => 'DIVISIÓN SALVADOR', 'alias' => 'DSAL'],
                    ['nombre' => 'DIVISIÓN RADOMIRO TOMIC', 'alias' => 'DRT'],
                    ['nombre' => 'DIVISIÓN MINISTRO HALES', 'alias' => 'DMH'],
                    ['nombre' => 'DIVISIÓN ANDINA', 'alias' => 'DAND'],
                    ['nombre' => 'DIVISIÓN EL TENIENTE', 'alias' => 'DET'],
                    ['nombre' => 'DIVISIÓN GABRIELA MISTRAL', 'alias' => 'DGM'],
                    ['nombre' => 'TRANQUE TALABRE', 'alias' => 'TALABRE'],
                ],
            ],
            [
                'nombre' => 'ANTOFAGASTA MINERALS S.A.',
                'rut' => '93920000-2',
                'alias' => 'AMSA',
                'divisiones' => [
                    ['nombre' => 'MINERA CENTINELA', 'alias' => 'MCEN'],
                    ['nombre' => 'MINERA LOS PELAMBRES', 'alias' => 'MLP'],
                    ['nombre' => 'MINERA ZALDÍVAR', 'alias' => 'CMZ'],
                ],
            ],
            [
                'nombre' => 'MANTOS COPPER S.A.',
                'rut' => '77418580-1',
                'alias' => 'MCSA',
                'divisiones' => [
                    ['nombre' => 'MANTOS BLANCOS', 'alias' => 'DMBL'],
                    ['nombre' => 'MANTO VERDE', 'alias' => 'MV'],
                ],
            ],
        ];

        foreach ($clientes as $cliente) {
            $empresa = Empresa::updateOrCreate(
                ['rut' => $cliente['rut']],
                [
                    'nombre' => $cliente['nombre'],
                    'alias' => $cliente['alias'],
                    'tipo' => 'Cliente',
                ]
            );

            foreach ($cliente['divisiones'] as $division) {
                $division = Division::updateOrCreate(
                    [
                        'empresa_id' => $empresa->id,
                        'nombre' => $division['nombre'],
                    ],
                    [
                        'alias' => $division['alias'],
                    ]
                );

                $this->crearContactoParaDivision($division, $empresa->alias);
            }
        }

        $this->crearLicitaciones();
    }

    private function crearLicitaciones(): void
    {
        $licitaciones = [
            [
                'division_alias' => 'MV',
                'nombre_proyecto' => 'CC-02 SERVICIO ELECTROMECÁNICO OBRAS CONCENTRADORA MVO - MANTO VERDE (DPC 101)',
                'estado_pipeline' => 'Adjudicada',
                'fecha_cierre' => '2025-12-09',
            ],
            [
                'division_alias' => 'TALABRE',
                'nombre_proyecto' => 'OFERTA POR TRABAJOS ADICIONALES II ETAPA TALABRE Y PROYECTO SDNN REV.1 (DPC 663)',
                'estado_pipeline' => 'Presentada',
                'fecha_cierre' => '2025-12-18',
            ],
            [
                'empresa_alias' => 'CMDIC',
                'nombre_proyecto' => 'LIC. PRC25082 SUMINISTRO Y CONSTRUCCIÓN RESTITUCIÓN ORIENTE - CMDIC (DPC 662)',
                'estado_pipeline' => 'Presentada',
                'fecha_cierre' => '2025-12-18',
            ],
            [
                'division_alias' => 'DCH',
                'nombre_proyecto' => '050-25 SERVICIO MANTENIMIENTO INFRAESTRUCTURA CRITICA DCH (DPC 649)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-11-03',
            ],
            [
                'division_alias' => 'MEL',
                'nombre_proyecto' => 'COTIZACIÓN PRESUPUESTARIA PROYECTO "NUEVO RELLENO SANITARIO ESCONDIDA" (DPC 643)',
                'estado_pipeline' => 'Presentada',
                'fecha_cierre' => '2025-10-03',
            ],
            [
                'division_alias' => 'DCH',
                'nombre_proyecto' => 'CS-014-25 OBRAS COMPLEMENTARIAS PARA PROYECTOS DCH - CODELCO (DPC 642)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-10-01',
            ],
            [
                'division_alias' => 'DCH',
                'nombre_proyecto' => 'CC-007 MONTAJE INSTALACIONES ELÉCTRICAS ALTA TENSIÓN - CODELCO DCH (DPC 629)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-07-21',
            ],
            [
                'division_alias' => 'DSAL',
                'nombre_proyecto' => 'CC-003 CONDUCCIÓN DE RELAVES TRAMO II EL SALVADOR - NUEVO ALCANCE (DPC 628)',
                'estado_pipeline' => 'Adjudicada',
                'fecha_cierre' => '2025-07-21',
            ],
            [
                'division_alias' => 'MCEN',
                'nombre_proyecto' => 'REPARACIÓN PISCINA 100K MCEN (DPC 627)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-07-17',
            ],
            [
                'division_alias' => 'MLP',
                'nombre_proyecto' => 'CONTRATO MARCO OBRAS MISCELÁNEAS PROYECTO PAO - LOS PELAMBRES (DPC 625)',
                'estado_pipeline' => 'Adjudicada',
                'fecha_cierre' => '2025-07-03',
            ],
            [
                'division_alias' => 'MSSA',
                'nombre_proyecto' => 'RFQ_10574 MONTAJE CLARIFICADOR LAMELLA - SPENCE (DPC 624)',
                'estado_pipeline' => 'Adjudicada',
                'fecha_cierre' => '2025-06-26',
            ],
            [
                'division_alias' => 'DAND',
                'nombre_proyecto' => 'MITIGACIÓN DE RIESGOS GEOMECÁNICOS Y ESTRUCTURALES STR ANDINA (DPC 613)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-06-12',
            ],
            [
                'division_alias' => 'MCEN',
                'nombre_proyecto' => 'LIC. CC-007 CONSTRUCCIÓN SISTEMA DE AGUA RECUPERADA (SAR) - CENTINELA "OFERTA BAFO" (DPC 610)',
                'estado_pipeline' => 'Adjudicada',
                'fecha_cierre' => '2025-06-02',
            ],
            [
                'division_alias' => 'DMBL',
                'nombre_proyecto' => 'CONSTRUCCIÓN FUNDACIÓN ESPESADOR DE RELAVES HCT - DMBL REV.1 (DPC 599)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-04-30',
            ],
            [
                'empresa_alias' => 'CMDIC',
                'nombre_proyecto' => 'PG210 FILA 16 CELDAS - BECHTEL CMDIC (DPC 597)',
                'estado_pipeline' => 'Adjudicada',
                'fecha_cierre' => '2025-04-17',
            ],
            [
                'division_alias' => 'DCH',
                'nombre_proyecto' => 'CPP-CS-027-24 RESTAURACIÓN SUBESTACIÓN FUCO, DCH (DPC 591)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-03-24',
            ],
            [
                'empresa_alias' => 'CMDIC',
                'nombre_proyecto' => 'PRC25009 NORMALIZACIÓN PISCINA 7 - CMDIC (DPC 590)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-03-20',
            ],
            [
                'division_alias' => 'DCH',
                'nombre_proyecto' => 'CPP-CS-024-24 NORMALIZACIÓN SISTEMA RED CONTRA INCENDIOS CHANCADO PRIMARIO DCH (DPC 589)',
                'estado_pipeline' => 'Perdida',
                'fecha_cierre' => '2025-03-20',
            ],
        ];

        foreach ($licitaciones as $licitacion) {
            $division = $this->resolverDivisionLicitacion($licitacion);

            if (!$division) {
                continue;
            }

            $monto = $this->montoAleatorio($licitacion['nombre_proyecto']);

            Licitacion::updateOrCreate(
                ['nombre_proyecto' => $licitacion['nombre_proyecto']],
                [
                    'empresa_id' => $division->empresa_id,
                    'division_id' => $division->id,
                    'descripcion' => null,
                    'monto_estimado' => $monto,
                    'monto_adjudicado' => $licitacion['estado_pipeline'] === 'Adjudicada' ? $monto : 0,
                    'fecha_cierre' => $licitacion['fecha_cierre'],
                    'fecha_adjudicacion' => $licitacion['estado_pipeline'] === 'Adjudicada' ? $licitacion['fecha_cierre'] : null,
                    'estado_pipeline' => $licitacion['estado_pipeline'],
                    'proyecto_id' => null,
                ]
            );
        }
    }

    private function resolverDivisionLicitacion(array $licitacion): ?Division
    {
        if (isset($licitacion['division_alias'])) {
            return Division::where('alias', $licitacion['division_alias'])->first();
        }

        if (isset($licitacion['empresa_alias'])) {
            return Division::whereHas('empresa', function ($query) use ($licitacion) {
                $query->where('alias', $licitacion['empresa_alias']);
            })->orderBy('id')->first();
        }

        return null;
    }

    private function crearContactoParaDivision(Division $division, string $empresaAlias): void
    {
        $primerosNombres = ['Camila', 'Ignacio', 'Valentina', 'Matías', 'Fernanda', 'Sebastián', 'Paula', 'Rodrigo'];
        $segundosNombres = ['Andrea', 'Javier', 'Isabel', 'Antonio', 'Paz', 'Eduardo', 'Francisca', 'Nicolás'];
        $apellidos = ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva'];
        $cargos = [
            'Gerente de Operaciones',
            'Jefe de Abastecimiento',
            'Superintendente de Contratos',
            'Administrador de Contrato',
            'Jefe de Mantenimiento',
        ];

        $seed = crc32($empresaAlias . '-' . $division->nombre);
        $nombre1 = $primerosNombres[$seed % count($primerosNombres)];
        $nombre2 = $segundosNombres[($seed + 1) % count($segundosNombres)];
        $apellido1 = $apellidos[($seed + 2) % count($apellidos)];
        $apellido2 = $apellidos[($seed + 3) % count($apellidos)];
        $cargo = $cargos[$seed % count($cargos)];
        $emailKey = strtolower(preg_replace('/[^a-z0-9]+/i', '.', $empresaAlias . '.' . ($division->alias ?: $division->nombre)));

        $persona = Persona::updateOrCreate(
            ['email' => $emailKey . '@example.com'],
            [
                'rut' => $this->rutAleatorio($seed),
                'division_id' => $division->id,
                'nombre_1' => $nombre1,
                'nombre_2' => $nombre2,
                'apellido_1' => $apellido1,
                'apellido_2' => $apellido2,
                'telefono' => '+569' . str_pad((string) ($seed % 100000000), 8, '0', STR_PAD_LEFT),
                'perfil_linkedin' => 'https://www.linkedin.com/in/' . strtolower($nombre1 . '-' . $apellido1 . '-' . $emailKey),
            ]
        );

        HistorialLaboral::updateOrCreate(
            [
                'persona_id' => $persona->id,
                'division_id' => $division->id,
            ],
            [
                'cargo' => $cargo,
                'estado_actual' => true,
                'fecha_inicio' => now()->subYears(($seed % 5) + 1),
                'fecha_fin' => null,
            ]
        );
    }

    private function montoAleatorio(string $texto): int
    {
        return 1000000000 + ((crc32($texto) % 9001) * 1000000);
    }

    private function rutAleatorio(int $seed): string
    {
        $numero = 10000000 + ($seed % 15000000);
        $reversed = array_reverse(str_split((string) $numero));
        $sum = 0;

        foreach ($reversed as $index => $digit) {
            $sum += (int) $digit * (($index % 6) + 2);
        }

        $digit = 11 - ($sum % 11);
        $verificador = match ($digit) {
            11 => '0',
            10 => 'K',
            default => (string) $digit,
        };

        return $numero . '-' . $verificador;
    }
}
