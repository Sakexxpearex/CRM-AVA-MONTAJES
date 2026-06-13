import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, Building2, FileSpreadsheet, 
    Users, Calendar, Moon, Sun, LogOut, Menu,
    ClipboardCheck 
} from 'lucide-react';
import VoiceButton from '@/components/voice-button';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleVoiceTranscription = (text: string) => {
        console.log("Comando recibido:", text);
        
        // Enviamos el texto al controlador para que el Servicio lo procese
        router.post(route('licitaciones.comando-voz'), {
            texto_hablado: text
        }, {
            preserveScroll: true,
            onError: (err) => alert("Error: " + err.error)
        });
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden">
            
            {/* Navegación mobile*/}
            <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0A0A] border-b border-gray-800 px-6 flex justify-between items-center z-50">
                <img src="/assets/logos/blanco.svg" className="h-8 w-auto" alt="Logo" />
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        {darkMode ? <Sun size={20} className="text-[#86CF00]" /> : <Moon size={20} />}
                    </button>

                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        className="text-red-500 p-2">
                        <LogOut size={20} />
                    </Link>
                </div>
            </nav>

            {/* Menú lateral (Desktop) */}
            <aside className="hidden md:flex md:w-72 md:flex-col h-screen bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="p-8 flex justify-center mb-4">
                    <Link href={route('dashboard')}>
                        <img src="/assets/logos/negro-verde.svg" className="h-9 w-auto dark:hidden" alt="AVA CRM" />
                        <img src="/assets/logos/blanco.svg" className="h-9 w-auto hidden dark:block" alt="AVA CRM" />
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4 mb-6">Menú Principal</p>
                    
                    <NavLink href={route('dashboard')} icon={<LayoutDashboard size={20}/>} label="Inicio" active={route().current('dashboard')} />
                    
                    {/* Navegacion empresas */}
                    <NavLink 
                        href={route('empresas.index')} 
                        icon={<Building2 size={18}/>} 
                        label="Empresas" 
                        active={route().current('empresas.*')} 
                    />

                    {/* Navegacion precalificaciones */}
                    <NavLink 
                        href={route('precalificaciones.index')}  
                        icon={<ClipboardCheck size={18}/>} 
                        label="Precalificaciones" 
                        active={route().current('precalificaciones.*')}
                    />

                    {/* Navegacion licitaciones */}
                    <NavLink 
                        href={route('licitaciones.index')}  
                        icon={<FileSpreadsheet size={18}/>} 
                        label="Licitaciones" 
                        active={route().current('licitaciones.*')}
                    />

                    {/* Navegacion contactos */}
                    <NavLink 
                        href={route('personas.index')} 
                        icon={<Users size={18}/>} 
                        label="Contactos" 
                        active={route().current('personas.*')} 
                    />
                    
                    <NavLink href="#" icon={<Calendar size={18}/>} label="Análisis" />
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
                    <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                        {darkMode ? <Sun size={18} className="text-[#c1f75e]" /> : <Moon size={18} />}
                        <span className="text-sm font-bold">Modo {darkMode ? 'Claro' : 'Oscuro'}</span>
                    </button>
                    <Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left">
                        <LogOut size={18} />
                        <span className="text-sm font-bold">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Área de contenido */}
            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                <section className="flex-1 overflow-y-auto p-4 md:p-10 mt-16 md:mt-0 mb-20 md:mb-0">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </section>
            </main>

            {/* Barra navegador inferior (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0A0A0A] border-t border-gray-800 flex justify-around items-center px-2 z-50">
                <MobileNavLink 
                    href={route('empresas.index')} 
                    icon={<Building2 size={22}/>} 
                    label="Empresas" 
                    active={route().current('empresas.*')}
                />

                <MobileNavLink 
                    href={route('precalificaciones.index')} 
                    icon={<ClipboardCheck size={22}/>} 
                    label="Precalif." 
                    active={route().current('precalificaciones.*')} 
                />

                <MobileNavLink 
                    href={route('licitaciones.index')} 
                    icon={<FileSpreadsheet size={22}/>} 
                    label="Licitaciones" 
                    active={route().current('licitaciones.*')} 
                />

                <MobileNavLink 
                    href={route('personas.index')} 
                    icon={<Users size={22}/>} 
                    label="Contactos" 
                    active={route().current('personas.*')}
                />
            </div>
            <VoiceButton onTranscriptionComplete={handleVoiceTranscription} />
        </div>
    );
}

// NavLink pc
function NavLink({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 group ${
                active 
                ? 'bg-black text-white shadow-lg shadow-black/5 dark:bg-[#c1f75e] dark:text-black' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-gray-400'
            }`}
        >
            <span className={`transition-colors ${active ? 'text-inherit' : 'text-gray-400 group-hover:text-[#c1f75e]'}`}>
                {typeof icon === 'object' ? { ...icon, props: { ...icon.props, size: 18 } } : icon}
            </span>
            <span className="text-sm tracking-tight">{label}</span>
        </Link>
    );
}

// NavLink mobile
function MobileNavLink({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center flex-1 gap-1">
            <span className={`${active ? 'text-[#86CF00]' : 'text-gray-500'}`}>{icon}</span>
            <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
        </Link>
    );
}