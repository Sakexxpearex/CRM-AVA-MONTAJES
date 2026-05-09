import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    ChevronLeft, Mail, Phone, Building2, Briefcase,
    MessageSquare, Plus, X, User, Hash, Linkedin, Edit3
} from 'lucide-react';

import React from 'react';

import { formatDate, formatRut } from '@/utils/formatters';
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';
import PersonaModal from '@/components/personas/PersonaModal';

export default function PersonaShow({ persona, divisiones, licitaciones }: any) {
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [isInteraccionModalOpen, setIsInteraccionModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    // Formularios
    const formExp = useForm({ persona_id: persona.id, division_id: '', cargo: '', fecha_inicio: '', fecha_fin: '', estado_actual: false as boolean });
    const formInt = useForm({ persona_id: persona.id, tipo_contacto: '', fecha: new Date().toISOString().split('T')[0], comentario: '', licitacion_id: '' });

    // Formulario de edición (Perfil Limitado)
    const formEdit = useForm({
        rut: persona.rut || '',
        nombre_1: persona.nombre_1 || '',
        nombre_2: persona.nombre_2 || '',
        apellido_1: persona.apellido_1 || '',
        apellido_2: persona.apellido_2 || '',
        email: persona.email || '',
        telefono: persona.telefono || '',
        perfil_linkedin: persona.perfil_linkedin || '',
        // No se usan en isLimited, pero se declaran por consistencia
        division_id: '',
        cargo_actual: '',
    });

    const getInitials = (n1: string, a1: string) => `${n1?.[0] || ''}${a1?.[0] || ''}`.toUpperCase();

    const submitExperiencia = (e: React.FormEvent) => {
        e.preventDefault();
        formExp.post(route('historial.store'), {
            onSuccess: () => { setIsExpModalOpen(false); formExp.reset(); },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        formEdit.patch(route('personas.update', persona.id), {
            onSuccess: () => setIsEditProfileModalOpen(false),
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
            <Head title={`${persona.nombre_1} ${persona.apellido_1} - Perfil AVA`} />

            <PageContainer>
                {/* Navegación */}
                <Link
                    href={route('personas.index')}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#c1f75e] transition-colors text-[10px] font-black uppercase tracking-widest w-fit mb-2"
                >
                    <ChevronLeft size={14} strokeWidth={3} /> Volver al Directorio
                </Link>

                {/* Header */}
                <PageHeader
                    title={`${persona.nombre_1} ${persona.apellido_1}`}
                    subtitle={`RUT: ${formatRut(persona.rut)} • Perfil de Contacto`}
                    icon={User}
                    actionLabel="Registrar Gestión"
                    onActionClick={() => setIsInteraccionModalOpen(true)}
                >
                    {/* Boton extra en el header para edicion */}
                    <button
                        onClick={() => setIsEditProfileModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-3 h-[44px] bg-white/5 border border-gray-800 rounded text-[10px] font-extrabold uppercase tracking-widest text-gray-400 hover:text-[#c1f75e] hover:border-[#c1f75e]/30 transition-all"
                    >
                        <Edit3 size={14} strokeWidth={3} className="shrink-0" />
                        <span className="leading-none">Editar Perfil</span>
                    </button>
                </PageHeader>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/*  Perfil y trayectoria */}
                    <div className="lg:col-span-8 space-y-8">
                        <ContentPanel>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-28 h-28 bg-gray-900 text-[#c1f75e] rounded-2xl flex items-center justify-center text-4xl font-black border border-gray-800 shadow-xl shrink-0 italic">
                                    {getInitials(persona.nombre_1, persona.apellido_1)}
                                </div>
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white leading-tight">
                                            {persona.nombre_1} {persona.nombre_2} {persona.apellido_1} {persona.apellido_2}
                                        </h2>
                                        <p className="text-[#c1f75e] text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">
                                            {persona.trabajo_actual?.cargo || 'Sin cargo definido'}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                        <a href={`mailto:${persona.email}`} className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-lg text-[11px] font-bold border border-transparent hover:border-[#c1f75e]/30 transition-all">
                                            <Mail size={14} className="text-[#c1f75e]" /> {persona.email || 'Sin Email'}
                                        </a>
                                        {persona.perfil_linkedin && (
                                            <a href={persona.perfil_linkedin} target="_blank" className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-lg text-[11px] font-bold border border-transparent hover:border-[#c1f75e]/30 transition-all">
                                                <Linkedin size={14} className="text-[#c1f75e]" /> LinkedIn
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ContentPanel>

                        <ContentPanel>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <Briefcase size={14} className="text-[#c1f75e]" /> Trayectoria Laboral
                                </h3>
                                <button onClick={() => setIsExpModalOpen(true)} className="p-2 bg-[#c1f75e]/10 text-[#c1f75e] rounded-lg hover:bg-[#c1f75e] hover:text-black transition-all">
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
                                {persona.historial_laboral?.length > 0 ? (
                                    persona.historial_laboral.map((empleo: any, idx: number) => (
                                        <div key={idx} className="relative pl-14">
                                            <div className={`absolute left-0 top-0 w-9 h-9 rounded flex items-center justify-center border-4 border-white dark:border-[#111] z-10 ${empleo.estado_actual ? 'bg-[#c1f75e] text-black shadow-lg shadow-[#c1f75e]/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                                <Building2 size={16} />
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-black text-sm uppercase text-gray-900 dark:text-white leading-none">{empleo.cargo}</h4>
                                                    <p className="text-[11px] text-gray-500 font-bold uppercase mt-1">{empleo.division?.empresa?.nombre}</p>
                                                </div>
                                                <span className="text-[9px] font-black uppercase bg-gray-50 dark:bg-white/5 px-2 py-1 rounded text-gray-500 h-fit">
                                                    {formatDate(empleo.fecha_inicio)} — {empleo.estado_actual ? 'PRESENTE' : formatDate(empleo.fecha_fin)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-gray-500 uppercase font-black pl-10 italic">Sin historial registrado</p>
                                )}
                            </div>
                        </ContentPanel>
                    </div>

                    {/* Bitácora y stats */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-[#c1f75e] rounded-2xl p-6 text-black shadow-lg shadow-[#c1f75e]/10">
                            <h4 className="text-[9px] font-black uppercase tracking-widest mb-4 opacity-70 italic">Actividad CRM</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-3xl font-black tracking-tighter">{persona.interacciones?.length || 0}</p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest">Gestiones</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black tracking-tighter">{persona.historial_laboral?.length || 0}</p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest">Empresas</p>
                                </div>
                            </div>
                        </div>

                        <ContentPanel>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <MessageSquare size={14} className="text-[#c1f75e]" /> Bitácora
                                </h3>
                                <Link href={route('personas.interacciones', persona.id)} className="text-[9px] font-black uppercase text-[#c1f75e] hover:underline">
                                    Ver Todo
                                </Link>
                            </div>

                            <div className="space-y-6">
                                {persona.interacciones?.length > 0 ? (
                                    persona.interacciones.slice(0, 3).map((int: any, idx: number) => (
                                        <div key={idx} className="relative pl-6 border-l border-gray-200 dark:border-gray-800 space-y-1">
                                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#c1f75e] shadow-[0_0_8px_#c1f75e]"></div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-black uppercase text-[#c1f75e]">{int.tipo_contacto}</span>
                                                <span className="text-[9px] font-mono text-gray-500">{formatDate(int.fecha)}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-snug line-clamp-2">
                                                "{int.comentario}"
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-4 text-[9px] font-black text-gray-500 uppercase italic">Sin gestiones</p>
                                )}
                            </div>
                        </ContentPanel>
                    </div>
                </div>

                {/* Modales */}
                <PersonaModal
                    isOpen={isEditProfileModalOpen}
                    onClose={() => setIsEditProfileModalOpen(false)}
                    data={formEdit.data}
                    setData={formEdit.setData}
                    submit={submitEdit}
                    processing={formEdit.processing}
                    errors={formEdit.errors}
                    divisiones={divisiones}
                    editingId={persona.id}
                    isLimited={true}
                />

                {isInteraccionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-2xl p-10 relative shadow-2xl">
                            <button onClick={() => setIsInteraccionModalOpen(false)} className="absolute right-8 top-8 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <MessageSquare className="text-[#c1f75e]" size={28} /> Nueva Gestión
                            </h2>
                            <form onSubmit={submitInteraccion} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Canal de Contacto</label>
                                        {/* CAMBIO AQUÍ: text-gray-900 dark:text-white */}
                                        <select className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-4 text-gray-900 dark:text-white focus:ring-[#c1f75e]" value={formInt.data.tipo_contacto} onChange={e => formInt.setData('tipo_contacto', e.target.value)} required>
                                            <option value="">Seleccionar...</option>
                                            <option value="Reunión Presencial">Reunión Presencial</option>
                                            <option value="Llamada">Llamada</option>
                                            <option value="Correo">Correo</option>
                                            <option value="WhatsApp">WhatsApp</option>
                                            <option value="WhatsApp">Nota</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Fecha</label>
                                        {/* CAMBIO AQUÍ: text-gray-900 dark:text-white */}
                                        <input type="date" className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-4 text-gray-900 dark:text-white focus:ring-[#c1f75e]" value={formInt.data.fecha} onChange={e => formInt.setData('fecha', e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Licitación Asociada</label>
                                    {/* CAMBIO AQUÍ: text-gray-900 dark:text-white */}
                                    <select className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-4 text-gray-900 dark:text-white focus:ring-[#c1f75e]" value={formInt.data.licitacion_id} onChange={e => formInt.setData('licitacion_id', e.target.value)}>
                                        <option value="">Sin licitación</option>
                                        {licitaciones?.map((lic: any) => <option key={lic.id} value={lic.id}>{lic.nombre_proyecto || lic.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Resumen de lo conversado</label>
                                    <textarea className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-4 text-gray-900 dark:text-white focus:ring-[#c1f75e] min-h-[120px]" value={formInt.data.comentario} onChange={e => formInt.setData('comentario', e.target.value)} required />
                                </div>
                                <button type="submit" disabled={formInt.processing} className="w-full bg-[#c1f75e] text-black py-5 rounded-lg font-black text-sm uppercase tracking-widest shadow-xl shadow-[#c1f75e]/10 hover:bg-[#a8e63a] transition-colors">Guardar en Historial</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal cambio division/cargo */}
                {isExpModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
                            <button onClick={() => setIsExpModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-white"><X size={20} /></button>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <Plus className="text-[#c1f75e]" size={24} /> Registrar Nuevo Cargo
                            </h2>
                            <form onSubmit={submitExperiencia} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Empresa / División</label>
                                    <select className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 text-white focus:ring-[#c1f75e]" value={formExp.data.division_id} onChange={e => formExp.setData('division_id', e.target.value)} required>
                                        <option value="">Seleccionar...</option>
                                        {divisiones?.map((div: any) => <option key={div.id} value={div.id}>{div.empresa.nombre} — {div.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Nombre del Cargo</label>
                                    <input type="text" className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 text-white focus:ring-[#c1f75e]" value={formExp.data.cargo} onChange={e => formExp.setData('cargo', e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><label className="text-[9px] font-black uppercase text-gray-500">Fecha Inicio</label><input type="date" className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 text-white focus:ring-[#c1f75e]" value={formExp.data.fecha_inicio} onChange={e => formExp.setData('fecha_inicio', e.target.value)} required /></div>
                                    <div className="space-y-2"><label className="text-[9px] font-black uppercase text-gray-500">Fecha Fin</label><input type="date" disabled={formExp.data.estado_actual} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 text-white disabled:opacity-20" value={formExp.data.fecha_fin || ''} onChange={e => formExp.setData('fecha_fin', e.target.value)} /></div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer py-2">
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-700 bg-black text-[#c1f75e] focus:ring-[#c1f75e]" checked={formExp.data.estado_actual} onChange={e => formExp.setData('estado_actual', e.target.checked)} />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase italic">Es el cargo actual</span>
                                </label>
                                <button type="submit" disabled={formExp.processing} className="w-full bg-[#c1f75e] text-black py-4 rounded-lg font-black text-xs uppercase shadow-xl shadow-[#c1f75e]/10">Confirmar Registro</button>
                            </form>
                        </div>
                    </div>
                )}

            </PageContainer>
        </AuthenticatedLayout>
    );
}