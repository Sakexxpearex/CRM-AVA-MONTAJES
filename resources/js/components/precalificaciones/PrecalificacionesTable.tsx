import { Eye, Building2 } from 'lucide-react';

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

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 dark:border-gray-800">
                        <th className="px-6 py-4">Proyecto / Cliente</th>
                        <th className="px-6 py-4 text-center">Monto Estimado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-300">
                    {precalificaciones.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="p-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                No tienes propuestas pendientes de precalificación.
                            </td>
                        </tr>
                    ) : (
                        precalificaciones.map((item) => (
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
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}