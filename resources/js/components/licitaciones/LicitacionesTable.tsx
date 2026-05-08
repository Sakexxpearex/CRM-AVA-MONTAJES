import { Link } from '@inertiajs/react';
import { Eye, Building2, Calendar, DollarSign } from 'lucide-react';
import EstadoBadge from './EstadoBadge';
import { formatDate } from '@/utils/formatters';

export default function LicitacionesTable({ licitaciones }: { licitaciones: any[] }) {
    const formatMoney = (val: any) => {
        const num = parseFloat(val);
        return isNaN(num) ? '$ 0' : new Intl.NumberFormat('es-CL', { 
            style: 'currency', currency: 'CLP', maximumFractionDigits: 0 
        }).format(num);
    };

    return (
        <div className="w-full">
            {/* Vista mobile */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {licitaciones.length > 0 ? (
                    licitaciones.map((lic) => (
                        <Link 
                            key={lic.id} 
                            href={route('licitaciones.show', lic.id)}
                            className="block p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors active:scale-[0.98] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="space-y-1">
                                    <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase leading-tight">
                                        {lic.nombre_proyecto}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                                        <Building2 size={10} /> {lic.empresa?.nombre || 'S/N'}
                                    </p>
                                </div>
                                <EstadoBadge estado={lic.estado_pipeline} />
                            </div>

                            <div className="flex items-center justify-between mt-4 bg-gray-50 dark:bg-black/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Presupuesto</span>
                                    <span className="text-xs font-mono font-bold dark:text-[#c1f75e]">
                                        {formatMoney(lic.monto_estimado)}
                                    </span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Cierre</span>
                                    <span className="text-[10px] font-bold dark:text-gray-300 uppercase">
                                        {formatDate(lic.fecha_cierre) || ' --- '}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        No hay licitaciones activas
                    </div>
                )}
            </div>

            {/* Vista pc */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-4">Proyecto / Cliente</th>
                            <th className="px-6 py-4 text-center">Estado</th>
                            <th className="px-6 py-4 text-center">Monto Estimado</th>
                            <th className="px-6 py-4 text-center">Fecha Cierre</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {licitaciones.map((lic) => (
                            <tr key={lic.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase leading-tight group-hover:text-[#c1f75e] transition-colors">
                                            {lic.nombre_proyecto}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase mt-1 flex items-center gap-1">
                                            <Building2 size={10} /> {lic.empresa?.nombre || 'S/N'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <EstadoBadge estado={lic.estado_pipeline} />
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-xs font-bold dark:text-gray-300">
                                    {formatMoney(lic.monto_estimado)}
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-[10px] text-gray-500 uppercase">
                                    {formatDate(lic.fecha_cierre) || ' --- '}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                        href={route('licitaciones.show', lic.id)}
                                        className="inline-flex items-center gap-2 p-2 text-gray-400 hover:text-[#c1f75e] transition-colors"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}