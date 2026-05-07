import { Link } from '@inertiajs/react';
import { Eye, Building2, Calendar, DollarSign } from 'lucide-react';
import EstadoBadge from './EstadoBadge';

export default function LicitacionesTable({ licitaciones }: any) {
    const formatMoney = (val: number) => new Intl.NumberFormat('es-CL').format(val || 0);

    return (
        <div className="hidden md:block bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Proyecto / Descripción</th>
                        <th className="px-6 py-4">Cliente / División</th>
                        <th className="px-6 py-4 text-center">Estado</th>
                        <th className="px-6 py-4">Monto Estimado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {licitaciones.map((lic: any) => (
                        <tr key={lic.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-gray-900 dark:text-white uppercase group-hover:text-[#c1f75e] transition-colors">
                                        {lic.nombre_proyecto}
                                    </span>
                                    <span className="text-[10px] text-gray-500 italic line-clamp-1">{lic.descripcion || 'Sin descripción'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase">
                                        <Building2 size={12} className="text-[#c1f75e]" />
                                        {lic.empresa?.nombre}
                                    </div>
                                    <span className="text-[10px] text-gray-500 ml-4 font-mono">{lic.division?.nombre}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <EstadoBadge estado={lic.estado_pipeline} />
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-1 text-sm font-mono font-bold dark:text-white">
                                    <DollarSign size={14} className="text-gray-500" />
                                    {formatMoney(lic.monto_estimado)}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <Link 
                                    href={route('licitaciones.show', lic.id)}
                                    className="p-2 hover:bg-[#c1f75e] hover:text-black rounded-lg transition-all inline-flex text-gray-400"
                                >
                                    <Eye size={18} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}