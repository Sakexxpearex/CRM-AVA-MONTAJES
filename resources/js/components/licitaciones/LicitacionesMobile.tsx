import { Link } from '@inertiajs/react';
import { Building2, DollarSign, ChevronRight } from 'lucide-react';
import EstadoBadge from './EstadoBadge';

export default function LicitacionesMobile({ licitaciones }: any) {
    return (
        <div className="md:hidden space-y-4">
            {licitaciones.map((lic: any) => (
                <Link 
                    key={lic.id} 
                    href={route('licitaciones.show', lic.id)}
                    className="block bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 active:scale-[0.98] transition-transform"
                >
                    <div className="flex justify-between items-start mb-3">
                        <EstadoBadge estado={lic.estado_pipeline} />
                        <span className="text-xs font-mono font-bold text-[#c1f75e]">
                            ${new Intl.NumberFormat('es-CL').format(lic.monto_estimado || 0)}
                        </span>
                    </div>
                    
                    <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white mb-1">
                        {lic.nombre_proyecto}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold uppercase">
                        <Building2 size={12} />
                        {lic.empresa?.nombre}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Ver Detalles</span>
                        <ChevronRight size={16} className="text-[#c1f75e]" />
                    </div>
                </Link>
            ))}
        </div>
    );
}