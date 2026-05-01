import { Link } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react'; // Para el toggle de modo

interface AuthLayoutProps {
    title: ReactNode;
    description: ReactNode;
}

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-8 md:py-12 transition-colors duration-300">
            
            {/* Para cambiar modo calro/oscuro en el Login */}
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 shadow-sm text-gray-500 dark:text-[#86CF00] hover:scale-110 transition-all"
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Tarjeta del formulario (podemos sacarlo si se ve muy pesado a la vista) */}
            <div className="w-full max-w-[480px] bg-white dark:bg-[#111111] p-8 md:p-12 rounded-[2.5rem] shadow-xl md:shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center relative overflow-hidden">
                
                {/* Linea verde superior (no tiene utilidad) */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#86CF00]"></div>
                
                {/* Logo (cambia segun el modo en el que este) */}
                <div className="text-center mb-8 w-full">
                    <Link href="/" className="flex justify-center mb-6">
                        <img 
                            src="/assets/logos/isotipo-negro-verde.svg" 
                            alt="AVA CRM Logo" 
                            className="w-24 h-24 md:w-28 md:h-28 object-contain dark:hidden" 
                        />
                        <img 
                            src="/assets/logos/isotipo-blanco-verde.svg" 
                            alt="AVA CRM Logo" 
                            className="w-24 h-24 md:w-28 md:h-28 object-contain hidden dark:block" 
                        />
                    </Link>
                    
                    <h1 className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
                        {title}
                    </h1>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 font-medium">
                        {description}
                    </p>
                </div>

                {/* Formulario */}
                <div className="w-full">
                    {children}
                </div>
            </div>

            {/* Footer de cortesía */}
            <div className="mt-8 text-center">
                <p className="text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">
                    © 2026 AVA CRM System
                </p>
            </div>
        </div>
    );
}