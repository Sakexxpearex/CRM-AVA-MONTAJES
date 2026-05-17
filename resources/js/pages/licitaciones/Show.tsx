import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, Building2, MessageSquare, 
    Clock, FileText, User, ArrowRight,
    Zap, Edit3, TrendingUp,CheckCircle
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';

// Componentes de pagina (para mantener todo igual)
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

// Componentes especificos para el detalle de licitaciones
import EstadoBadge from '@/components/licitaciones/EstadoBadge';
import LicitacionEditModal from '@/components/licitaciones/LicitacionEditModal';
import PipelineModal from '@/components/licitaciones/PipelineModal';

export default function Show({ licitacion, empresasCompetencia, empresas, divisiones}: any) {
    if (!licitacion) {
        return <div className="p-10 text-white font-black uppercase tracking-widest text-center">Cargando datos...</div>;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        centro_costo: '',
    });

    const formatMoney = (val: any) => {
        const num = parseFloat(val);
        return isNaN(num) ? '$ 0' : new Intl.NumberFormat('es-CL', { 
            style: 'currency', currency: 'CLP', maximumFractionDigits: 0 
        }).format(num);
    };

    const contactosAsociados = licitacion.division?.personas || [];

    const onSubmitAdjudicar = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('licitaciones.adjudicar', licitacion.id), {
            onSuccess: () => setIsModalOpen(false),
        });
    };


    //estado pipeline
    interface Props {
    licitacion: any;
    empresasCompetencia: any[]; 
    }

    const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false)
    return (
        <AuthenticatedLayout>
            <Head title={`Licitación: ${licitacion.nombre_proyecto || 'Detalle'}`} />

            <PageContainer>
                {/* Navegacion */}
                <Link 
                    href={route('licitaciones.index')}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-[#c1f75e] transition-colors w-fit tracking-widest mb-2"
                >
                    <ChevronLeft size={14} strokeWidth={3} /> Volver al Pipeline
                </Link>

                {/* Header */}
                <PageHeader 
                    title={licitacion.nombre_proyecto || "Sin Nombre"}
                    icon={FileText}
                    // Gestionar el flujo comercial
                    actionLabel="Gestionar Pipeline"
                    onActionClick={() => setIsPipelineModalOpen(true)}
                >
                    {/* Editar datos técnicos/básicos */}
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-gray-800 rounded text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#c1f75e] hover:border-[#c1f75e]/30 transition-all h-[44px]"
                    >
                        <Edit3 size={14} strokeWidth={3} />
                        <span>Editar Ficha</span>
                    </button>
                </PageHeader>

                {/* Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ContentPanel className="lg:col-span-2">
                        <div className="space-y-4">
                            <EstadoBadge estado={licitacion.estado_pipeline} />
                            
                            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-4">
                                <div className="flex items-center gap-2">
                                    <Building2 className="text-[#c1f75e]" size={16} />
                                    <div className="flex flex-col">
                                        <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Empresa Cliente</span>
                                        <span className="text-[11px] font-bold uppercase dark:text-gray-200">{licitacion.empresa?.nombre || 'No asignada'}</span>
                                    </div>
                                </div>
                                <div className="hidden md:block w-[1px] h-6 bg-gray-800/50"></div>
                                <div className="flex items-center gap-2">
                                    <User className="text-[#c1f75e]" size={16} />
                                    <div className="flex flex-col">
                                        <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">División / Área</span>
                                        <span className="text-[11px] font-bold uppercase dark:text-gray-200">{licitacion.division?.nombre || 'General'}</span>
                                    </div>
                                </div>
                                {licitacion.proyecto_id && (
                                     <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase rounded">
                                        <Zap size={12} /> Contrato en Ejecución
                                    </div>
                                )}
                            </div>
                        </div>
                    </ContentPanel>

                    {/* Monto */}
                    <div className="bg-[#c1f75e] p-7 rounded-2xl flex flex-col justify-center shadow-lg shadow-[#c1f75e]/10 text-black">
                        <p className="text-[8px] font-black uppercase opacity-60 tracking-[0.2em] mb-1">Presupuesto Referencial</p>
                        <h2 className="text-2xl font-black font-mono tracking-tight leading-none">
                            {formatMoney(licitacion.monto_estimado)}
                        </h2>
                        <div className="mt-4 pt-3 border-t border-black/10 flex items-center gap-2 font-black text-[8px] uppercase opacity-70 tracking-widest">
                            <Clock size={12} /> Cierre: {licitacion.fecha_cierre || 'Pendiente'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    <div className="lg:col-span-8 space-y-6">
                        <ContentPanel>
                            <h3 className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4 flex items-center gap-2">
                                <FileText size={14} className="text-[#c1f75e]" /> Alcance Técnico
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed italic">
                                {licitacion.descripcion || 'Sin descripción técnica registrada.'}
                            </p>
                        </ContentPanel>

                        {/* Bitacora */}
                        <ContentPanel>
                            <h3 className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em] mb-8 flex items-center gap-2">
                                <MessageSquare size={14} className="text-[#c1f75e]" /> Bitácora Comercial
                            </h3>
                            <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-800">
                                {licitacion.interacciones?.length > 0 ? (
                                    licitacion.interacciones.map((int: any) => (
                                        <div key={int.id} className="relative pl-10">
                                            <div className="absolute left-0 top-1 w-8 h-8 bg-black border-2 border-[#c1f75e] rounded flex items-center justify-center z-10 text-[#c1f75e]">
                                                <Clock size={12} />
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[9px] font-black text-[#c1f75e] uppercase tracking-tighter">{int.tipo_contacto}</span>
                                                    <span className="text-[9px] text-gray-500 font-mono">{formatDate(int.fecha)}</span>
                                                </div>
                                                <p className="text-[12px] text-gray-300 italic mb-3 leading-snug">"{int.comentario}"</p>
                                                <div className="flex items-center gap-2 text-[8px] font-black text-gray-500 uppercase pt-3 border-t border-gray-800/50">
                                                    <User size={10} /> {int.user?.name} 
                                                    <ArrowRight size={10} className="text-[#c1f75e]" /> 
                                                    <span className="text-gray-400">{int.persona?.nombre_1} {int.persona?.apellido_1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-30 italic text-[10px] uppercase font-black tracking-widest border border-dashed border-gray-800 rounded-xl">
                                        Sin gestiones comerciales registradas
                                    </div>
                                )}
                            </div>
                        </ContentPanel>
                    </div>

                    {/* Contactos */}
                    <div className="lg:col-span-4">
                        <ContentPanel>
                            <h3 className="text-[9px] font-black uppercase text-[#c1f75e] mb-6 tracking-[0.2em]">Contactos Asociados</h3>
                            <div className="space-y-3">
                                {contactosAsociados.length > 0 ? (
                                    contactosAsociados.map((p: any) => (
                                        <Link 
                                            key={p.id} 
                                            href={route('personas.show', p.id)} 
                                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-gray-800 hover:border-[#c1f75e]/50 transition-all group"
                                        >
                                            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-[#c1f75e] font-black text-[10px] border border-gray-800">
                                                {p.nombre_1?.[0]}{p.apellido_1?.[0]}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[11px] font-black text-white uppercase truncate group-hover:text-[#c1f75e] transition-colors">
                                                    {p.nombre_1} {p.apellido_1}
                                                </p>
                                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Ver Perfil</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-center text-[9px] text-gray-600 uppercase font-black py-4 italic border border-dashed border-gray-800 rounded-xl">Sin contactos vinculados</p>
                                )}
                            </div>
                        </ContentPanel>
                    </div>
                </div>
            </PageContainer>

            {/* Modal de adjudicacion*/}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-3">
                            <CheckCircle className="text-[#c1f75e]" size={24} /> Adjudicar Proyecto
                        </h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                            Esta acción moverá la licitación a la etapa de ejecución operativa.
                        </p>

                        <form onSubmit={onSubmitAdjudicar} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-1 tracking-widest">
                                    Centro de Costo Requerido
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Ej: CC-2026-001"
                                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 text-white focus:ring-[#c1f75e] focus:border-[#c1f75e] font-mono"
                                    value={data.centro_costo}
                                    onChange={e => setData('centro_costo', e.target.value.toUpperCase())}
                                    required
                                    autoFocus
                                />
                                {errors.centro_costo && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.centro_costo}</p>}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex-[2] bg-[#c1f75e] text-black py-3 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-[#c1f75e]/10 hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Procesando...' : 'Confirmar y Crear Proyecto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <PipelineModal 
                isOpen={isPipelineModalOpen}
                onClose={() => setIsPipelineModalOpen(false)}
                licitacion={licitacion}
                empresasCompetencia={empresasCompetencia || []}
            />

            <LicitacionEditModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                licitacion={licitacion}
                empresas={empresas} 
                divisiones={divisiones}
            />
        </AuthenticatedLayout>
    );
}