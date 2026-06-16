import { Link } from '@inertiajs/react';
import { User, Mail, Phone, Building2, Edit3, Trash2, Eye, Star } from 'lucide-react';
import { Persona } from '@/types/persona';
import { formatRut } from '@/utils/formatters';

interface Props {
    personas: Persona[];
    onEdit: (p: Persona) => void;
    onDelete: (id: number) => void;
}

export default function PersonasTable({ personas, onEdit, onDelete }: Props) {
    return (
        <div className="w-full">
            {/* Vista mobile */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {personas.map((p) => (
                    <div key={p.id} className="p-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-900 text-[#c1f75e] rounded flex items-center justify-center border border-gray-800 font-black text-sm shrink-0">
                                {p.nombre_1[0]}{p.apellido_1[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase truncate">
                                    {p.nombre_1} {p.apellido_1}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{p.trabajo_actual?.cargo || 'Cargo no registrado'}</p>
                                
                                {/* Inserto de Reputación Móvil */}
                                <div className="flex items-center gap-1 mt-1">
                                    <Star 
                                        size={10} 
                                        className={p.promedio_estrellas && p.promedio_estrellas > 0 
                                            ? "text-yellow-400 fill-yellow-400" 
                                            : "text-gray-300 dark:text-gray-700"} 
                                    />
                                    <span className={`text-[9px] font-black uppercase tracking-wider ${!p.promedio_estrellas ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {p.promedio_estrellas && p.promedio_estrellas > 0 
                                            ? p.promedio_estrellas.toFixed(1)
                                            : 'S/N'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={route('personas.show', p.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 rounded text-[10px] font-black uppercase dark:text-gray-400"><Eye size={14}/> Ver</Link>
                            <button onClick={() => onEdit(p)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 rounded text-[10px] font-black uppercase dark:text-gray-400"><Edit3 size={14}/> Editar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Vista pc */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Empresa / División</th>
                            <th className="px-6 py-4">Comunicación</th>
                            {/* Nueva cabecera de Reputación */}
                            <th className="px-6 py-4 text-center">Reputación</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {personas.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-[#c1f75e] transition-all font-black text-xs shrink-0">
                                            {p.nombre_1[0]}{p.apellido_1[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase leading-none">{p.nombre_1} {p.apellido_1}</p>
                                            <p className="text-[10px] text-gray-500 font-mono mt-1">
                                                {formatRut(p.rut)}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{p.trabajo_actual?.cargo || '---'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase flex items-center gap-1">
                                            <Building2 size={12} className="text-[#c1f75e]" /> {p.trabajo_actual?.division?.nombre || '---'}
                                        </span>
                                        <span className="text-[10px] text-gray-500 uppercase">{p.trabajo_actual?.division?.empresa?.nombre || '---'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500"><Mail size={12} /> {p.email || '---'}</div>
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500"><Phone size={12} /> {p.telefono || '---'}</div>
                                    </div>
                                </td>
                                
                                {/* Inserto de Reputación PC */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Star 
                                            size={14} 
                                            className={p.promedio_estrellas && p.promedio_estrellas > 0 
                                                ? "text-yellow-400 fill-yellow-400" 
                                                : "text-gray-300 dark:text-gray-700"} 
                                        />
                                        <span className={`text-xs font-bold ${!p.promedio_estrellas ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                            {p.promedio_estrellas && p.promedio_estrellas > 0 
                                                ? p.promedio_estrellas.toFixed(1)
                                                : 'S/N'
                                            }
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={route('personas.show', p.id)} className="p-2 text-gray-400 hover:text-[#c1f75e]"><Eye size={18} /></Link>
                                        <button onClick={() => onEdit(p)} className="p-2 text-gray-400 hover:text-[#c1f75e]"><Edit3 size={18} /></button>
                                        <button onClick={() => onDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}