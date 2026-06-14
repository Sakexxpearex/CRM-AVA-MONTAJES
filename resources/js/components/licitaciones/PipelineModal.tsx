import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, TrendingUp, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import InputError from '@/components/input-error';

export default function PipelineModal({ isOpen, onClose, licitacion, empresasCompetencia = [] }: any) {
    
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        estado_pipeline: licitacion?.estado_pipeline || '',
        competencia_ganadora_id: licitacion?.competencia_ganadora_id || '',
        comentario_cierre: '',
        centro_costo: '', 
    });

    useEffect(() => {
        if (isOpen && licitacion) {
            reset();
            setData('estado_pipeline', licitacion.estado_pipeline);
            setData('competencia_ganadora_id', licitacion.competencia_ganadora_id || '');
        }
    }, [isOpen, licitacion]);

    // Variables de control semánticas alineadas con los strings del pipeline
    const isPerdida = data.estado_pipeline === 'Perdida';
    const isGanada = data.estado_pipeline === 'Adjudicada'; // 🔥 Corregido de 'Ganada' a 'Adjudicada'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isGanada) {
            // Envío correcto vía POST para gatillar la lógica de adjudicación en Laravel
            post(route('licitaciones.adjudicar', licitacion.id), {
                onSuccess: () => { onClose(); reset(); },
            });
        } else {
            patch(route('licitaciones.update_pipeline', licitacion.id), {
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    if (!isOpen || !licitacion) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl p-5 md:p-8 shadow-2xl transition-all style-scrollbar">
                
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${isPerdida ? 'bg-red-500/10 text-red-400' : isGanada ? 'bg-blue-500/10 text-blue-400' : 'bg-[#c1f75e]/10 text-[#c1f75e]'}`}>
                            {isGanada ? <CheckCircle size={18} /> : <TrendingUp size={18} />}
                        </div>
                        <h2 className="text-lg md:text-xl font-black uppercase italic dark:text-white tracking-tighter">
                            {isGanada ? 'Adjudicar Proyecto' : 'Estado del Pipeline'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white p-1 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Selector */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">Fase de la Licitación</label>
                        <select 
                            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none cursor-pointer"
                            value={data.estado_pipeline}
                            onChange={e => setData('estado_pipeline', e.target.value)}
                            required
                        >
                            <option value="Evaluación" className="dark:bg-[#111]">Evaluación</option>
                            <option value="Preparación" className="dark:bg-[#111]">Preparación</option>
                            <option value="Filtro" className="dark:bg-[#111]">Filtro</option>
                            <option value="Presentada" className="dark:bg-[#111]">Presentada</option>
                            <option value="Adjudicada" className="dark:bg-[#111]">Adjudicada (Ganada)</option>
                            <option value="Operativa" className="dark:bg-[#111]">Operativa</option>
                            <option value="Perdida" className="dark:bg-[#111]">Perdida</option>
                            <option value="Desierta" className="dark:bg-[#111]">Desierta</option>
                        </select>
                    </div>

                    {/* Centro de costo licitacion ganada */}
                    {isGanada && (
                        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase italic tracking-wide">
                                <AlertCircle size={13} /> Creación de Proyecto Operativo
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 tracking-widest block">Centro de Costo Requerido</label>
                                <input 
                                    type="text"
                                    placeholder="Ej: CC-2026-001"
                                    className="w-full bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 text-white focus:border-blue-500 outline-none font-mono tracking-wide uppercase"
                                    value={data.centro_costo}
                                    onChange={e => setData('centro_costo', e.target.value.toUpperCase())}
                                    required={isGanada}
                                    autoFocus
                                />
                                <InputError message={errors.centro_costo} />
                            </div>
                        </div>
                    )}

                    {/* Competencia licitacion perdida */}
                    {isPerdida && (
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase italic tracking-wide">
                                <ShieldAlert size={13} /> Competencia Adjudicada
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block">¿Quién ganó la licitación?</label>
                                <select 
                                    className="w-full bg-black border border-red-500/20 rounded-lg text-sm p-3 text-white focus:border-red-500 outline-none cursor-pointer"
                                    value={data.competencia_ganadora_id}
                                    onChange={e => setData('competencia_ganadora_id', e.target.value)}
                                    required={isPerdida}
                                >
                                    <option value="" className="dark:bg-[#111]">Seleccionar competencia...</option>
                                    {empresasCompetencia.map((emp: any) => (
                                        <option key={emp.id} value={emp.id} className="dark:bg-[#111]">{emp.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">Notas de Cierre / Feedback</label>
                        <textarea 
                            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white min-h-[80px] outline-none focus:ring-1 focus:ring-[#c1f75e] resize-none"
                            value={data.comentario_cierre}
                            onChange={e => setData('comentario_cierre', e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className={`w-full py-3.5 md:py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-40
                            ${isGanada ? 'bg-blue-600 text-white' : isPerdida ? 'bg-red-600 text-white' : 'bg-[#c1f75e] text-black'}
                        `}
                    >
                        {processing ? 'Procesando...' : isGanada ? 'Confirmar y Adjudicar' : 'Actualizar Estado'}
                    </button>
                </form>
            </div>
        </div>
    );
}