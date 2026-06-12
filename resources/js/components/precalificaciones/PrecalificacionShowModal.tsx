import { useForm } from '@inertiajs/react';
import { X, Check, AlertTriangle, CornerDownRight, MessageSquare } from 'lucide-react';

interface ShowProps {
    precalificacion: any | null;
    onClose: () => void;
}

export default function PrecalificacionShowModal({ precalificacion, onClose }: ShowProps) {
    const { data, setData, patch, processing } = useForm({
        id: precalificacion?.id || null,
        nombre_precalificacion: precalificacion?.nombre_precalificacion || '', // Mapeado exacto con el controlador
        estado: precalificacion?.estado || 'Pendiente'
    });

    if (!precalificacion) return null;

    const handleCambioEstado = (nuevoEstado: 'Aprobada' | 'Rechazada') => {
    setData('estado', nuevoEstado);
    
   
    patch(route('precalificaciones.estado', precalificacion.id), {
        onSuccess: () => onClose(),
    });
};

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 relative shrink-0">
                    <button 
                        onClick={onClose} 
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2.5">
                        <MessageSquare className="text-[#c1f75e]" size={24} /> 
                        Ficha de Evaluación
                    </h2>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm style-scrollbar">
                    
                    {/* Nombre del Proyecto */}
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Proyecto</span>
                        <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {data.nombre_precalificacion || 'Sin nombre asignado'}
                        </h3>
                    </div>

                    {/* Cliente y División */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Cliente / Empresa</span>
                            <div className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-xs p-3 text-gray-900 dark:text-white font-bold truncate">
                                {precalificacion.empresa?.nombre || 'No especificada'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">División Receptora</span>
                            <div className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-xs p-3 text-gray-900 dark:text-white font-bold truncate">
                                {precalificacion.division?.nombre || 'No especificada'}
                            </div>
                        </div>
                    </div>

                    {/* Monto */}
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Monto Preliminar Estimado</span>
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-lg p-3 text-[#c1f75e] font-black tracking-tighter">
                            {precalificacion.monto_estimado 
                                ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precalificacion.monto_estimado)
                                : 'No estipulado'}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Descripción de la oportunidad</span>
                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-xs p-3 text-gray-700 dark:text-gray-300 min-h-[80px] max-h-[140px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
                            {precalificacion.descripcion || 'Sin descripción adicional proporcionada.'}
                        </div>
                    </div>

                    {/* Alerta */}
                    {precalificacion.estado === 'Pendiente' && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] leading-normal">
                            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                            <p>Si decides <strong className="font-black uppercase tracking-wide">Aprobar</strong> esta propuesta, pasará al Kanban comercial bajo el estado inicial de <span className="font-bold text-gray-900 dark:text-white underline decoration-[#c1f75e] decoration-2">Evaluación</span>.</p>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 shrink-0">
                    {precalificacion.estado === 'Pendiente' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => handleCambioEstado('Rechazada')}
                                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 py-3.5 rounded-lg font-black text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                            >
                                Rechazar
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => handleCambioEstado('Aprobada')}
                                className="w-full bg-[#c1f75e] text-black py-3.5 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-[#c1f75e]/10 hover:bg-[#a8e63a] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                                <Check size={14} strokeWidth={3} />
                                Aprobar y Enviar
                            </button>
                        </div>
                    ) : (
                        <div className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 p-3 rounded-lg text-xs text-gray-500 flex items-center justify-center gap-2">
                            <CornerDownRight size={14} className="text-[#c1f75e]" />
                            <span>Evaluación cerrada con estado:</span> 
                            <span className="font-black uppercase text-gray-900 dark:text-white tracking-wider">{precalificacion.estado}</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}