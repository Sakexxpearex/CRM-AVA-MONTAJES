import React, { useState, useRef } from 'react';
import axios from 'axios';

interface VoiceButtonProps {
    onTranscription: (text: string) => void;
}

export default function VoiceButton({ onTranscription }: VoiceButtonProps) {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    
    // Tipamos las referencias para evitar el "any"
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const startRecording = async (): Promise<void> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                await sendToGroq(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error al acceder al mic:", err);
            alert("Debes dar permisos al micrófono y estar en un sitio seguro (localhost/https)");
        }
    };

    const stopRecording = (): void => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            setIsRecording(false);
            // Cerramos el flujo del micrófono para apagar el puntito rojo del navegador
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const sendToGroq = async (blob: Blob): Promise<void> => {
        setProcessing(true);
        const formData = new FormData();
        // Laravel espera un archivo, aquí se lo mandamos como 'audio'
        formData.append('audio', blob, 'recording.wav');

        try {
            const res = await axios.post<{ text: string }>('/voice/transcribe', formData);
            onTranscription(res.data.text);
        } catch (err) {
            console.error("Error en Groq:", err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        
        <div className="fixed z-50 
            /* Celular: abajo al centro */
            bottom-6 left-1/2 -translate-x-1/2 
            /* Ordenador: abajo a la derecha */
            md:bottom-10 md:right-10 md:left-auto md:translate-x-0">
            
            <div className="flex flex-col items-center gap-2">
                <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    disabled={processing}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all active:scale-95 ${
                        isRecording 
                            ? 'bg-red-500 animate-pulse scale-110' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {processing ? (
                        <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        </div>
                    ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z" />
                        </svg>
                    )}
                </button>
                
                {/* Etiqueta flotante opcional (se puede ocultar en móvil si molesta) */}
                <span className="hidden md:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-75 font-bold uppercase">
                    {isRecording ? 'Grabando...' : 'Comando de Voz'}
                </span>
            </div>
        </div>

    );
}