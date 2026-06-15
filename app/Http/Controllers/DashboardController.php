<?php

namespace App\Http\Controllers;

use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Persona;
use App\Models\Precalificacion;
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
        $volumenTotal = Licitacion::whereIn('estado_pipeline', $estadosGanadores)->sum('monto_adjudicado');
        $volumen_total_formateado = '$' . number_format($volumenTotal, 0, ',', '.');
        // 6. Win Rate (Ganadas vs Participadas)
        $totalParticipadas = Licitacion::whereIn('estado_pipeline', ['Adjudicada', 'Operativa', 'Ganada', 'Perdida'])->count();
        $totalGanadas = Licitacion::whereIn('estado_pipeline', $estadosGanadores)->count();
        
        $winRate = $totalParticipadas > 0 
            ? round(($totalGanadas / $totalParticipadas) * 100, 1) 
            : 0;
        $alertasVencidasCount = Licitacion::whereNotIn('estado_pipeline', ['Ganada', 'Adjudicada', 'Operativa', 'Perdida', 'Cerrada', 'Desierta'])
            ->enAlerta()
            ->count();
        $alertasPrecalifCount = Precalificacion::where('estado', 'Pendiente')
            ->enAlerta()
            ->count();
        $tienePrecalificacionesEstancadas = $alertasPrecalifCount > 0;
        $tieneLicitacionesEstancadas = $alertasVencidasCount > 0;
        $mensajeAlerta = null;

        if ($tieneLicitacionesEstancadas && $tienePrecalificacionesEstancadas) {
            $mensajeAlerta = "Tienes licitaciones y precalificaciones estancadas.";
        } elseif ($tieneLicitacionesEstancadas) {
            $mensajeAlerta = "Tienes licitaciones estancadas.";
        } elseif ($tienePrecalificacionesEstancadas) {
            $mensajeAlerta = "Tienes precalificaciones estancadas.";
        }

        return Inertia::render('dashboard', [
        'alertaDirecta' => !session()->has('ocultar_alerta') ? $mensajeAlerta : null,    
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
                'alertas_vencidas' => $alertasVencidasCount,
                'precalificaciones_vencidas' => $alertasPrecalifCount,
            ]
        ]);
    }
    public function ocultarAlerta()
    {
        session(['ocultar_alerta' => true]);
        return back();
    }
}