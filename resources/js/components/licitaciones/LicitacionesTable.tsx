import { Link } from '@inertiajs/react';
import { Eye, Building2, Calendar, DollarSign, ShieldCheck } from 'lucide-react';
import EstadoBadge from './EstadoBadge';

export default function LicitacionesTable({ licitaciones }: any) {
    // Si no hay monto o es 0, muestra guiones para no confundir
    const formatMoney = (val: any) => {
        if (!val || isNaN(val) || val == 0) return '---';
        return new Intl.NumberFormat('es-CL').format(val);
    };

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
                            
                            {/* Proyecto y Descripción */}
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-gray-900 dark:text-white uppercase group-hover:text-[#c1f75e] transition-colors">
                                            {lic.nombre_proyecto}
                                        </span>
                                        {/* Indicador de que ya es un contrato real en ejecución */}
                                        {lic.proyecto_id && (
                                            <div className="px-1.5 py-0.5 bg-[#c1f75e]/10 border border-[#c1f75e]/20 rounded text-[#c1f75e] flex items-center gap-1" title="Contrato Activo">
                                                <ShieldCheck size={10} strokeWidth={3} />
                                                <span className="text-[8px] font-black uppercase">Activo</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-500 italic line-clamp-1">
                                        {lic.descripcion || 'Sin descripción detallada registrada'}
                                    </span>
                                </div>
                            </td>

                            {/* Cliente y División */}
                            <td className="px-6 py-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase">
                                        <Building2 size={12} className="text-[#c1f75e]" />
                                        {lic.empresa?.nombre || 'Empresa no asignada'}
                                    </div>
                                    <span className="text-[10px] text-gray-500 ml-4 font-mono">
                                        {lic.division?.nombre || 'División no especificada'}
                                    </span>
                                </div>
                            </td>

                            {/* Estado en el Pipeline */}
                            <td className="px-6 py-5 text-center">
                                <EstadoBadge estado={lic.estado_pipeline} />
                            </td>

                            {/* Monto y Fecha de Cierre */}
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1 text-sm font-mono font-bold dark:text-white">
                                        <DollarSign size={14} className="text-gray-500" />
                                        {formatMoney(lic.monto_estimado)}
                                    </div>
                                    {lic.fecha_cierre && (
                                        <div className="flex items-center gap-1 text-[9px] text-gray-500 uppercase mt-1 font-bold">
                                            <Calendar size={10} className="text-[#c1f75e]/50" /> 
                                            Cierre: {lic.fecha_cierre}
                                        </div>
                                    )}
                                </div>
                            </td>

                            {/* Acciones */}
                            <td className="px-6 py-5 text-right">
                                <Link 
                                    href={route('licitaciones.show', lic.id)}
                                    className="p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-[#c1f75e] hover:text-black rounded-xl transition-all inline-flex text-gray-500 dark:text-gray-400 shadow-sm"
                                >
                                    <Eye size={18} strokeWidth={2.5} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}