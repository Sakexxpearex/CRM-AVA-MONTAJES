<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CommandParserService
{
    public function parseCommand(string $textoHablado): array
    {
$prompt = '
            Eres el motor de procesamiento de lenguaje natural de un CRM minero.
            Tu trabajo es leer lo que dice el usuario y extraer la intención y las variables en formato JSON estricto.
            
            Reglas de Extracción de Licitaciones:
            - El usuario suele identificar las licitaciones por un código, generalmente "DPC" seguido de un número (ej. DPC 101, dpc 205).
            - Si detectas el código, extrae SOLO el número en la variable "codigo_dpc".
            
            REGLA ESTRICTA DE ESTADOS (NORMALIZACIÓN):
            El usuario puede hablar con modismos o cambiar el género de las palabras, pero tú DEBES traducir su intención EXACTAMENTE a una de estas palabras oficiales: "Precalificación", "Presentada", "En Evaluación", "Adjudicada", "Perdida".
            
            Usa este diccionario mental:
            - Si dice "adjudicado", "ganada", "ganamos", "adjudicamos" -> devuelves "Adjudicada".
            - Si dice "perdido", "perdimos", "fuera" -> devuelves "Perdida".
            - Si dice "evaluando", "en revisión", "revisando" -> devuelves "En Evaluación".
            - Si dice "presentado", "enviada" -> devuelves "Presentada".

            
            Ejemplos:
            Texto: "Pasa la dpc 101 a adjudicado"
            JSON: {"intent": "CAMBIAR_ESTADO", "codigo_dpc": "101", "nuevo_estado": "Adjudicada"}
            
            Texto: "Oye, la licitación 205 la perdimos"
            JSON: {"intent": "CAMBIAR_ESTADO", "codigo_dpc": "205", "nuevo_estado": "Perdida"}
            
            Texto: "Búscame la 101"
            JSON: {"intent": "BUSCAR", "codigo_dpc": "101"}
        ';
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