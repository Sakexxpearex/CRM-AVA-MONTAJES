// Calculo de stats 

import { DollarSign, Briefcase, TrendingUp } from 'lucide-react';

export default function LicitacionStats({ licitaciones }: any) {
    const totalMonto = licitaciones.reduce((acc: number, curr: any) => acc + Number(curr.monto_estimado || 0), 0);
    const activos = licitaciones.filter((l: any) => l.estado_pipeline !== 'Perdido' && l.estado_pipeline !== 'Adjudicado').length;

    const formatMoney = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pipeline Total</p>
                        <h3 className="text-2xl font-black dark:text-white mt-1">{formatMoney(totalMonto)}</h3>
                    </div>
                    <div className="p-2 bg-[#c1f75e] rounded-lg text-black"><DollarSign size={20} /></div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proyectos Activos</p>
                        <h3 className="text-2xl font-black dark:text-white mt-1">{activos}</h3>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400"><Briefcase size={20} /></div>
                </div>
            </div>
        </div>
    );
}