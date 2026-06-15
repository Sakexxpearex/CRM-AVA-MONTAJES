import { useForm, router } from '@inertiajs/react';
import { X, Check, CornerDownRight, MessageSquare, Send, Calendar, User, Building2, Wallet, Edit3 } from 'lucide-react';

interface ShowProps {
    precalificacion: any | null;
    onClose: () => void;
    onEditClick: (precalificacion: any) => void;
}

export default function PrecalificacionShowModal({ precalificacion, onClose, onEditClick }: ShowProps) {
    const noteForm = useForm({
        comentario: '',
        tipo_contacto: 'Reunión Presencial' 
    });

    if (!precalificacion) return null;

    const handleCambioEstado = (nuevoEstado: 'Aprobada' | 'Rechazada') => {
        router.patch(route('precalificaciones.estado', precalificacion.id), {
            estado: nuevoEstado
        }, {
            onSuccess: () => onClose(),
        });
    };

    const handleGuardarInteraccion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteForm.data.comentario.trim()) return;

        noteForm.post(route('precalificaciones.interacciones.store', precalificacion.id), {
            preserveScroll: true,
            onSuccess: () => {
                noteForm.reset('comentario');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                
                {/* Header */}
                <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800/80 relative shrink-0">
                    <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                        <MessageSquare className="text-[#c1f75e]" size={20} strokeWidth={2.5} /> 
                        Ficha de Evaluación
                    </h2>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm style-scrollbar">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Proyecto</span>
                        <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                            {precalificacion.nombre_precalificacion || 'Sin nombre asignado'}
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Cliente / Empresa</span>
                            <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs px-3 py-2.5 text-gray-800 dark:text-gray-200 font-black uppercase tracking-wide truncate flex items-center gap-1.5">
                                <Building2 size={12} className="text-gray-400 shrink-0" />
                                {precalificacion.empresa?.nombre || 'No especificada'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">División Receptora</span>
                            <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs px-3 py-2.5 text-gray-800 dark:text-gray-200 font-black uppercase tracking-wide truncate">
                                {precalificacion.division?.nombre || 'No especificada'}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Contacto del Cliente</span>
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 shrink-0">
                                <User size={14} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide truncate">
                                    {precalificacion.persona ? `${precalificacion.persona.nombre_1} ${precalificacion.persona.apellido_1 || ''}` : 'Sin contacto asignado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Monto Preliminar Estimado</span>
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-base px-3 py-2.5 text-[#c1f75e] font-mono font-black tracking-tight flex items-center gap-2">
                            <Wallet size={14} className="text-gray-400" />
                            {precalificacion.monto_estimado ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(precalificacion.monto_estimado) : 'No estipulado'}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Descripción de la oportunidad</span>
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs p-3 text-gray-600 dark:text-gray-400 max-h-[100px] overflow-y-auto whitespace-pre-wrap leading-relaxed style-scrollbar">
                            {precalificacion.descripcion || precalificacion.resumen_visita || 'Sin descripción adicional proporcionada.'}
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4 space-y-3">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Bitácora de Notas y Seguimiento</span>
                        <form onSubmit={handleGuardarInteraccion} className="flex gap-2">
                            <input
                                type="text"
                                value={noteForm.data.comentario}
                                onChange={e => noteForm.setData('comentario', e.target.value)}
                                placeholder="Anota lo conversado..."
                                className="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
                            />
                            <button type="submit" className="bg-gray-100 dark:bg-white/5 text-gray-600 p-2.5 rounded-xl"><Send size={13} /></button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 shrink-0">
                    {precalificacion.estado === 'Pendiente' ? (
                        <div className="flex flex-col gap-3">
                            {/* Botón de edición */}
                            <button
                                type="button"
                                onClick={() => onEditClick(precalificacion)}
                                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-800 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit3 size={12} />
                                Editar Datos Básicos
                            </button>

                            {/* Decisiones finales */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleCambioEstado('Rechazada')}
                                    className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
                                >
                                    Rechazar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCambioEstado('Aprobada')}
                                    className="w-full bg-[#c1f75e] text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#a8e63a] transition-all flex items-center justify-center gap-1.5"
                                >
                                    <Check size={12} strokeWidth={3} />
                                    Aprobar y Enviar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 p-3 rounded-xl text-[10px] font-black uppercase text-gray-400 flex items-center justify-center gap-2 tracking-wider">
                            <CornerDownRight size={12} className="text-[#c1f75e]" />
                            <span>Evaluación cerrada:</span> 
                            <span className="text-gray-900 dark:text-white">{precalificacion.estado}</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}