import { Mail, Phone, Edit3, Building } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Persona } from '@/types/persona';

interface Props {
    personas: Persona[];
}

export default function PersonasMobile({ personas }: Props) {

    const getInitials = (n1: string, a1: string) => {
        if (!n1 || !a1) return "??";
        return `${n1[0]}${a1[0]}`.toUpperCase();
    };

    return (
        <div className="md:hidden space-y-4 pb-20">
            {personas.length > 0 ? (
                personas.map((p) => (
                    <div 
                        key={p.id} 
                        className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-transform"
                    >
                        
                        {/* Header*/}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                
                                {/* Avatar */}
                                <div className="w-12 h-12 bg-gray-900 text-[#c1f75e] rounded-xl flex items-center justify-center font-black text-sm border border-gray-700 shadow-lg">
                                    {getInitials(p.nombre_1, p.apellido_1)}
                                </div>

                                {/* Nombre y RUT */}
                                <div>
                                    <Link 
                                        href={route('personas.show', p.id)} 
                                        className="text-gray-900 dark:text-white font-bold uppercase text-[13px] tracking-tight hover:text-[#c1f75e] block"
                                    >
                                        {/* muestra nombre y apellido directamente*/}
                                        {p.nombre_1} {p.apellido_1}
                                    </Link>

                                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                                        {p.rut}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Empresa / Cargo */}
                        <div className="space-y-2 mb-5 bg-gray-50 dark:bg-black/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/50">
                            
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                                <Building size={14} className="text-[#c1f75e]" />
                                {p.trabajo_actual?.division.empresa.nombre ?? 'Sin Empresa'}
                            </div>

                            <div className="text-[10px] text-gray-500 uppercase ml-6 font-medium">
                                {p.trabajo_actual?.cargo ?? 'Cargo no definido'}
                            </div>

                        </div>

                        {/* Acciones de Comunicación y Detalle */}
                        <div className="grid grid-cols-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                            
                            <a 
                                href={`tel:${p.telefono}`} 
                                className="flex flex-col items-center gap-1 text-gray-400 border-r border-gray-100 dark:border-gray-800 py-1 hover:text-[#c1f75e] transition-colors"
                            >
                                <Phone size={18} />
                                <span className="text-[9px] font-black uppercase tracking-tighter">Llamar</span>
                            </a>

                            <a 
                                href={`mailto:${p.email}`} 
                                className="flex flex-col items-center gap-1 text-gray-400 border-r border-gray-100 dark:border-gray-800 py-1 hover:text-[#c1f75e] transition-colors"
                            >
                                <Mail size={18} />
                                <span className="text-[9px] font-black uppercase tracking-tighter">Email</span>
                            </a>

                            <Link 
                                href={route('personas.show', p.id)} 
                                className="flex flex-col items-center gap-1 text-[#c1f75e] py-1 active:opacity-50"
                            >
                                <Edit3 size={18} />
                                <span className="text-[9px] font-black uppercase tracking-tighter">Detalle</span>
                            </Link>

                        </div>

                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-[10px] font-black text-gray-400 uppercase tracking-widest border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                    No se encontraron registros
                </div>
            )}
        </div>
    );
}