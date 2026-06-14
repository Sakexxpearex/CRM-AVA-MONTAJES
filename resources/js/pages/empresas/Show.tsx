import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Building2, Hash, Tag, ChevronLeft, Layers, Plus, Edit3, Trash2, Users, Briefcase, ExternalLink } from 'lucide-react';
import { useState, useMemo } from 'react';

// Componentes de pagina
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

// Componentes especificos de empresa
import EmpresaModal from '@/components/empresas/EmpresaModal';
import DivisionModal from '@/components/empresas/DivisionModal';
import { formatRut } from '@/utils/formatters';

interface InfoItemProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string | number | null | undefined;
}

export default function EmpresaShow({ empresa, divisiones, contactos }: any) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDivisionModalOpen, setIsDivisionModalOpen] = useState(false);
    const [editingDivision, setEditingDivision] = useState<any>(null);
    const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);

    const { data: empData, setData: setEmpData, put: putEmpresa, processing: processingEmp, errors: errorsEmp } = useForm({
        nombre: empresa.nombre || '',
        rut: empresa.rut || '',
        tipo: empresa.tipo || '',
        alias: empresa.alias || '',
    });

    const { data: divData, setData: setDivData, post: postDivision, put: putDivision, processing: processingDiv, errors: errorsDiv, reset: resetDiv } = useForm({
        nombre: '',
        alias: '',
        empresa_id: empresa.id,
    });

    const filteredContactos = useMemo(() => {
        if (!selectedDivisionId) return contactos;
        return contactos.filter((c: any) =>
            c.divisiones?.some((d: any) => d.id === selectedDivisionId)
        );
    }, [selectedDivisionId, contactos]);

    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmpData('rut', formatRut(e.target.value));
    };

    const submitUpdateEmpresa = (e: React.FormEvent) => {
        e.preventDefault();
        putEmpresa(route('empresas.update', empresa.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const submitDivision = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingDivision) {
            putDivision(route('divisiones.update', editingDivision.id), {
                onSuccess: () => {
                    setIsDivisionModalOpen(false);
                    setEditingDivision(null);
                    resetDiv();
                },
            });
        } else {
            postDivision(route('divisiones.store'), {
                onSuccess: () => {
                    setIsDivisionModalOpen(false);
                    resetDiv();
                },
            });
        }
    };

    const deleteDivision = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar esta división?')) {
            router.delete(route('divisiones.destroy', id));
        }
    };

    const handleEditDivision = (e: React.MouseEvent, div: any) => {
        e.stopPropagation();
        setEditingDivision(div);

        setDivData({
            nombre: div.nombre,
            alias: div.alias || '',
            empresa_id: empresa.id,
        });

        setIsDivisionModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${empresa.nombre} - AVA`} />

            <PageContainer>
                {/* Navegación */}
                <Link
                    href={route('empresas.index')}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#c1f75e] transition-colors text-[10px] font-black uppercase tracking-widest w-fit mb-2"
                >
                    <ChevronLeft size={14} strokeWidth={3} /> Volver al Directorio
                </Link>

                {/* Header */}
                <PageHeader
                    title={empresa.nombre}
                    icon={Building2}
                    actionLabel="Editar Empresa"
                    onActionClick={() => setIsEditModalOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Información básica */}
                    <div className="lg:col-span-4 space-y-6">
                        <ContentPanel title="Identificación Comercial">
                            <div className="space-y-4">
                                <InfoItem
                                    icon={Hash}
                                    label="RUT Institucional"
                                    value={formatRut(empresa.rut)}
                                />
                                <InfoItem
                                    icon={Tag}
                                    label="Alias / Nombre Corto"
                                    value={empresa.alias || 'No definido'}
                                />
                            </div>
                        </ContentPanel>

                        {/* Tipo de empresa */}
                        <div className="p-6 rounded-2xl bg-[#c1f75e] text-black shadow-lg shadow-[#c1f75e]/10">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Categoría de Entidad</p>
                            <h2 className="text-xl font-black uppercase italic">{empresa.tipo}</h2>
                        </div>
                    </div>

                    {/* Divisiones y gestión */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Divisiones (clientes) */}
                        {empresa.tipo === 'Cliente' && (
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Layers size={18} className="text-[#c1f75e]" />
                                        <h3 className="text-xs font-black uppercase tracking-widest dark:text-white">Divisiones / Unidades</h3>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingDivision(null);
                                            resetDiv();
                                            setIsDivisionModalOpen(true);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-gray-800 rounded-lg text-[10px] font-black uppercase text-[#c1f75e] hover:bg-[#c1f75e]/10 transition-all"
                                    >
                                        <Plus size={14} /> Nueva División
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {divisiones.map((div: any) => (
                                        <div
                                            key={div.id}
                                            onClick={() => setSelectedDivisionId(selectedDivisionId === div.id ? null : div.id)}
                                            className={`p-4 border rounded-xl cursor-pointer transition-all group ${
                                                selectedDivisionId === div.id ? 'border-[#c1f75e] bg-[#c1f75e]/5' : 'border-gray-800 hover:border-gray-700'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-bold dark:text-white uppercase">{div.nombre}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium">{div.personas_count || 0} Personas</p>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => handleEditDivision(e, div)} className="p-1 hover:text-[#c1f75e]"><Edit3 size={14} /></button>
                                                    <button onClick={(e) => deleteDivision(e, div.id)} className="p-1 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Contactos asociados (Convertidos a Tarjetas) */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Users size={18} className="text-[#c1f75e]" />
                                <h3 className="text-xs font-black uppercase tracking-widest dark:text-white">
                                    Personal Clave {selectedDivisionId && <span className="text-[#c1f75e] lowercase text-[10px] opacity-60">(Filtrado)</span>}
                                </h3>
                            </div>

                            {filteredContactos.length === 0 ? (
                                <div className="p-8 text-center border border-dashed border-gray-800 rounded-2xl text-gray-500 text-xs uppercase font-medium">
                                    No hay personal clave asociado a esta selección
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredContactos.map((c: any) => (
                                        <div 
                                            key={c.id} 
                                            className="p-4 border border-gray-800 dark:bg-black/10 rounded-xl transition-all hover:border-gray-700 group flex flex-col justify-between"
                                        >
                                            <div>
                                                {/* Nombre */}
                                                <h4 className="text-xs font-black dark:text-gray-200 uppercase tracking-wide">
                                                    {c.nombre_1} {c.apellido_1}
                                                </h4>
                                                
                                                {/* Metadata del Contacto */}
                                                <div className="mt-3 space-y-1.5">
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-medium">
                                                        <Layers size={12} className="text-[#c1f75e]/70" />
                                                        <span>División: {c.divisiones?.[0]?.nombre || '---'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-medium italic">
                                                        <Briefcase size={12} className="text-[#c1f75e]/70" />
                                                        <span>Cargo: {c.divisiones?.[0]?.pivot?.cargo || '---'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Acción */}
                                            <div className="mt-4 pt-3 border-t border-gray-900 flex justify-end">
                                                <Link 
                                                    href={route('personas.show', c.id)} 
                                                    className="inline-flex items-center gap-1 text-[#c1f75e] opacity-80 group-hover:opacity-100 transition-all font-black text-[9px] uppercase tracking-wider"
                                                >
                                                    Ver Ficha <ExternalLink size={10} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                <EmpresaModal
                    isOpen={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); setEditingDivision(null); resetDiv() }}
                    data={empData}
                    setData={setEmpData}
                    submit={submitUpdateEmpresa}
                    processing={processingEmp}
                    errors={errorsEmp}
                    editingId={empresa.id}
                    handleRutChange={handleRutChange}
                />

                <DivisionModal
                    isOpen={isDivisionModalOpen}
                    onClose={() => {
                        setIsDivisionModalOpen(false);
                        setEditingDivision(null);
                        resetDiv();
                    }}
                    data={divData}
                    setData={setDivData}
                    submit={submitDivision}
                    processing={processingDiv}
                    errors={errorsDiv}
                    empresas={[empresa]}
                    hideEmpresaSelect={true}
                    editingId={editingDivision?.id}
                />
            </PageContainer>
        </AuthenticatedLayout>
    );
}

// Componente auxiliar para ítems de información
function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
    if (!value) return null;
    return (
        <div className="flex gap-3 items-start">
            <div className="mt-1 text-[#c1f75e]"><Icon size={16} /></div>
            <div>
                <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{label}</p>
                <p className="text-xs font-bold dark:text-white uppercase">{value}</p>
            </div>
        </div>
    );
}