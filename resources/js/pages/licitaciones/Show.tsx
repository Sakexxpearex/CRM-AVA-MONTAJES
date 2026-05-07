import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, Building2, Calendar, DollarSign, 
    MessageSquare, Clock, FileText, User, ArrowRight,
    ShieldCheck, Plus, ExternalLink
} from 'lucide-react';
import EstadoBadge from '@/components/licitaciones/EstadoBadge';

export default function Show({ licitacion }: any) {
    // Formateador de moneda
    const formatMoney = (val: number) => 
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val || 0);

    return (
        <AuthenticatedLayout>
            <Head title={`Licitación: ${licitacion.nombre_proyecto}`} />

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
                        <button className="px-4 py-2 bg-white/5 border border-gray-800 text-white text-[10px] font-black uppercase rounded-lg hover:bg-[#c1f75e] hover:text-black transition-all">
                            Editar Licitación
                        </button>
                    </div>
                </div>

                {/* 2. HEADER PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                        {/* Marca de agua si es contrato activo */}
                        {licitacion.proyecto_id && (
                            <ShieldCheck size={120} className="absolute -right-4 -bottom-4 text-[#c1f75e]/5 -rotate-12" />
                        )}
                        
                        <div className="space-y-4 relative z-10">
                            <EstadoBadge estado={licitacion.estado_pipeline} />
                            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white leading-none">
                                {licitacion.nombre_proyecto}
                            </h1>
                            <div className="flex flex-wrap gap-6 pt-2">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Building2 size={16} className="text-[#c1f75e]" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{licitacion.empresa?.nombre}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <User size={16} className="text-[#c1f75e]" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{licitacion.division?.nombre}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD DE MONTO RÁPIDO */}
                    <div className="bg-[#c1f75e] p-8 rounded-3xl flex flex-col justify-center shadow-xl shadow-[#c1f75e]/10">
                        <p className="text-[10px] font-black uppercase text-black/50 tracking-widest mb-1">Presupuesto Estimado</p>
                        <h2 className="text-3xl font-black text-black font-mono tracking-tighter">
                            {formatMoney(licitacion.monto_estimado)}
                        </h2>
                        <div className="mt-4 pt-4 border-t border-black/10 flex items-center gap-2 text-black/60 font-black text-[10px] uppercase">
                            <Clock size={14} /> Cierre: {licitacion.fecha_cierre || 'Pendiente'}
                        </div>
                    </div>
                </div>

                {/* 3. CONTENIDO DETALLADO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-2 space-y-6">
                        {/* Si ya es un PROYECTO (del Seeder) */}
                        {licitacion.proyecto && (
                            <div className="bg-black border border-[#c1f75e]/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#c1f75e]/10 rounded-2xl text-[#c1f75e]">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase text-xs">Licitación Adjudicada</h4>
                                        <p className="text-gray-500 text-[10px] font-bold">Vínculo: {licitacion.proyecto.nombre} ({licitacion.proyecto.centro_costo})</p>
                                    </div>
                                </div>
                                <Link 
                                    href="#" // Aquí iría route('proyectos.show', licitacion.proyecto_id)
                                    className="w-full md:w-auto px-6 py-3 bg-[#c1f75e] text-black text-[10px] font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"
                                >
                                    Ver Ejecución del Contrato <ExternalLink size={14} />
                                </Link>
                            </div>
                        )}

                        {/* Descripción */}
                        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                <FileText size={16} className="text-[#c1f75e]" /> Alcance y Detalles
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed italic">
                                {licitacion.descripcion || 'No hay descripción registrada.'}
                            </p>
                        </div>

                        {/* BITÁCORA */}
                        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <MessageSquare size={16} className="text-[#c1f75e]" /> Bitácora de Gestiones
                                </h3>
                                <button className="p-2 bg-[#c1f75e]/10 text-[#c1f75e] rounded-lg hover:bg-[#c1f75e] hover:text-black transition-all">
                                    <Plus size={16} strokeWidth={3} />
                                </button>
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
                                                    <span className="text-[10px] font-black text-[#c1f75e] uppercase tracking-widest">{int.tipo_contacto}</span>
                                                    <span className="text-[10px] text-gray-500 font-mono">{int.fecha}</span>
                                                </div>
                                                <p className="text-xs text-gray-300 mb-3 leading-relaxed italic">"{int.comentario}"</p>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase">
                                                    <User size={10} /> {int.user?.name} <ArrowRight size={10} /> {int.persona?.nombre_1} {int.persona?.apellido_1}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-800 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sin gestiones registradas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: SIDEBAR */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
                            <h3 className="text-[10px] font-black uppercase text-gray-500 mb-6 tracking-widest">Estado del Pipeline</h3>
                            <div className="space-y-5">
                                {/* Sincronizado con los estados de tu Seeder */}
                                {['Prospecto', 'Evaluación', 'Negociación', 'Ganada'].map((step, idx) => {
                                    const isCurrent = licitacion.estado_pipeline === step;
                                    return (
                                        <div key={idx} className={`flex items-center gap-4 ${isCurrent ? 'opacity-100' : 'opacity-20'}`}>
                                            <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-[#c1f75e] shadow-[0_0_12px_#c1f75e]' : 'bg-gray-700'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Card de Contacto Clave */}
                        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
                            <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Contacto Mandante</h3>
                            {licitacion.interacciones?.[0]?.persona ? (
                                <Link 
                                    href={route('personas.show', licitacion.interacciones[0].persona.id)}
                                    className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl hover:bg-[#c1f75e]/10 transition-all group"
                                >
                                    <div className="w-10 h-10 bg-black border border-gray-800 rounded-xl flex items-center justify-center text-[#c1f75e] font-black group-hover:border-[#c1f75e]/50 transition-all text-xs">
                                        {licitacion.interacciones[0].persona.nombre_1[0]}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase group-hover:text-[#c1f75e] transition-colors">
                                            {licitacion.interacciones[0].persona.nombre_1} {licitacion.interacciones[0].persona.apellido_1}
                                        </p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Ver Perfil</p>
                                    </div>
                                </Link>
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