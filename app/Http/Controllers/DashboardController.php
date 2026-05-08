<?php

namespace App\Http\Controllers;
use App\Models\Licitacion;
use App\Models\Empresa;
use App\Models\Persona;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        
        return Inertia::render('dashboard', [
            'stats' => [
                'totalLicitaciones' => Licitacion::whereNotIn('estado_pipeline', ['ganada','perdida','Ganada','Perdida'])->count(),
                'totalEmpresas' => Empresa::count(),
                'totalPersonas' => Persona::count(),
                'nuevasLicitaciones' => Licitacion::whereMonth('created_at', now()->month)->whereNotIn('estado_pipeline', ['ganada','perdida','Ganada','Perdida'])->count(),
            
            ]
        ]);
    }
}
