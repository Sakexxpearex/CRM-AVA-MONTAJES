import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Building2, FileSpreadsheet, 
    Users, Calendar, Moon, Sun, LogOut, Menu
} from 'lucide-react';

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

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden">
            
            {/* Naveción Mobile*/}
            <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0A0A] border-b border-gray-800 px-6 flex justify-between items-center z-50">
                <img src="/assets/logos/isotipo-blanco-verde.svg" className="h-8 w-auto" alt="Logo" />
                <div className="flex items-center gap-4">
                    {/* Modo Oscuro/Claro */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        {darkMode ? <Sun size={20} className="text-[#86CF00]" /> : <Moon size={20} />}
                    </button>

                    {/* Logout directo*/}
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        className="text-red-500 p-2">
                        <LogOut size={20} />
                    </Link>
                </div>
            </nav>

            {/* Menú lateral */}
            <aside className="hidden md:flex md:w-72 md:flex-col h-screen bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="p-10 flex justify-center">
                    <Link href={route('dashboard')}>
                        <img src="/assets/logos/negro-verde.svg" className="h-10 w-auto dark:hidden" alt="AVA CRM" />
                        <img src="/assets/logos/blanco.svg" className="h-10 w-auto hidden dark:block" alt="AVA CRM" />
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4 mb-6">Menú Principal</p>
                    <NavLink href={route('dashboard')} icon={<LayoutDashboard size={20}/>} label="Inicio" active={route().current('dashboard')} />
                    {/* Navegacion del dashboard a empresas */ }
                    <NavLink 
                        href={route('empresas.index')} 
                        icon={<Building2 size={20}/>} 
                        label="Empresas" 
                        active={route().current('empresas.*')} 
                    />
                    <NavLink href="#" icon={<FileSpreadsheet size={20}/>} label="Licitaciones" />
                    <NavLink href="#" icon={<Users size={20}/>} label="Contactos" />
                    <NavLink href="#" icon={<Calendar size={20}/>} label="Calendario" />
                </nav>

                <div className="p-6 border-t border-gray-800 space-y-2">
                    <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-3 w-full p-3 rounded-xl text-gray-400 hover:bg-white/5 transition-all">
                        {darkMode ? <Sun size={20} className="text-[#86CF00]" /> : <Moon size={20} />}
                        <span className="text-sm font-medium">{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                    </button>
                    <Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-left">
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Área de contendio */}
            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                <section className="flex-1 overflow-y-auto p-4 md:p-10 mt-16 md:mt-0 mb-20 md:mb-0">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </section>
            </main>

            {/* Barra navegador inferior */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0A0A0A] border-t border-gray-800 flex justify-around items-center px-2 z-50">
                {/* Navegacion del dashboard a empresas */ }
                <MobileNavLink 
                    href={route('empresas.index')} 
                    icon={<Building2 size={22}/>} 
                    label="Empresas" 
                    active={route().current('empresas.*')}
                />
                <MobileNavLink href="#" icon={<Users size={22}/>} label="Contactos" />
                <MobileNavLink href="#" icon={<FileSpreadsheet size={22}/>} label="Licitaciones" />
                <MobileNavLink href="#" icon={<LayoutDashboard size={22}/>} label="Bitácora" />
                <MobileNavLink href="#" icon={<Calendar size={22}/>} label="Análisis" />
            </div>
        </div>
    );
}

// NavLink Desktop
function NavLink({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-200 ${
                active 
                ? 'bg-black text-white shadow-xl shadow-black/10 dark:bg-[#86CF00] dark:text-black' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400'
            }`}
        >
            <span className={active ? 'text-inherit' : 'text-gray-400'}>{icon}</span>
            <span className="text-sm tracking-tight">{label}</span>
        </Link>
    );
}

// NavLink Mobile
function MobileNavLink({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center flex-1 gap-1">
            <span className={`${active ? 'text-[#86CF00]' : 'text-gray-500'}`}>{icon}</span>
            <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
        </Link>
    );
}