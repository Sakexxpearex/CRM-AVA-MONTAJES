import React from 'react';
import { Building2, ArrowRight, FileText } from 'lucide-react';
import { Link } from '@inertiajs/react';
import EstadoBadge from './EstadoBadge';

// Columnas (no se que estados dejar)
const COLUMNAS = [
    { id: 'Evaluación', titulo: 'Evaluación', color: 'border-t-blue-500 text-blue-500 bg-blue-500/5' },
    { id: 'Preparación', titulo: 'Preparación', color: 'border-t-orange-500 text-orange-500 bg-orange-500/5' },
    { id: 'Presentada', titulo: 'Presentada', color: 'border-t-cyan-500 text-cyan-500 bg-cyan-500/5' },
    { id: 'Perdida', titulo: 'Perdida', color: 'border-t-red-500 text-red-500 bg-red-500/5' }
];

export default function LicitacionesKanban({ licitaciones = [] }: { licitaciones: any[] }) {
    
    // formateo para el monto 
    const formatMoney = (val: any) => {
        const num = parseFloat(val);
        return isNaN(num) ? '$ 0' : new Intl.NumberFormat('es-CL', { 
            style: 'currency', currency: 'CLP', maximumFractionDigits: 0 
        }).format(num);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start bg-slate-50/50 dark:bg-transparent p-1 rounded-2xl">
            {COLUMNAS.map((columna) => {
                const tarjetasColumna = licitaciones.filter(lic => lic.estado_pipeline === columna.id);
                const totalMonto = tarjetasColumna.reduce((sum, lic) => sum + (parseFloat(lic.monto_estimado) || 0), 0);

                return (
                    <div key={columna.id} className="bg-white dark:bg-[#111] border border-slate-100 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col min-h-[500px] shadow-sm">
                        
                        {/* Detalles superiores de la columna */}
                        <div className={`border-t-4 ${columna.color} p-4 flex flex-col gap-1 border-b border-slate-100 dark:border-gray-800 bg-slate-50/30 dark:bg-white/[0.01]`}>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-gray-300">
                                    {columna.titulo}
                                </span>
                                <span className="text-[10px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full font-black text-slate-500 dark:text-gray-400">
                                    {tarjetasColumna.length} 
                                </span>
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-[#c1f75e] font-mono mt-0.5">
                                {formatMoney(totalMonto)}
                            </span>
                        </div>

                        {/* Columnas */}
                        <div className="p-3 space-y-3 max-h-[65vh] overflow-y-auto bg-white dark:bg-black/10 flex-1">
                            {tarjetasColumna.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 dark:border-gray-800 rounded-xl p-4 m-1">
                                    <FileText size={16} className="text-slate-300 mb-2" />
                                    <span className="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">Sin Registros</span>
                                </div>
                            ) : (
                                tarjetasColumna.map((lic) => (
                                    <Link 
                                        key={lic.id} 
                                        href={route('licitaciones.show', lic.id)}
                                        className="block bg-white dark:bg-[#141414] border border-slate-100 dark:border-gray-800 hover:border-slate-200 dark:hover:border-gray-700 rounded-xl p-4 transition-all duration-150 shadow-sm hover:shadow-md group cursor-pointer active:scale-[0.98]"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[9px] font-mono text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                                                ID: #{lic.id}
                                            </span>
                                            <EstadoBadge estado={lic.estado_pipeline} />
                                        </div>

                                        <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-[#c1f75e] transition-colors line-clamp-2 mb-4">
                                            {lic.nombre_proyecto}
                                        </h3>

                                        <div className="space-y-1.5 border-t border-slate-50 dark:border-gray-800/50 pt-3">
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-gray-400">
                                                <Building2 size={11} className="text-slate-400 shrink-0" />
                                                <span className="truncate font-bold uppercase">{lic.empresa?.nombre || 'S/N'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-2.5 border-t border-slate-50 dark:border-gray-800/30 flex justify-between items-center">
                                            <div className={`text-[11px] font-mono font-black tracking-tight ${
                                                lic.estado_pipeline === 'Adjudicada' ? 'text-green-600' : 'text-slate-900 dark:text-white'
                                            }`}>
                                                {formatMoney(lic.monto_estimado)}
                                            </div>
                                            <div className="p-1 text-slate-400 dark:text-gray-600 group-hover:text-slate-800 dark:group-hover:text-[#c1f75e] transition-colors">
                                                <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}