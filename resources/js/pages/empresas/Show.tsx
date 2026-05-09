import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router, Link} from '@inertiajs/react';
import { Building2, MapPin, Globe, Phone, Mail, Plus, Edit3, Trash2, Users, Layers, Hash, Tag,ChevronLeft, } from 'lucide-react';
import { useState, useMemo } from 'react';

// Componentes de pagina (para mantener todo igual)
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

// Componentes especificos de empresa
import EmpresaModal from '@/components/empresas/EmpresaModal';
import DivisionModal from '@/components/empresas/DivisionModal';
import { formatRut } from '@/utils/formatters';

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

    const { data: divData, setData: setDivData, post: postDivision, processing: processingDiv, errors: errorsDiv, reset: resetDiv } = useForm({
        nombre: '',
        alias: '',
        empresa_id: empresa.id,
    });

    const filteredContactos = useMemo(() => {
        if (!selectedDivisionId) return contactos;
        return contactos.filter((c: any) => 
            c.divisiones.some((d: any) => d.id === selectedDivisionId)
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
        // Actualizar
        router.put(route('divisiones.update', editingDivision.id), divData, {
            onSuccess: () => {
                setIsDivisionModalOpen(false);
                setEditingDivision(null);
                resetDiv();
            },
        });
    } else {
        // Crear
        postDivision(route('divisiones.store'), {
            onSuccess: () => {
                setIsDivisionModalOpen(false);
                resetDiv();
            },
        });
    }
};

    const deleteDivision = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Evita que se active el filtro al querer borrar
        if (confirm('¿Estás seguro de eliminar esta división?')) {
            router.delete(route('divisiones.destroy', id));
        }
    };

    const handleEditDivision = (e: React.MouseEvent, div: any) => {
    e.stopPropagation(); 
    setEditingDivision(div);
    
    // Cargamos los datos de la división en el formulario
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
                    
                    {/* Información basica */}
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
                                        onClick={() => setIsDivisionModalOpen(true)}
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
                                                    <button onClick={(e) => handleEditDivision(e,div.id)} className="p-1 hover:text-[#c1f75e]"><Edit3 size={14} /></button>
                                                    <button onClick={(e) => deleteDivision(e, div.id)} className="p-1 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Contactos asociados */}
                        <section>
                        <div className="flex items-center gap-2 mb-4">
                                <Users size={18} className="text-[#c1f75e]" />
                                <h3 className="text-xs font-black uppercase tracking-widest dark:text-white">
                                    Personal Clave {selectedDivisionId && <span className="text-[#c1f75e] lowercase text-[10px] opacity-60">(Filtrado)</span>}
                                </h3>
                            </div>
                            <ContentPanel padding={false}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-black/20 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                                            <tr>
                                                <th className="px-6 py-3">Nombre</th>
                                                <th className="px-6 py-3">División</th>
                                                <th className="px-6 py-3">Cargo</th>
                                                <th className="px-6 py-3 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {filteredContactos.map((c: any) => (
                                                <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4 text-xs font-bold dark:text-gray-200 uppercase">{c.nombre_1} {c.apellido_1}</td>
                                                    <td className="px-6 py-4 text-[10px] text-gray-500 uppercase">{c.divisiones?.[0]?.nombre || '---'}</td>
                                                    <td className="px-6 py-4 text-[10px] text-gray-500 uppercase italic">{c.divisiones?.[0]?.pivot?.cargo || '---'}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={route('personas.show', c.id)} className="text-[#c1f75e] opacity-0 group-hover:opacity-100 transition-all font-black text-[9px] uppercase">Ver Ficha</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </ContentPanel>
                        </section>
                    </div>
                </div>

                <EmpresaModal 
                    isOpen={isEditModalOpen}
                    onClose={() => {setIsEditModalOpen(false);setEditingDivision(null);resetDiv()}}
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
                    onClose={() => setIsDivisionModalOpen(false)}
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
function InfoItem({ icon: Icon, label, value }: any) {
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