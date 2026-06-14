<?php

use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\InteraccionController;
use App\Http\Controllers\LicitacionController;
use App\Http\Controllers\HistorialController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PrecalificacionController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VoiceController;
use Inertia\Inertia;

Route::get('/test', function () {
    return 'ok';
});

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

// Solo Usuarios logueados
Route::middleware(['auth'])->group(function () {
    // Dashboard principal
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/ocultar-alerta', [App\Http\Controllers\DashboardController::class, 'ocultarAlerta'])->name('dashboard.ocultar-alerta');

    // Modulo de empresas
    Route::resource('empresas', EmpresaController::class);

    // Rutas Licitaciones, Personas e interacciones
    Route::resource('licitaciones', LicitacionController::class)
        ->parameters(['licitaciones' => 'licitacion']);
    Route::resource('personas', PersonaController::class);
   
    Route::resource('interacciones', InteraccionController::class);
    Route::post('/historial-laboral', [HistorialController::class, 'store'])->name('historial.store');


    // Ruta para el historial de interacciones del contacto (TimeLine)
    Route::get('/personas/{persona}/interacciones', [PersonaController::class, 'interacciones'])
    ->name('personas.interacciones');

    // Ruta para cambiar estado_pipeline
    Route::patch('/licitaciones/{licitacion}/pipeline', [LicitacionController::class, 'updatePipeline'])
    ->name('licitaciones.update_pipeline');

    // Ruta para cambiar  tablero kanban
    Route::put('/licitaciones/{licitacion}/pipeline', [LicitacionController::class, 'updatePipeline'])
    ->name('licitaciones.updatePipeline'); // <--- Revisa que se llame EXACTAMENTE así

    //Ruta para las divisiones
    Route::post('/divisiones', [DivisionController::class, 'store'])->name('divisiones.store');
    Route::put('/divisiones/{division}', [DivisionController::class, 'update'])->name('divisiones.update');
    Route::delete('/divisiones/{division}', [DivisionController::class, 'destroy'])->name('divisiones.destroy');

    // Rutas de Proyectos
    Route::get('/proyectos', [ProyectoController::class, 'index'])->name('proyectos.index');
    Route::get('/proyectos/{id}', [ProyectoController::class, 'show'])->name('proyectos.show');

    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
   

// 1. Ruta para que el VoiceButton mande el audio y reciba el texto de Whisper
    Route::post('/voice/transcribe', [LicitacionController::class, 'transcribe'])
        ->name('voice.transcribe');

    // 2. Ruta para que el Layout mande el texto y la IA ejecute la acción proactiva
    Route::post('/licitaciones/comando-voz', [LicitacionController::class, 'comandoVoz'])
        ->name('licitaciones.comando-voz');
    
    Route::get('/alertas-estancadas', [App\Http\Controllers\LicitacionController::class, 'alertasIndex'])->name('alertas.index');
    Route::get('/alertas-precalificaciones', [PrecalificacionController::class, 'alertasIndex'])->name('alertas-precalificaciones');

// Rutas para Precalificaciones
    Route::get('/precalificaciones', [PrecalificacionController::class, 'index'])->name('precalificaciones.index');
    Route::post('/precalificaciones', [PrecalificacionController::class, 'store'])->name('precalificaciones.store');
    Route::patch('/precalificaciones/{precalificacion}/estado', [PrecalificacionController::class, 'cambiarEstado'])->name('precalificaciones.estado');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
