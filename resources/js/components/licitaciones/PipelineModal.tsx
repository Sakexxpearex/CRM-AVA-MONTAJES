import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, TrendingUp, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import InputError from '@/components/input-error';

export default function PipelineModal({ isOpen, onClose, licitacion, empresasCompetencia }: any) {
    
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        estado_pipeline: licitacion.estado_pipeline || '',
        competencia_ganadora_id: licitacion.competencia_ganadora_id || '',
        comentario_cierre: '',
        centro_costo: '', 
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            setData('estado_pipeline', licitacion.estado_pipeline);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.estado_pipeline === 'Ganada') {
            post(route('licitaciones.adjudicar', licitacion.id), {
                onSuccess: () => { onClose(); reset(); },
            });
        } else {
            patch(route('licitaciones.update_pipeline', licitacion.id), {
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    if (!isOpen) return null;

    const isPerdida = data.estado_pipeline === 'Perdida';
    const isGanada = data.estado_pipeline === 'Ganada';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-2xl p-8 shadow-2xl transition-all">
                
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isPerdida ? 'bg-red-500/20 text-red-500' : isGanada ? 'bg-blue-500/20 text-blue-500' : 'bg-[#c1f75e]/20 text-[#c1f75e]'}`}>
                            {isGanada ? <CheckCircle size={20} /> : <TrendingUp size={20} />}
                        </div>
                        <h2 className="text-xl font-black uppercase italic dark:text-white tracking-tighter">
                            {isGanada ? 'Adjudicar Proyecto' : 'Estado del Pipeline'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Selector */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">Fase de la Licitación</label>
                        <select 
                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none"
                            value={data.estado_pipeline}
                            onChange={e => setData('estado_pipeline', e.target.value)}
                            required
                        >
                                <option value="Evaluación">Evaluación</option>
                                <option value="Preparación">Preparación</option>
                                <option value="Filtro">Filtro</option>
                                <option value="Adjudicada">Adjudicada (Ganada)</option>
                                <option value="Operativa">Operativa</option>
                                <option value="Perdida">Perdida</option>
                                <option value="Desierta">Desierta</option>
                                <option value="Presentada">Presentada</option>
                        </select>
                    </div>

                    {/* Centro de costo licitacion ganada */}
                    {isGanada && (
                        <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-4 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase italic">
                                <AlertCircle size={14} /> Creación de Proyecto Operativo
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-1 tracking-widest">Centro de Costo Requerido</label>
                                <input 
                                    type="text"
                                    placeholder="Ej: CC-2026-001"
                                    className="w-full bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none font-mono"
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
                        <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-xl space-y-4 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase italic">
                                <ShieldAlert size={14} /> Competencia Adjudicada
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">¿Quién ganó la licitación?</label>
                                <select 
                                    className="w-full bg-black border border-red-500/30 rounded-lg text-sm p-3 text-white focus:ring-1 focus:ring-red-500 outline-none"
                                    value={data.competencia_ganadora_id}
                                    onChange={e => setData('competencia_ganadora_id', e.target.value)}
                                    required={isPerdida}
                                >
                                    <option value="">Seleccionar competencia...</option>
                                    {empresasCompetencia.map((emp: any) => (
                                        <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">Notas de Cierre / Feedback</label>
                        <textarea 
                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white min-h-[80px] outline-none focus:ring-1 focus:ring-[#c1f75e]"
                            value={data.comentario_cierre}
                            onChange={e => setData('comentario_cierre', e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl
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