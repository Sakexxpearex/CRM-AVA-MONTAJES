// Calculo de stats 

import { DollarSign, Briefcase, TrendingUp } from 'lucide-react';

export default function LicitacionStats({ licitaciones }: any) {
    // Pipeline Total 
    const totalMonto = licitaciones.reduce((acc: number, curr: any) => acc + Number(curr.monto_estimado || 0), 0);
    
    // Proyectos Activos
    const activos = licitaciones.filter((l: any) => 
        l.estado_pipeline !== 'Perdida' && 
        l.estado_pipeline !== 'Ganada'
    ).length;

    // Monto Ganado
    const montoGanado = licitaciones
        .filter((l: any) => l.estado_pipeline === 'Ganada')
        .reduce((acc: number, curr: any) => acc + Number(curr.monto_estimado || 0), 0);

    const formatMoney = (val: number) => new Intl.NumberFormat('es-CL', { 
        style: 'currency', 
        currency: 'CLP',
        maximumFractionDigits: 0 
    }).format(val);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pipeline Total */}
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pipeline en Juego</p>
                        <h3 className="text-2xl font-black dark:text-white mt-1 font-mono">{formatMoney(totalMonto)}</h3>
                    </div>
                    <div className="p-2 bg-[#c1f75e] rounded-lg text-black shadow-lg shadow-[#c1f75e]/20">
                        <DollarSign size={20} />
                    </div>
                </div>
            </div>

            {/* Proyectos Activos */}
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Oportunidades Abiertas</p>
                        <h3 className="text-2xl font-black dark:text-white mt-1">{activos}</h3>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400 border border-gray-800">
                        <Briefcase size={20} />
                    </div>
                </div>
            </div>

            {/* Éxito Acumulado */}
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cerrado / Ganado</p>
                        <h3 className="text-2xl font-black text-[#c1f75e] mt-1 font-mono">{formatMoney(montoGanado)}</h3>
                    </div>
                    <div className="p-2 bg-[#c1f75e]/10 rounded-lg text-[#c1f75e]">
                        <TrendingUp size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
}