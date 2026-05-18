<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VoiceController extends Controller
{
    public function transcribe(Request $request)
    {
        // Validamos que llegue un archivo de audio
        $request->validate([
            'audio' => 'required|file',
        ]);

        $audio = $request->file('audio');

        // Llamada a Groq (Es ultra rápida)
        $response = Http::withToken(env('GROQ_API_KEY'))
            ->attach('file', file_get_contents($audio), 'recording.m4a')
            ->post('https://api.groq.com/openai/v1/audio/transcriptions', [
                'model' => 'whisper-large-v3',
                'language' => 'es',
                'response_format' => 'json',
            ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Error en Groq: ' . $response->body()], 500);
        }

        return response()->json([
            'text' => $response->json()['text']
        ]);
    }
}