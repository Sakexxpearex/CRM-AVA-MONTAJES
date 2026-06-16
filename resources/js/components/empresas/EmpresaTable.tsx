import { Building2, Briefcase, FileText, Users, Trash2, Edit3, LayoutGrid, Eye, Star } from 'lucide-react';
import { Empresa } from '@/types/empresa';
import { formatRut } from '@/utils/formatters';
import { Link } from '@inertiajs/react';

const tipoConfig = {
    Cliente: { icon: FileText, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/20' },
    Competencia: { icon: Briefcase, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/20' },
    Subcontratista: { icon: Users, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
};

interface Props {
    empresas: Empresa[];
    onEdit: (empresa: Empresa) => void;
    onDelete: (id: number) => void;
}

export default function EmpresasTable({ empresas, onEdit, onDelete }: Props) {
    return (
        <div className="w-full">
            {/* Vista mobile (Optimizado) */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {empresas.length > 0 ? (
                    empresas.map((empresa) => {
                        const config = tipoConfig[empresa.tipo] || tipoConfig.Cliente;
                        return (
                            <div key={empresa.id} className="p-4 space-y-3.5 bg-white dark:bg-[#111]">
                                {/* Bloque de información principal clicable */}
                                <div className="flex items-start justify-between gap-2">
                                    <Link 
                                        href={route('empresas.show', empresa.id)} 
                                        className="flex gap-3 items-center min-w-0 flex-1"
                                    >
                                        <div className="w-10 h-10 bg-gray-900 text-[#C1F75E] rounded-xl flex items-center justify-center border border-gray-800 shrink-0">
                                            <Building2 size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase leading-tight truncate">
                                                {empresa.nombre}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                                                <span className="text-[10px] text-gray-400 font-mono tracking-tight shrink-0">
                                                    {formatRut(empresa.rut)}
                                                </span>
                                                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase flex items-center gap-1 shrink-0">
                                                    <LayoutGrid size={10} className="text-[#c1f75e]" /> 
                                                    {empresa.divisiones?.length || 0} Div.
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    
                                    {/* Etiquetas Superiores (Categoría y Reputación) */}
                                    <div className="flex flex-col gap-1 items-end shrink-0">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${config.bgColor} ${config.color}`}>
                                            {empresa.tipo}
                                        </span>
                                        {/* Inserto de Reputación Móvil */}
                                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/[0.02] px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800/50">
                                            <Star 
                                                size={10} 
                                                className={empresa.promedio_estrellas && empresa.promedio_estrellas > 0 
                                                    ? "text-yellow-400 fill-yellow-400" 
                                                    : "text-gray-300 dark:text-gray-700"} 
                                            />
                                            <span className={`text-[9px] font-black uppercase tracking-wider ${!empresa.promedio_estrellas ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                {empresa.promedio_estrellas && empresa.promedio_estrellas > 0 
                                                    ? empresa.promedio_estrellas.toFixed(1)
                                                    : 'S/N'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción móviles estilizados */}
                                <div className="flex gap-2 pt-1 border-t border-gray-50 dark:border-gray-800/40">
                                    <Link
                                        href={route('empresas.show', empresa.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/50 rounded-lg text-[10px] font-black uppercase text-gray-600 dark:text-gray-400"
                                    >
                                        <Eye size={13} /> Ver
                                    </Link>
                                    <button 
                                        onClick={() => onEdit(empresa)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/50 rounded-lg text-[10px] font-black uppercase text-gray-600 dark:text-gray-400"
                                    >
                                        <Edit3 size={13} /> Editar
                                    </button>
                                    <button 
                                        onClick={() => onDelete(empresa.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-[10px] font-black uppercase text-red-600"
                                    >
                                        <Trash2 size={13} /> Borrar
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        No hay registros
                    </div>
                )}
            </div>

            {/* Vista PC (Intacta, se visualiza excelente) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-4">Empresa</th>
                            <th className="px-6 py-4 text-center">RUT</th>
                            <th className="px-6 py-4 text-center">Categoría</th>
                            {/* Nueva cabecera de Reputación */}
                            <th className="px-6 py-4 text-center">Reputación</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {empresas.map((empresa) => {
                            const config = tipoConfig[empresa.tipo] || tipoConfig.Cliente;
                            return (
                                <tr key={empresa.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 dark:bg-[#1A1A1A] rounded flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-[#C1F75E] transition-all">
                                                <Building2 size={16} />
                                            </div>
                                            <Link 
                                                href={route('empresas.show', empresa.id)} 
                                                className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase hover:text-[#c1f75e] transition-colors"
                                            >
                                                {empresa.nombre}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-xs text-gray-500 italic uppercase">{formatRut(empresa.rut)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase ${config.bgColor} ${config.color}`}>
                                            <config.icon size={12} strokeWidth={3} /> {empresa.tipo}
                                        </span>
                                    </td>
                                    
                                    {/* Inserto de Reputación PC */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Star 
                                                size={14} 
                                                className={empresa.promedio_estrellas && empresa.promedio_estrellas > 0 
                                                    ? "text-yellow-400 fill-yellow-400" 
                                                    : "text-gray-300 dark:text-gray-700"} 
                                            />
                                            <span className={`text-xs font-bold ${!empresa.promedio_estrellas ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                {empresa.promedio_estrellas && empresa.promedio_estrellas > 0 
                                                    ? empresa.promedio_estrellas.toFixed(1)
                                                    : 'S/N'
                                                }
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                href={route('empresas.show', empresa.id)} 
                                                className="p-2 text-gray-400 hover:text-[#C1F75E] transition-colors"
                                                title="Ver ficha técnica"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <button onClick={() => onEdit(empresa)} className="p-2 text-gray-400 hover:text-[#C1F75E] transition-colors"><Edit3 size={18} /></button>
                                            <button onClick={() => onDelete(empresa.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {empresas.length === 0 && (
                    <div className="text-center py-20 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        No hay empresas registradas en el sistema
                    </div>
                )}
            </div>
        </div>
    );
}