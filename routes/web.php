<?php

use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\InteraccionController;
use App\Http\Controllers\LicitacionController;
use App\Http\Controllers\HistorialController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\DashboardController;
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

    // Modulo de empresas
    Route::resource('empresas', EmpresaController::class);

    // Rutas Licitaciones, Personas e interacciones
    Route::resource('licitaciones', LicitacionController::class);
    Route::resource('personas', PersonaController::class);
   
    Route::resource('interacciones', InteraccionController::class);
    Route::post('/historial-laboral', [HistorialController::class, 'store'])->name('historial.store');

    // Ruta para redirigir una licitacion a proyectos
    Route::post('/licitaciones/{id}/adjudicar', [LicitacionController::class, 'adjudicar'])
    ->name('licitaciones.adjudicar');

    // Ruta para el historial de interacciones del contacto (TimeLine)
    Route::get('/personas/{persona}/interacciones', [PersonaController::class, 'interacciones'])
        ->name('personas.interacciones');

    // Ruta para editar licitacion  
    Route::put('/licitaciones/{licitacion}', [LicitacionController::class, 'update'])
    ->name('licitaciones.update');

    // Ruta para cambiar estado_pipeline
    Route::patch('/licitaciones/{licitacion}/pipeline', [LicitacionController::class, 'updatePipeline'])
    ->name('licitaciones.update_pipeline');

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
   

    //Transcripcion
    Route::post('/voice/transcribe', [VoiceController::class, 'transcribe'])->name('voice.transcribe');
    //Comandos por voz
    Route::post('/licitaciones/comando-voz', [LicitacionController::class, 'comandoVoz'])->name('licitaciones.comando-voz');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
