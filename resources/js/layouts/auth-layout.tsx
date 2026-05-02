import { Link } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface AuthLayoutProps {
    title: ReactNode;
    description: ReactNode;
}

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    // Modo claro por defecto
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            return saved === 'dark'; // guarda el modo oscuro
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#060606] flex flex-col items-center justify-center px-4 py-8 md:py-12 transition-colors duration-300 font-pangram">
            
            {/* Boton de modo claro/oscuro */}
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-6 right-6 p-2 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-[#B0FF08] hover:border-gray-400 dark:hover:border-[#B0FF08] transition-all z-50"
            >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Contenedor principal */}
            <div className="w-full max-w-[460px] bg-white dark:bg-[#111111] p-8 md:p-12 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center relative overflow-hidden">
                
                {/* Linea verde simple arriba  */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C1F75E]"></div>
                
                {/* Logo */}
                <div className="text-center mb-8 w-full">
                    <Link href="/" className="flex justify-center mb-6">
                        <img 
                            src="/assets/logos/isotipo-negro-verde.svg" 
                            alt="AVA CRM Logo" 
                            className="w-20 h-20 object-contain dark:hidden" 
                        />
                        <img 
                            src="/assets/logos/isotipo-blanco-verde.svg" 
                            alt="AVA CRM Logo" 
                            className="w-20 h-20 object-contain hidden dark:block" 
                        />
                    </Link>
                    
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        {title}
                    </h1>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mt-3">
                        {description}
                    </p>
                </div>

                {/* Contenedor del formulario */}
                <div className="w-full">
                    {children}
                </div>
            </div>

        </div>
    );
}