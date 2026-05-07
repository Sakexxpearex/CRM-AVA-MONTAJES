import { Link } from '@inertiajs/react';
import { Building2, ChevronRight, ShieldCheck, Calendar } from 'lucide-react';
import EstadoBadge from './EstadoBadge';

export default function LicitacionesMobile({ licitaciones }: any) {
    // Lo mismo de la tabla (si es 0 o no hay monto)
    const formatMoney = (val: any) => {
        if (!val || isNaN(val) || val == 0) return '---';
        return new Intl.NumberFormat('es-CL').format(val);
    };

    return (
        <div className="md:hidden space-y-4">
            {licitaciones.map((lic: any) => (
                <Link 
                    key={lic.id} 
                    href={route('licitaciones.show', lic.id)}
                    className="block bg-white dark:bg-[#111] p-5 rounded-3xl border border-gray-200 dark:border-gray-800 active:scale-[0.97] transition-all shadow-sm"
                >
                    {/* Estado y Monto */}
                    <div className="flex justify-between items-start mb-4">
                        <EstadoBadge estado={lic.estado_pipeline} />
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-mono font-black text-[#c1f75e]">
                                ${formatMoney(lic.monto_estimado)}
                            </span>
                            {lic.fecha_cierre && (
                                <span className="text-[9px] text-gray-500 font-bold uppercase mt-1">
                                    Cierre: {lic.fecha_cierre}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Título y Empresa */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white leading-tight">
                                {lic.nombre_proyecto}
                            </h3>
                            {lic.proyecto_id && (
                                <ShieldCheck size={14} className="text-[#c1f75e] shrink-0" strokeWidth={3} />
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 font-bold uppercase">
                                <Building2 size={12} className="text-[#c1f75e]" />
                                {lic.empresa?.nombre}
                            </div>
                            <span className="text-[10px] text-gray-500 ml-5 font-mono italic">
                                {lic.division?.nombre}
                            </span>
                        </div>
                    </div>

                    {/* Footer de la Card */}
                    <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-gray-500" />
                            <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                                Detalles del Pipeline
                            </span>
                        </div>
                        <ChevronRight size={18} className="text-[#c1f75e]" strokeWidth={3} />
                    </div>
                </Link>
            ))}
        </div>
    );
}