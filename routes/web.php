<?php

use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\InteraccionController;
use App\Http\Controllers\LicitacionController;
use App\Http\Controllers\HistorialController;
use Illuminate\Support\Facades\Route;
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
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Modulo de empresas
    Route::resource('empresas', EmpresaController::class);

    // Rutas Licitaciones, Personas e interacciones
    Route::resource('licitaciones', LicitacionController::class);
    Route::resource('personas', PersonaController::class);
    Route::resource('interacciones', InteraccionController::class);
    Route::post('/historial-laboral', [HistorialController::class, 'store'])->name('historial.store');


    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
