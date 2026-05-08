import { MessageSquare, Phone, Mail, Calendar, Plus, FileText, User } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface Interaccion {
    id: number;
    fecha: string;
    comentario: string;
    tipo_contacto: string;
    user?: { name: string }; // Usuario q registro
    licitacion?: { numero_licitacion: string }; // Por si viene de una licitación
}

export default function HistorialInteracciones({ interacciones }: { interacciones: Interaccion[] }) {
    
    // Iconos segun tipo de interaccion
    const getIcon = (tipo: string) => {
        const t = tipo.toLowerCase();
        if (t.includes('llamada')) return <Phone size={14} className="text-blue-400" />;
        if (t.includes('mail') || t.includes('correo')) return <Mail size={14} className="text-purple-400" />;
        if (t.includes('reunion') || t.includes('visita')) return <Calendar size={14} className="text-[#c1f75e]" />;
        return <MessageSquare size={14} className="text-gray-400" />;
    };

    return (
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm mt-8">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] dark:text-white flex items-center gap-2">
                    <FileText size={18} className="text-[#c1f75e]" />
                    Bitácora de Interacciones
                </h3>
                <button className="bg-[#c1f75e] text-black px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:scale-105 transition-all flex items-center gap-2">
                    <Plus size={14} strokeWidth={3} />
                    Registrar
                </button>
            </div>

            {/* Lista de interacciones */}
            <div className="p-6">
                {interacciones && interacciones.length > 0 ? (
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
                        {interacciones.map((i) => (
                            <div key={i.id} className="relative flex items-start gap-6 group">
                                
                                {/* Icono del tipo de interaccion */}
                                <div className="absolute left-0 w-10 h-10 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center z-10 shadow-xl group-hover:border-[#c1f75e] transition-colors">
                                    {getIcon(i.tipo_contacto)}
                                </div>

                                {/* Contenido */}
                                <div className="ml-12 w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black uppercase text-[#c1f75e] tracking-widest">
                                            {i.tipo_contacto}
                                        </span>
                                        <time className="text-[10px] font-mono text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                            {formatDate(i.fecha)} {/* Fecha Formateada (ej: 08 May. 2026) */}
                                        </time>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/50 rounded-xl p-4 mt-2">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                            "{i.comentario}"
                                        </p>
                                        
                                        {/* Información de la tabla */}
                                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase">
                                                <User size={10} />
                                                <span>Usuario ID: {i.user?.name || 'Sistema'}</span>
                                            </div>
                                            {i.licitacion && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#c1f75e] uppercase">
                                                    <FileText size={10} />
                                                    <span>Licitación: {i.licitacion.numero_licitacion}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <MessageSquare size={32} className="mx-auto text-gray-800 mb-3 opacity-20" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            No hay gestiones comerciales registradas
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}