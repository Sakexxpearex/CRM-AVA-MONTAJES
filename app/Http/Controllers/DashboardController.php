<?php

namespace App\Http\Controllers;

use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Definimos los estados para que no haya errores de dedo
        $estadosGanadores = ['Adjudicada', 'Operativa'];
        $estadosCerrados = ['Adjudicada', 'Operativa', 'Ganada', 'Perdida', 'Desierta'];

        // 2. Licitaciones Activas (Las que NO están cerradas)
        $totalLicitacionesActivas = Licitacion::whereNotIn('estado_pipeline', $estadosCerrados)->count();

        // 3. Ritmo Mensual (Nuevas licitaciones creadas este mes)
        $nuevasEsteMes = Licitacion::whereMonth('created_at', now()->month)
                                   ->whereYear('created_at', now()->year)
                                   ->count();

        // 4. Totales de Base de Datos
        $totalEmpresas = Empresa::count();
        $totalPersonas = Persona::count();

        // 5. Rendimiento Comercial (Lo que arreglamos con el Tinker)
        $volumenTotal = Licitacion::where('estado_pipeline', $estadosGanadores)->sum('monto_adjudicado');
        $volumen_total_formateado = '$' . number_format($volumenTotal, 0, ',', '.');
        // 6. Win Rate (Ganadas vs Participadas)
        $totalParticipadas = Licitacion::whereIn('estado_pipeline', ['Adjudicada', 'Operativa', 'Ganada', 'Perdida'])->count();
        $totalGanadas = Licitacion::whereIn('estado_pipeline', $estadosGanadores)->count();
        
        $winRate = $totalParticipadas > 0 
            ? round(($totalGanadas / $totalParticipadas) * 100, 1) 
            : 0;


        return Inertia::render('dashboard', [
            'stats' => [
                // Métricas Operativas
                'totalLicitaciones' => $totalLicitacionesActivas,
                'nuevasLicitaciones' => $nuevasEsteMes,
                'totalEmpresas' => $totalEmpresas,
                'totalPersonas' => $totalPersonas,
                
                // Métricas Comerciales
                'volumen_total_formateado' => '$' . number_format($volumenTotal, 0, ',', '.'),
                'win_rate' => $winRate,
                'licitaciones_ganadas' => $totalGanadas,
                'licitaciones_participadas' => $totalParticipadas,
            ]
        ]);
    }
}