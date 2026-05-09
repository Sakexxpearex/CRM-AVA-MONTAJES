import { Building2, Briefcase, FileText, Users, Trash2, Edit3,LayoutGrid, Eye } from 'lucide-react';
import { Empresa } from '@/types/empresa';
import { formatRut } from '@/utils/formatters';
import { Link } from '@inertiajs/react';


const tipoConfig = {
    Cliente: { icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
    Competencia: { icon: Briefcase, color: 'text-red-600', bgColor: 'bg-red-50' },
    Subcontratista: { icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
};

interface Props {
    empresas: Empresa[];
    onEdit: (empresa: Empresa) => void;
    onDelete: (id: number) => void;
}

export default function EmpresasTable({ empresas, onEdit, onDelete }: Props) {
    return (
        <div className="w-full">
            {/* Vista mobile */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {empresas.length > 0 ? (
                    empresas.map((empresa) => {
                        const config = tipoConfig[empresa.tipo] || tipoConfig.Cliente;
                        return (
                            <div key={empresa.id} className="p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Link href={route('empresas.show', empresa.id)} className="flex items-center gap-3"></Link>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-900 text-[#C1F75E] rounded flex items-center justify-center border border-gray-700">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase leading-tight">
                                                {empresa.nombre}
                                            </h3>
                                            <span className="text-[9px] text-gray-500 font-bold uppercase flex items-center gap-1">
                                                <LayoutGrid size={10} className="text-[#c1f75e]" /> 
                                                {empresa.divisiones?.length || 0} Divisiones registradas
                                            </span>
                                            <p className="text-[10px] font-mono text-gray-500 mt-0.5 italic">{formatRut(empresa.rut)}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${config.bgColor} ${config.color} dark:bg-opacity-10`}>
                                        {empresa.tipo}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onEdit(empresa)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 rounded text-[10px] font-black uppercase text-gray-600 dark:text-gray-400"
                                    >
                                        <Edit3 size={14} /> Editar
                                    </button>
                                    <button 
                                        onClick={() => onDelete(empresa.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-500/10 rounded text-[10px] font-black uppercase text-red-600"
                                    >
                                        <Trash2 size={14} /> Eliminar
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

            {/* Vista pc */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-4">Empresa</th>
                            <th className="px-6 py-4 text-center">RUT</th>
                            <th className="px-6 py-4 text-center">Categoría</th>
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
                                            {/* este no se si eliminarlo o ñau*/}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-xs text-gray-500 italic uppercase">{formatRut(empresa.rut)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase ${config.bgColor} ${config.color} dark:bg-opacity-10`}>
                                            <config.icon size={12} strokeWidth={3} /> {empresa.tipo}
                                        </span>
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