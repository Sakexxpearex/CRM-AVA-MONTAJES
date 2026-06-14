import { Eye, Building2, Wallet } from 'lucide-react';

interface TableProps {
    precalificaciones: any[];
    onSelectRow: (item: any) => void;
}

export default function PrecalificacionesTable({ precalificaciones, onSelectRow }: TableProps) {
    
    const formatCurrency = (monto: number | null) => {
        if (!monto) return 'No definido';
        return new Intl.NumberFormat('es-CL', { 
            style: 'currency', 
            currency: 'CLP',
            maximumFractionDigits: 0 
        }).format(monto);
    };

    if (precalificaciones.length === 0) {
        return (
            <div className="p-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                No tienes propuestas pendientes de precalificación.
            </div>
        );
    }

    return (
        <div className="w-full">
            
            {/* Mobile */}
            <div className="block md:hidden space-y-3 px-1">
                {precalificaciones.map((item) => (
                    <div 
                        key={item.id}
                        className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                        {/* Header */}
                        <div className="space-y-1">
                            <span className="font-black text-sm text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-tight block">
                                {item.nombre_precalificacion}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase flex items-center gap-1.5 tracking-wider">
                                <Building2 size={11} className="text-gray-400 dark:text-gray-600" />
                                {item.empresa?.nombre || 'S/N'}
                                {item.division?.nombre && ` — ${item.division.nombre}`}
                            </span>
                        </div>

                        {/* Footer*/}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800/60">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1 mb-0.5">
                                    <Wallet size={9} /> Est.
                                </span>
                                <span className="font-mono text-xs font-black text-gray-900 dark:text-gray-300">
                                    {formatCurrency(item.monto_estimated ?? item.monto_estimado)}
                                </span>
                            </div>

                            <button
                                onClick={() => onSelectRow(item)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-[#c1f75e] font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors border border-gray-200/50 dark:border-gray-800"
                            >
                                <Eye size={14} />
                                Evaluar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-4">Proyecto / Cliente</th>
                            <th className="px-6 py-4 text-center">Monto Estimado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-300">
                        {precalificaciones.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase leading-tight group-hover:text-[#c1f75e] transition-colors">
                                            {item.nombre_precalificacion}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase mt-1 flex items-center gap-1">
                                            <Building2 size={10} /> {item.empresa?.nombre || 'S/N'} 
                                            {item.division?.nombre && ` — ${item.division.nombre}`}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-center font-mono text-xs font-bold dark:text-gray-300">
                                    {formatCurrency(item.monto_estimated ?? item.monto_estimado)}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onSelectRow(item)}
                                        className="inline-flex items-center gap-2 p-2 text-gray-400 hover:text-[#c1f75e] transition-colors"
                                        title="Evaluar Propuesta"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}