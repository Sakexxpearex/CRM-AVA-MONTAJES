import React, { useEffect, useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

export default function GlobalToast() {
    // Interceptamos los props de Inertia
    const { errors, flash } = usePage().props as any;
    
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    
    // Esta es la "nota mental" para no repetir mensajes
    const processedMessageRef = useRef('');

    // Efecto 1: Escuchar cuando cambian los errores o flash
    useEffect(() => {
        let newMessage = '';
        let newType = 'success';

        if (errors && errors.error) {
            newMessage = errors.error;
            newType = 'error';
        } 
        else if (flash && flash.message) {
            newMessage = flash.message;
            newType = 'success';
        }

        // Si hay mensaje nuevo Y es distinto al ultimo que procesamos
        if (newMessage && newMessage !== processedMessageRef.current) {
            processedMessageRef.current = newMessage; // Guardamos en la nota mental
            setMessage(newMessage);
            setType(newType);
            setIsVisible(true);
        }
        
        // Si Inertia limpio los errores, limpiamos nuestra nota mental
        if (!newMessage) {
            processedMessageRef.current = '';
        }

    }, [errors, flash]); // Solo se ejecuta cuando Inertia manda datos nuevos

    // Efecto 2: Timer para auto-cerrar
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                handleClose();
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        // Opcional: no limpiamos processedMessageRef aqui para que
        // el mensaje no reaparezca hasta que llegue uno NUEVO del backend.
    };

    if (!isVisible || !message) return null;

    return (
        <div className={`
            fixed z-[100] flex items-start gap-3 p-4 rounded-lg shadow-2xl border-l-4 transition-all duration-300
            /* MOVIL: Abajo al centro */
            bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px]
            /* ESCRITORIO: Abajo a la derecha */
            md:bottom-8 md:right-8 md:left-auto md:translate-x-0 md:w-auto md:max-w-md
            
            ${type === 'error' 
                ? 'bg-white border-red-500 text-slate-800' 
                : 'bg-white border-green-500 text-slate-800'
            }
        `}>
            <div className="shrink-0 mt-0.5">
                {type === 'error' 
                    ? <AlertCircle className="text-red-500" size={20} /> 
                    : <CheckCircle className="text-green-500" size={20} />
                }
            </div>
            
            <div className="flex-1 text-sm font-medium leading-relaxed">
                {message}
            </div>

            <button 
                onClick={handleClose} // Usamos la funcion corregida
                className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 -mt-1"
            >
                <X size={16} />
            </button>
        </div>
    );
}