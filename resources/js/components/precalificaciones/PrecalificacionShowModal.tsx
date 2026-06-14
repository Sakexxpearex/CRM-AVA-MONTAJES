import { useForm, router } from '@inertiajs/react';
import { X, Check, CornerDownRight, MessageSquare, Send, Calendar, User, Building2, Wallet } from 'lucide-react';

interface ShowProps {
    precalificacion: any | null;
    onClose: () => void;
}

export default function PrecalificacionShowModal({ precalificacion, onClose }: ShowProps) {
    // Bitácora de seguimiento
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
                    
                    {/* Nombre del Proyecto */}
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Proyecto</span>
                        <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                            {precalificacion.nombre_precalificacion || 'Sin nombre asignado'}
                        </h3>
                    </div>

                    {/* Cliente y División */}
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

                    {/* Datos del Contacto Asociado */}
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Contacto del Cliente</span>
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 shrink-0">
                                <User size={14} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide truncate">
                                    {precalificacion.persona 
                                        ? `${precalificacion.persona.nombre_1} ${precalificacion.persona.apellido_1 || ''}`
                                        : 'Sin contacto asignado'}
                                </span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold truncate">
                                    {precalificacion.persona?.correo || 'Sin correo registrado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Monto */}
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Monto Preliminar Estimado</span>
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-base px-3 py-2.5 text-[#c1f75e] font-mono font-black tracking-tight flex items-center gap-2">
                            <Wallet size={14} className="text-gray-400" />
                            {precalificacion.monto_estimado 
                                ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(precalificacion.monto_estimado)
                                : 'No estipulado'}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Descripción de la oportunidad</span>
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs p-3 text-gray-600 dark:text-gray-400 max-h-[100px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text style-scrollbar">
                            {precalificacion.descripcion || precalificacion.resumen_visita || 'Sin descripción adicional proporcionada.'}
                        </div>
                    </div>

                    {/* Bitácora */}
                    <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4 space-y-3">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">
                            Bitácora de Notas y Seguimiento
                        </span>

                        {/* Formulario de Entrada */}
                        <form onSubmit={handleGuardarInteraccion} className="space-y-2">
                            <div className="flex gap-2">
                                <select
                                    value={noteForm.data.tipo_contacto}
                                    onChange={e => noteForm.setData('tipo_contacto', e.target.value)}
                                    className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-2.5 py-2 text-[10px] font-black uppercase text-gray-700 dark:text-gray-300 focus:outline-none focus:border-gray-400 dark:focus:border-gray-700 transition-colors"
                                >
                                    <option value="Reunión Presencial">Reunión</option>
                                    <option value="Llamada">Llamada</option>
                                    <option value="Correo">Correo</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                    <option value="Otro">Otro</option>
                                </select>

                                <input
                                    type="text"
                                    value={noteForm.data.comentario}
                                    onChange={e => noteForm.setData('comentario', e.target.value)}
                                    placeholder={`Anota lo conversado...`}
                                    disabled={noteForm.processing}
                                    className="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#c1f75e] transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={noteForm.processing || !noteForm.data.comentario.trim()}
                                    className="bg-gray-100 dark:bg-white/5 hover:bg-[#c1f75e] dark:hover:bg-[#c1f75e] text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-black p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
                                >
                                    <Send size={13} />
                                </button>
                            </div>
                        </form>

                        {/* Listado notas */}
                        <div className="space-y-2 max-h-[160px] overflow-y-auto style-scrollbar pr-1">
                            {precalificacion.interacciones && precalificacion.interacciones.length > 0 ? (
                                [...precalificacion.interacciones].reverse().map((int: any) => (
                                    <div key={int.id} className="bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800/40 rounded-xl p-3 space-y-1.5">
                                        <div className="flex justify-between items-center text-[9px]">
                                            <span className="font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                [{int.tipo_contacto || 'Gestión'}]
                                            </span>
                                            <span className="flex items-center gap-1 font-bold text-gray-400 dark:text-gray-500 shrink-0">
                                                <Calendar size={10} /> 
                                                {new Date(int.created_at || int.fecha).toLocaleDateString('es-CL')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug select-text">
                                            {int.comentario}
                                        </p>
                                        <div className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider text-right">
                                            Por: {int.user?.name || 'Gestor AVA'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-[10px] font-black uppercase tracking-wider text-gray-400 py-6 italic border border-dashed border-gray-100 dark:border-gray-800/60 rounded-xl">
                                    No hay notas registradas aún.
                                </p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 shrink-0">
                    {precalificacion.estado === 'Pendiente' ? (
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
                                className="w-full bg-[#c1f75e] text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#c1f75e]/5 hover:bg-[#a8e63a] transition-all flex items-center justify-center gap-1.5"
                            >
                                <Check size={12} strokeWidth={3} />
                                Aprobar y Enviar
                            </button>
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