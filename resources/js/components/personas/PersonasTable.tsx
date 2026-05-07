import { Mail, Phone, Linkedin, Building, Edit3, Trash2, Eye } from 'lucide-react'; 
import { Link } from '@inertiajs/react';
import { Persona } from '@/types/persona';

interface Props {
    personas: Persona[]; // Volvemos a tipar estrictamente como Array
    onEdit: (persona: Persona) => void;
    onDelete: (id: number) => void;
}

export default function PersonasTable({ personas, onEdit, onDelete }: Props) {

    const getInitials = (n1: string, a1: string) => {
        if (!n1 || !a1) return "??";
        return `${n1[0]}${a1[0]}`.toUpperCase();
    };

    return (
        <div className="hidden md:block bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
                
                <thead>
                    <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Contacto</th>
                        <th className="px-6 py-4">Empresa / Cargo</th>
                        <th className="px-6 py-4 text-center">Comunicación</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {personas.length > 0 ? (
                        personas.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                
                                {/* Contacto: Nombre y RUT */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-900 text-[#c1f75e] rounded flex items-center justify-center font-black text-xs border border-gray-700 shadow-inner">
                                            {getInitials(p.nombre_1, p.apellido_1)}
                                        </div>

                                        <div className="flex flex-col">
                                            <Link 
                                                href={route('personas.show', p.id)} 
                                                className="font-bold text-sm text-gray-800 dark:text-white uppercase hover:text-[#c1f75e] transition-colors leading-tight"
                                            >
                                                {/* Concatenación de nombre para visualización directa */}
                                                {p.nombre_1} {p.apellido_1}
                                            </Link>
                                            <div className="text-[10px] text-gray-500 font-mono italic">
                                                {p.rut}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Empresa / Cargo */}
                                <td className="px-6 py-4">
                                    {p.trabajo_actual ? (
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                                                <Building size={12} className="text-[#c1f75e]" />
                                                {p.trabajo_actual.division.empresa.nombre}
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-tighter ml-4">
                                                {p.trabajo_actual.cargo}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-gray-400 italic font-bold uppercase tracking-widest">
                                            Sin asignar
                                        </span>
                                    )}
                                </td>

                                {/* Comunicación Rápida */}
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-4">
                                        <a href={`mailto:${p.email}`} className="text-gray-400 hover:text-[#c1f75e] transition-colors p-1" title="Email">
                                            <Mail size={16} />
                                        </a>
                                        <a href={`tel:${p.telefono}`} className="text-gray-400 hover:text-[#c1f75e] transition-colors p-1" title="Llamar">
                                            <Phone size={16} />
                                        </a>
                                        {p.perfil_linkedin && (
                                            <a href={p.perfil_linkedin} target="_blank" className="text-gray-400 hover:text-[#c1f75e] transition-colors p-1" title="LinkedIn">
                                                <Linkedin size={16} />
                                            </a>
                                        )}
                                    </div>
                                </td>

                                {/* Acciones */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        
                                        <Link 
                                            href={route('personas.show', p.id)} 
                                            className="p-2 text-gray-400 hover:text-[#c1f75e] transition-colors"
                                            title="Ver Detalle"
                                        >
                                            <Eye size={16} />
                                        </Link>

                                        <button 
                                            onClick={() => onEdit(p)} 
                                            className="p-2 text-gray-400 hover:text-[#c1f75e] transition-colors"
                                            title="Editar"
                                        >
                                            <Edit3 size={16} />
                                        </button>

                                        <button 
                                            onClick={() => onDelete(p.id)} 
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="py-10 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                No se encontraron registros
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}