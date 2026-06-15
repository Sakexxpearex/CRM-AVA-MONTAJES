import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ClipboardCheck, ArrowLeft, Check, Edit3, X, Wallet, Building2, User, MessageSquare, Send, CornerDownRight } from 'lucide-react';

import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';

interface Props {
    precalificacion: any;
    empresas: any[];
    divisiones: any[];
    personas: any[];
}

export default function Show({ precalificacion, empresas, divisiones, personas }: Props) {
    const [isEditing, setIsEditing] = useState(false);

    // Formulario para Notas/Bitácora
    const noteForm = useForm({
        comentario: '',
    });

    // Formulario de Edición de datos básicos
    const editForm = useForm({
        nombre_precalificacion: precalificacion.nombre_precalificacion || '',
        empresa_id: String(precalificacion.empresa_id || ''),
        division_id: String(precalificacion.division_id || ''),
        persona_id: String(precalificacion.persona_id || ''),
        monto_estimado: precalificacion.monto_estimado || '',
        resumen_visita: precalificacion.resumen_visita || precalificacion.descripcion || '',
    });

    // Sincronizar selectores dinámicos de empresa del formulario de edición
    const divisionesFiltradas = editForm.data.empresa_id
        ? divisiones.filter((d) => String(d.empresa_id) === String(editForm.data.empresa_id))
        : [];

    const personasFiltradas = editForm.data.empresa_id
    ? personas.filter((p) => {
        // Opción 1: Validar si la división directa de la persona pertenece a la empresa
        const divisionDirecta = divisiones.find(d => String(d.id) === String(p.division_id));
        if (divisionDirecta && String(divisionDirecta.empresa_id) === String(editForm.data.empresa_id)) {
            return true;
        }
        
        // Opción 2: Validar a través de su relación de trabajoActual (mapeado como trabajo_actual por Laravel)
        const idEmpresaDePersona = p.trabajo_actual?.division?.empresa_id;
        return String(idEmpresaDePersona) === String(editForm.data.empresa_id);
    })
    : [];

    const handleCambioEstado = (nuevoEstado: 'Aprobada' | 'Rechazada') => {
        if (confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) {
            router.patch(route('precalificaciones.estado', precalificacion.id), {
                estado: nuevoEstado
            });
        }
    };

    const handleSaveBitacora = (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteForm.data.comentario.trim()) return;

        noteForm.post(route('precalificaciones.interacciones.store', precalificacion.id), {
            preserveScroll: true,
            onSuccess: () => noteForm.reset('comentario')
        });
    };

    const handleUpdatePropuesta = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('precalificaciones.update', precalificacion.id), {
            onSuccess: () => setIsEditing(false)
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Evaluación - ${precalificacion.nombre_precalificacion}`} />

            <PageContainer>
                {/* Header de navegación con botón para regresar */}
                <div className="mb-4">
                    <Link 
                        href={route('precalificaciones.index')} 
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} /> Volver a la lista
                    </Link>
                </div>

                <PageHeader
                    title={precalificacion.nombre_precalificacion}
                    subtitle={`Código de Precalificación #${precalificacion.id} — Estado actual: ${precalificacion.estado}`}
                    icon={ClipboardCheck}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    
                    {/* COLUMNA IZQUIERDA: Detalles de la Oportunidad / Formulario de Edición (Ocupa 2 columnas) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm transition-all">
                            
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800/80 mb-6">
                                <h3 className="text-sm font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                                    {isEditing ? 'Modificar Parámetros Técnicos' : 'Especificaciones de la Propuesta'}
                                </h3>
                                {precalificacion.estado === 'Pendiente' && (
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-[#c1f75e] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-transparent dark:border-gray-800"
                                    >
                                        {isEditing ? <X size={12} /> : <Edit3 size={12} />}
                                        {isEditing ? 'Cancelar' : 'Editar Datos'}
                                    </button>
                                )}
                            </div>

                            {!isEditing ? (
                                /* MODO LECTURA */
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Cliente / Empresa</span>
                                            <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs px-3 py-2.5 text-gray-800 dark:text-gray-200 font-black uppercase tracking-wide flex items-center gap-1.5">
                                                <Building2 size={12} className="text-gray-400" />
                                                {precalificacion.empresa?.nombre || 'No especificada'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">División Receptora</span>
                                            <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs px-3 py-2.5 text-gray-800 dark:text-gray-200 font-black uppercase tracking-wide">
                                                {precalificacion.division?.nombre || 'No especificada'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Contacto Estratégico</span>
                                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                                                <User size={14} />
                                            </div>
                                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide">
                                                {precalificacion.persona ? `${precalificacion.persona.nombre_1} ${precalificacion.persona.apellido_1 || ''}` : 'Sin contacto asignado'}
                                            </span>
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
                                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest block">Minuta / Resumen de Visita</span>
                                        <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-xs p-4 text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                                            {precalificacion.resumen_visita || precalificacion.descripcion || 'Sin descripción técnica.'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* MODO EDICIÓN FORMULARIO ACTIVO */
                                <form onSubmit={handleUpdatePropuesta} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">Nombre Oportunidad / Proyecto</label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.data.nombre_precalificacion}
                                            onChange={(e) => editForm.setData('nombre_precalificacion', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:border-[#c1f75e] focus:ring-0 text-gray-900 dark:text-white rounded-md outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">Cliente / Empresa</label>
                                            <select
                                                required
                                                value={editForm.data.empresa_id}
                                                onChange={(e) => editForm.setData(old => ({ ...old, empresa_id: e.target.value, division_id: '', persona_id: '' }))}
                                                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white rounded-md outline-none"
                                            >
                                                {empresas.map((emp) => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">División Receptora</label>
                                            <select
                                                required
                                                value={editForm.data.division_id}
                                                onChange={(e) => editForm.setData('division_id', e.target.value)}
                                                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white rounded-md outline-none"
                                            >
                                                <option value="">Selecciona división...</option>
                                                {divisionesFiltradas.map((div) => <option key={div.id} value={div.id}>{div.nombre}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">Contacto Autorizado</label>
                                            <select
                                                value={editForm.data.persona_id}
                                                onChange={(e) => editForm.setData('persona_id', e.target.value)}
                                                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white rounded-md outline-none"
                                            >
                                                <option value="">Selecciona contacto...</option>
                                                {personasFiltradas.map((pers) => (
                                                    <option key={pers.id} value={pers.id}>{pers.nombre_1} {pers.apellido_1}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">Monto Estimado</label>
                                            <input
                                                type="number"
                                                value={editForm.data.monto_estimado}
                                                onChange={(e) => editForm.setData('monto_estimado', e.target.value)}
                                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-md outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">Minuta / Resumen de Visita</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={editForm.data.resumen_visita}
                                            onChange={(e) => editForm.setData('resumen_visita', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-md outline-none resize-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 font-bold rounded-md text-xs"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={editForm.processing}
                                            className="px-5 py-2 bg-[#c1f75e] text-black font-black rounded-md text-xs uppercase tracking-wider"
                                        >
                                            {editForm.processing ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Bloque de Decisiones de Aprobación */}
                        <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                            <span className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block mb-4">
                                Resolución de Viabilidad del Proyecto
                            </span>

                            {precalificacion.estado === 'Pendiente' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleCambioEstado('Rechazada')}
                                        className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
                                    >
                                        Rechazar Propuesta
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCambioEstado('Aprobada')}
                                        className="w-full bg-[#c1f75e] text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#a8e63a] transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <Check size={12} strokeWidth={3} />
                                        Aprobar y Registrar Proyecto
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 p-4 rounded-xl text-xs font-black uppercase text-gray-400 flex items-center gap-2 tracking-wider">
                                    <CornerDownRight size={14} className="text-[#c1f75e]" />
                                    <span>Flujo finalizado: La propuesta se encuentra</span> 
                                    <span className="text-white bg-gray-800 dark:bg-white/10 px-2.5 py-1 rounded-md">{precalificacion.estado}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Panel Lateral de Bitácora y Seguimiento */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col max-h-[600px]">
                            <h3 className="text-sm font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800/80 mb-4 shrink-0">
                                <MessageSquare size={16} className="text-[#c1f75e]" />
                                Bitácora de Notas
                            </h3>

                            {/* Listado de Interacciones históricas */}
                            <div className="flex-1 overflow-y-auto space-y-3 pr-1 style-scrollbar text-xs">
                                {precalificacion.interacciones && precalificacion.interacciones.length > 0 ? (
                                    precalificacion.interacciones.map((note: any) => (
                                        <div key={note.id} className="bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-gray-800/60 p-3 rounded-xl space-y-1">
                                            <div className="flex items-center justify-between text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase">
                                                <span>{note.user?.name || 'Sistema'}</span>
                                                <span>{new Date(note.created_at).toLocaleDateString('es-CL')}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 leading-normal">{note.comentario}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center italic text-gray-500 py-8 text-[10px] font-black uppercase tracking-wider">
                                        Sin anotaciones de terreno en la bitácora.
                                    </div>
                                )}
                            </div>

                            {/* Campo de envío de notas */}
                            <form onSubmit={handleSaveBitacora} className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                                <input
                                    type="text"
                                    value={noteForm.data.comentario}
                                    onChange={e => noteForm.setData('comentario', e.target.value)}
                                    placeholder="Registrar evento o nota..."
                                    className="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#c1f75e]"
                                />
                                <button 
                                    type="submit" 
                                    disabled={noteForm.processing}
                                    className="bg-gray-100 dark:bg-white/5 hover:bg-[#c1f75e] hover:text-black text-gray-400 p-2.5 rounded-xl transition-all border border-transparent dark:border-gray-800"
                                >
                                    <Send size={13} />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </PageContainer>
        </AuthenticatedLayout>
    );
}