<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CommandParserService
{
    public function parseCommand(string $textoHablado): array
    {
        $prompt = 'Eres el motor de un CRM. Tu objetivo es extraer la intención de una frase ignorando puntos, comas o pausas.
        Reglas:
        - Si el usuario menciona "actualizar", "cambiar" o "pasar" una licitación a un estado, la intención es "CAMBIAR_ESTADO".
        - Extrae el nombre de la licitación y el estado.
        - Estados válidos: Adjudicada, Operativa, Perdida, Enviada, Presentada.
        - Devuelve SOLO JSON.

        Ejemplo: "Actualiza la licitación. Mantención planta adjudicada." 
        Respuesta: {"intent": "CAMBIAR_ESTADO", "nombre": "mantencion planta", "estado": "Adjudicada"}';

        try {
            $response = Http::withToken(env('GROQ_API_KEY'))
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.1-8b-instant',
                    'messages' => [
                        ['role' => 'system', 'content' => $prompt],
                        ['role' => 'user', 'content' => "Texto a analizar: " . $textoHablado]
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0,
                ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                // Limpiamos la basura que a veces manda Llama 3
                $content = str_replace(['```json', '```'], '', $content);
                return json_decode(trim($content), true) ?? ['intent' => 'ERROR_FORMATO'];
            }

            // AQUÍ ATRAPAMOS AL CULPABLE: Devolvemos la respuesta exacta de Groq
            return [
                'intent' => 'FALLO_CONEXION', 
                'motivo' => 'Rechazo de Groq',
                'detalle_groq' => $response->body()
            ];

        } catch (\Exception $e) {
            // Y aquí atrapamos si Docker/Laravel no tienen internet
            return [
                'intent' => 'FALLO_CONEXION', 
                'motivo' => 'Falla interna de Laravel',
                'detalle_laravel' => $e->getMessage()
            ];
        }
    }
}