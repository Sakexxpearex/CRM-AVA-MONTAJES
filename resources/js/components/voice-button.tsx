import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Mic, Square } from 'lucide-react';

interface VoiceButtonProps {
    onTranscriptionComplete: (text: string) => void;
}

export default function VoiceButton({ onTranscriptionComplete }: VoiceButtonProps) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        chunks.current = [];

        mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
        mediaRecorder.current.onstop = async () => {
            const blob = new Blob(chunks.current, { type: 'audio/wav' });
            await sendToLaravel(blob);
        };

        mediaRecorder.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
    };

    const sendToLaravel = async (audioBlob: Blob) => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            const response = await axios.post('/voice/transcribe', formData);
            if (response.data.text) {
                onTranscriptionComplete(response.data.text);
            }
        } catch (error) {
            console.error("Error en transcripcion:", error);
            alert("Error al procesar el audio");
        }
    };

    return (
        <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`
                fixed z-50 flex items-center justify-center rounded-full shadow-xl transition-colors duration-200
                /* MOVIL: Abajo al centro */
                bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 
                /* ESCRITORIO: Abajo a la derecha */
                md:bottom-8 md:right-8 md:left-auto md:translate-x-0 md:w-16 md:h-16
                /* ESTADO: Solo cambia el color del fondo, sin animaciones extra */
                ${isRecording ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}
            `}
            title={isRecording ? "Detener grabacion" : "Hablar con el sistema"}
        >
            {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={24} />}
        </button>
    );
}