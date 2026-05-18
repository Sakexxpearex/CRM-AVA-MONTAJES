<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VoiceController extends Controller
{
public function transcribe(Request $request)
{
    // 1. Validar que el archivo llegó
    if (!$request->hasFile('audio')) {
        return response()->json(['error' => 'No se encontró el campo audio'], 400);
    }

    $file = $request->file('audio');

    try {
        $response = Http::withToken(env('GROQ_API_KEY'))
            // IMPORTANTE: Groq espera que el campo se llame 'file'
            ->attach('file', file_get_contents($file->getRealPath()), 'audio.wav')
            ->post('https://api.groq.com/openai/v1/audio/transcriptions', [
                'model' => 'whisper-large-v3', // Asegúrate de que el nombre del modelo sea exacto
                'language' => 'es',
            ]);

        if ($response->failed()) {
            // Esto nos dirá qué campo específico le falta a Groq
            return response()->json($response->json(), $response->status());
        }

        return response()->json($response->json());

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}