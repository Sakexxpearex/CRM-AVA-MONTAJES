import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, Building2, Calendar, DollarSign, 
    MessageSquare, Clock, FileText, User, ArrowRight 
} from 'lucide-react';
import EstadoBadge from '@/components/licitaciones/EstadoBadge';

export default function Show({ licitacion }: any) {
    // Formateador de moneda
    const formatMoney = (val: number) => 
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

    return (
        <AuthenticatedLayout>
            <Head title={`Proyecto: ${licitacion.nombre_proyecto}`} />

            <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
                
                {/* 1. NAVEGACIÓN Y ACCIONES */}
                <div className="flex items-center justify-between">
                    <Link 
                        href={route('licitaciones.index')}
                        className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-[#c1f75e] transition-colors"
                    >
                        <ChevronLeft size={14} strokeWidth={3} /> Volver al Pipeline
                    </Link>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/5 border border-gray-800 text-white text-[10px] font-black uppercase rounded-lg hover:bg-white/10 transition-all">
                            Editar Proyecto
                        </button>
                    </div>
                </div>

                {/* 2. HEADER PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800">
                        <div className="space-y-4">
                            <EstadoBadge estado={licitacion.estado_pipeline} />
                            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white leading-none">
                                {licitacion.nombre_proyecto}
                            </h1>
                            <div className="flex flex-wrap gap-6 pt-2">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Building2 size={16} className="text-[#c1f75e]" />
                                    <span className="text-xs font-bold uppercase">{licitacion.empresa?.nombre}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <User size={16} className="text-[#c1f75e]" />
                                    <span className="text-xs font-bold uppercase">{licitacion.division?.nombre}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD DE MONTO RÁPIDO */}
                    <div className="bg-[#c1f75e] p-8 rounded-3xl flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase text-black/50 tracking-widest mb-1">Monto Estimado</p>
                        <h2 className="text-3xl font-black text-black font-mono">
                            {formatMoney(licitacion.monto_estimado)}
                        </h2>
                        <div className="mt-4 pt-4 border-t border-black/10 flex items-center gap-2 text-black/60 font-bold text-xs">
                            <Clock size={14} /> Cierre: {licitacion.fecha_cierre || 'TBD'}
                        </div>
                    </div>
                </div>

                {/* 3. CONTENIDO DETALLADO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* COLUMNA IZQUIERDA: BITÁCORA E INFO */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Descripción */}
                        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-800 space-y-4">
                            <h3 className="text-xs font-black uppercase text-white flex items-center gap-2">
                                <FileText size={16} className="text-[#c1f75e]" /> Alcance del Proyecto
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed italic">
                                {licitacion.descripcion || 'No se ha proporcionado una descripción detallada para este proyecto.'}
                            </p>
                        </div>

                        {/* BITÁCORA DE INTERACCIONES (CONECTADA) */}
                        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-800">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-black uppercase text-white flex items-center gap-2">
                                    <MessageSquare size={16} className="text-[#c1f75e]" /> Historial de Gestiones
                                </h3>
                            </div>

                            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-800">
                                {licitacion.interacciones?.length > 0 ? (
                                    licitacion.interacciones.map((int: any) => (
                                        <div key={int.id} className="relative pl-12">
                                            <div className="absolute left-0 top-1 w-9 h-9 bg-black border border-gray-800 rounded-full flex items-center justify-center z-10 text-[#c1f75e]">
                                                <Clock size={14} />
                                            </div>
                                            <div className="bg-white/5 p-5 rounded-2xl border border-gray-800/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-black text-[#c1f75e] uppercase tracking-widest">
                                                        {int.tipo_contacto}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono italic">
                                                        {int.fecha}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-300 mb-3">{int.comentario}</p>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase">
                                                    <User size={10} /> {int.user?.name || 'Sistema'} 
                                                    <ArrowRight size={10} /> con {int.persona?.nombre || 'Contacto'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-10 text-gray-600 text-xs uppercase font-bold tracking-widest">
                                        No hay gestiones registradas aún
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: SIDEBAR DE DATOS */}
                    <div className="space-y-6">
                        
                        {/* Status Timeline Simulado */}
                        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-800">
                            <h3 className="text-[10px] font-black uppercase text-gray-500 mb-6 tracking-widest">Pipeline Progress</h3>
                            <div className="space-y-4">
                                {['Prospecto', 'Cotización', 'Negociación', 'Adjudicado'].map((step, idx) => {
                                    const isCurrent = licitacion.estado_pipeline === step;
                                    return (
                                        <div key={idx} className={`flex items-center gap-3 ${isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                                            <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#c1f75e] shadow-[0_0_10px_#c1f75e]' : 'bg-gray-600'}`} />
                                            <span className={`text-[10px] font-black uppercase ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Personas Involucradas (Opcional) */}
                        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-800">
                            <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Último Contacto</h3>
                            {licitacion.interacciones?.[0]?.persona ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#c1f75e]/10 border border-[#c1f75e]/20 rounded-xl flex items-center justify-center text-[#c1f75e] font-black">
                                        {licitacion.interacciones[0].persona.nombre.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase">{licitacion.interacciones[0].persona.nombre}</p>
                                        <p className="text-[10px] text-gray-500 font-bold">{licitacion.interacciones[0].persona.cargo || 'Contacto Clave'}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[10px] text-gray-600 italic">No hay contactos vinculados.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}