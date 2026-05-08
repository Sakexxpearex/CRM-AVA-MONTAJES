import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ChevronLeft, Mail, Phone, Linkedin,
    Building2, Calendar, Briefcase, MessageSquare,
    MapPin, Clock, ShieldCheck, Plus, X, User, FileText, ClipboardList, ArrowRight
} from 'lucide-react';

import { Persona } from '@/types/persona';
import { formatDate } from '@/utils/formatters';

interface Division {
    id: number;
    nombre: string;
    empresa: { nombre: string };
}

interface Props {
    persona: Persona & { interacciones: any[] };
    divisiones: Division[];
    licitaciones: any[]; // Recibimos licitaciones del controlador
}

export default function PersonaShow({ persona, divisiones, licitaciones }: Props) {
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [isInteraccionModalOpen, setIsInteraccionModalOpen] = useState(false);

    // Formulario 1: Experiencia Laboral
    const formExp = useForm({
        persona_id: persona.id,
        division_id: '',
        cargo: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado_actual: false as boolean,
    });

    // Formulario 2: Interacciones (Bitácora CRM)
    const formInt = useForm({
        persona_id: persona.id,
        tipo_contacto: '',
        fecha: new Date().toISOString().split('T')[0],
        comentario: '',
        licitacion_id: '', // Este es el campo que conectaremos
    });

    const getInitials = (name: string | null | undefined) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        return parts[0][0]?.toUpperCase() || '?';
    };

    const submitExperiencia = (e: React.FormEvent) => {
        e.preventDefault();
        formExp.post(route('historial.store'), {
            onSuccess: () => { setIsExpModalOpen(false); formExp.reset(); },
        });
    };

    const submitInteraccion = (e: React.FormEvent) => {
        e.preventDefault();
        formInt.post(route('interacciones.store'), {
            onSuccess: () => { setIsInteraccionModalOpen(false); formInt.reset(); },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${persona.nombre_completo} - Perfil CRM`} />

            <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-6">

                {/* Navegación Superior */}
                <Link
                    href={route('personas.index')}
                    className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-[#c1f75e] transition-colors text-xs font-black uppercase tracking-widest group w-fit"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al Directorio
                </Link>

                {/* Perfil Principal */}
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="h-32 bg-gray-900 relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    </div>

                    <div className="px-4 pb-8 md:px-8">
                        <div className="relative flex flex-col items-center text-center md:flex-row md:items-end md:text-left gap-6 -mt-16 md:-mt-12">
                            <div className="w-32 h-32 bg-gray-900 text-[#c1f75e] rounded-2xl flex items-center justify-center text-4xl font-black border-4 border-white dark:border-[#111] shadow-2xl shrink-0 z-10">
                                {getInitials(persona.nombre_completo)}
                            </div>

                            <div className="flex-1 pb-2 space-y-1">
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                                    {persona.nombre_completo}
                                </h1>
                                <p className="text-gray-500 font-mono text-sm flex items-center justify-center md:justify-start gap-2">
                                    <ShieldCheck size={14} className="text-gray-400" /> {persona.rut}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto pb-2">
                                <button
                                    onClick={() => setIsInteraccionModalOpen(true)}
                                    className="w-full sm:w-auto bg-[#c1f75e] text-black px-6 py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:brightness-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c1f75e]/20"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                    Registrar Interacción
                                </button>
                                <button className="w-full sm:w-auto bg-white dark:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-gray-800 px-6 py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:opacity-80 transition-all shadow-lg">
                                    Editar Perfil
                                </button>
                            </div>
                        </div>

                        {/* Contact Chips */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                            <a href={`mailto:${persona.email}`} className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#c1f75e] hover:text-black transition-all border border-transparent">
                                <Mail size={14} /> {persona.email}
                            </a>
                            <a href={`tel:${persona.telefono}`} className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#c1f75e] hover:text-black transition-all border border-transparent">
                                <Phone size={14} /> {persona.telefono}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Trayectoria Laboral */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 relative">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <Briefcase size={14} className="text-[#c1f75e]" /> Historial de Cargos
                                </h3>
                                <button
                                    onClick={() => setIsExpModalOpen(true)}
                                    className="p-2 bg-[#c1f75e]/10 text-[#c1f75e] rounded-lg hover:bg-[#c1f75e] hover:text-black transition-all group"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
                                {persona.historial_laboral?.map((empleo, idx) => (
                                    <div key={idx} className="relative pl-14">
                                        <div className={`absolute left-0 top-0 w-[36px] h-[36px] rounded-xl flex items-center justify-center border-4 border-white dark:border-[#111] z-10 transition-all ${empleo.estado_actual ? 'bg-[#c1f75e] text-black shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                            <Building2 size={16} />
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div>
                                                <h4 className="font-black text-base uppercase tracking-tight text-gray-900 dark:text-white">{empleo.cargo}</h4>
                                                <p className="text-sm text-gray-800 dark:text-gray-200 font-extrabold uppercase">{empleo.division.empresa.nombre}</p>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-gray-100 dark:bg-white/5 text-gray-500">
                                                <Clock size={12} /> {formatDate(empleo.fecha_inicio)} — {empleo.estado_actual ? 'Presente' : formatDate(empleo.fecha_fin)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Bitácora de Interacciones */}
                    <div className="space-y-6">
                        <section className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 mb-6">
                                <ClipboardList size={14} className="text-[#c1f75e]" /> Bitácora CRM
                            </h3>

                            <div className="space-y-6">
                                {persona.interacciones?.length > 0 ? (
                                    persona.interacciones.map((int, idx) => (
                                        <div key={idx} className="relative pl-6 border-l border-gray-200 dark:border-gray-800 space-y-2">
                                            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#c1f75e] shadow-[0_0_8px_#c1f75e]"></div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-[9px] font-black uppercase text-[#c1f75e] tracking-widest">{int.tipo_contacto}</span>
                                                <span className="text-[9px] font-mono text-gray-500 italic">{formatDate(int.fecha)}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                                "{int.comentario}"
                                            </p>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {int.licitacion && (
                                                    <span className="text-[8px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-gray-800 flex items-center gap-1 uppercase font-bold">
                                                        <FileText size={8} /> {int.licitacion.nombre_proyecto}
                                                    </span>
                                                )}
                                                <span className="text-[8px] bg-white/5 text-gray-500 px-2 py-0.5 rounded flex items-center gap-1 uppercase font-bold">
                                                    <User size={8} /> {int.user?.name || 'Sistema'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sin interacciones</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="bg-[#c1f75e] rounded-2xl p-6 text-black shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Resumen</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-2xl font-black tracking-tighter">{persona.interacciones?.length || 0}</p>
                                    <p className="text-[9px] font-bold uppercase">Gestiones</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black tracking-tighter">{persona.historial_laboral?.length || 0}</p>
                                    <p className="text-[9px] font-bold uppercase">Empresas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registrar Interaccion  */}
            {isInteraccionModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl transition-colors">

                        <button
                            onClick={() => setIsInteraccionModalOpen(false)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <MessageSquare className="text-[#c1f75e]" /> Nueva Gestión Comercial
                        </h2>

                        <form onSubmit={submitInteraccion} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Tipo de Contacto</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-sm focus:border-[#c1f75e] focus:ring-0 mt-1 transition-colors"
                                        value={formInt.data.tipo_contacto}
                                        onChange={e => formInt.setData('tipo_contacto', e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Reunión Presencial">Reunión Presencial</option>
                                        <option value="Llamada">Llamada Telefónica</option>
                                        <option value="Correo">Correo Electrónico</option>
                                        <option value="WhatsApp">Mensaje WhatsApp</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Fecha</label>
                                    <input
                                        type="date"
                                        className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-sm focus:border-[#c1f75e] focus:ring-0 mt-1 transition-colors"
                                        value={formInt.data.fecha}
                                        onChange={e => formInt.setData('fecha', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Asociar a Licitación</label>
                                <select
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-sm focus:border-[#c1f75e] focus:ring-0 mt-1 transition-colors"
                                    value={formInt.data.licitacion_id}
                                    onChange={e => formInt.setData('licitacion_id', e.target.value)}
                                >
                                    <option value="">Ninguna licitación</option>
                                    {/* Usamos las licitaciones que vienen del controlador */}
                                    {licitaciones && licitaciones.length > 0 ? (
                                        licitaciones.map((lic) => (
                                            <option key={lic.id} value={lic.id} className="dark:bg-[#111]">
                                                {lic.nombre} {/* <--- Asegúrate que diga .nombre */}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay licitaciones disponibles</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Detalle / Nota</label>
                                <textarea
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-sm focus:border-[#c1f75e] focus:ring-0 mt-1 min-h-[120px] resize-none transition-colors"
                                    placeholder="¿Qué se habló con el contacto?"
                                    value={formInt.data.comentario}
                                    onChange={e => formInt.setData('comentario', e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formInt.processing}
                                className="w-full bg-[#c1f75e] text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-[#c1f75e]/10 active:scale-[0.98]"
                            >
                                {formInt.processing ? 'Guardando...' : 'Confirmar y Guardar Bitácora'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Experiencia Laboral */}
            {isExpModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
                        <button
                            onClick={() => setIsExpModalOpen(false)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                            <Plus className="text-[#c1f75e]" /> Nuevo Registro Laboral
                        </h2>
                        <form onSubmit={submitExperiencia} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Empresa / División</label>
                                <select
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-sm focus:border-[#c1f75e] focus:ring-0 mt-1"
                                    value={formExp.data.division_id}
                                    onChange={e => formExp.setData('division_id', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar división...</option>
                                    {divisiones?.map(div => (
                                        <option key={div.id} value={div.id}>{div.empresa.nombre} - {div.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Cargo</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-sm focus:border-[#c1f75e] focus:ring-0 mt-1"
                                    value={formExp.data.cargo}
                                    onChange={e => formExp.setData('cargo', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Inicio</label>
                                    <input type="date" className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[10px] focus:border-[#c1f75e] focus:ring-0 mt-1" value={formExp.data.fecha_inicio} onChange={e => formExp.setData('fecha_inicio', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Fin</label>
                                    <input type="date" disabled={formExp.data.estado_actual} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white text-[10px] focus:border-[#c1f75e] focus:ring-0 mt-1 disabled:opacity-20" value={formExp.data.fecha_fin || ''} onChange={e => formExp.setData('fecha_fin', e.target.value)} />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-800 dark:bg-black text-[#c1f75e] focus:ring-0" checked={formExp.data.estado_actual} onChange={e => formExp.setData('estado_actual', e.target.checked)} />
                                <span className="text-xs font-bold text-gray-400 uppercase italic">Es mi cargo actual</span>
                            </label>
                            <button type="submit" disabled={formExp.processing} className="w-full bg-[#c1f75e] text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-90 transition-all shadow-lg">
                                {formExp.processing ? 'Guardando...' : 'Confirmar Registro'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}