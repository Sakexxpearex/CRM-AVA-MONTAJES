import { MessageSquare, Phone, Mail, MessageCircle, MoreHorizontal, User, FileText } from 'lucide-react';

export default function TimeLineItem({ interaccion }: any) {
    // Selector de icono según tipo
    const getIcon = (tipo: string) => {
        switch (tipo) {
            case 'Llamada': return <Phone size={16} />;
            case 'Correo': return <Mail size={16} />;
            case 'WhatsApp': return <MessageCircle size={16} />;
            default: return <MessageSquare size={16} />;
        }
    };

    return (
        <div className="relative pl-12 group">
            {/* Punto en la línea de tiempo */}
            <div className="absolute left-0 top-1 w-8 h-8 rounded-xl bg-[#0A0A0A] border border-gray-800 flex items-center justify-center text-gray-500 group-hover:border-[#c1f75e] group-hover:text-[#c1f75e] transition-all z-10 shadow-xl">
                {getIcon(interaccion.tipo_contacto)}
            </div>

            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:border-gray-700 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-[10px] font-black uppercase text-[#c1f75e] tracking-widest bg-[#c1f75e]/5 px-2 py-1 rounded">
                            {interaccion.tipo_contacto}
                        </span>
                        <p className="text-[11px] text-gray-500 font-mono mt-2">{interaccion.fecha}</p>
                    </div>
                    <button className="text-gray-600 hover:text-white"><MoreHorizontal size={18} /></button>
                </div>

                <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed italic border-l-2 border-gray-100 dark:border-gray-800 pl-4 mb-4">
                    "{interaccion.comentario}"
                </p>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-500">
                        <User size={12} className="text-[#c1f75e]" />
                        Registrado por: <span className="text-gray-700 dark:text-gray-300">{interaccion.user?.name}</span>
                    </div>
                    
                    {interaccion.licitacion && (
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-500">
                            <FileText size={12} className="text-[#c1f75e]" />
                            Proyecto: <span className="text-gray-700 dark:text-gray-300">{interaccion.licitacion.nombre_proyecto || interaccion.licitacion.nombre}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}