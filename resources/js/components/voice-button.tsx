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
            console.error("Error en transcripción:", error);
            alert("Error al procesar el audio");
        }
    };

    return (
        <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`
                fixed bottom-10 left-1/2 transform -translate-x-1/2 
                w-16 h-16 flex items-center justify-center 
                rounded-full shadow-2xl transition-all duration-300 hover:scale-105 z-50
                ${isRecording 
                    ? 'bg-red-500 animate-pulse shadow-red-500/50' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/50'
                } 
                text-white
            `}
            title={isRecording ? "Detener grabación" : "Hablar con el sistema"}
        >
            {isRecording ? <Square size={28} /> : <Mic size={28} />}
        </button>
    );
}