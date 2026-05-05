<?php

use App\Http\Controllers\EmpresaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/test', function () {
    return 'ok';
});

Route::get('/', function () {
    return redirect()->route('login');
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

    //Falta el PersonaController
    //Route::resource('personas', PersonaController::class);
    

    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
