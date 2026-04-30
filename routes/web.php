<?php

use App\Http\Controllers\EmpresaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::apiResource('empresas', EmpresaController::class);

Route::get('/test', function () {
    return 'ok';
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Solo Usuarios logueados
Route::middleware(['auth'])->group(function () {
    // Dashboard principal
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Modulo de empresas
    Route::resource('empresas', EmpresaController::class);
    
    // Aqui irian el resto de rutas, de licitacions, conntactos, etc 

    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
