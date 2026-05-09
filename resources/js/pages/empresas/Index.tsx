import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Factory, Plus, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { formatRut } from '@/utils/formatters';

// Componentes de pagina (para mantener todo igual)
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

// Componentes especificos de empresa
import EmpresaModal from '@/components/empresas/EmpresaModal';
import EmpresasTable from '@/components/empresas/EmpresaTable';
import SearchEmpresa from '@/components/empresas/SearchEmpresa';
import DivisionModal from '@/components/empresas/DivisionModal';
import { Empresa } from '@/types/empresa';


export default function EmpresasIndex({ empresas }: { empresas: Empresa[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDivisionModalOpen, setIsDivisionModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('rut', formatRut(e.target.value));
    };

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '', 
        rut: '', 
        tipo: 'Cliente' as any,
    });

    // Formulario de division
    const divisionForm = useForm({
        nombre: '',
        empresa_id: '',
    })

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        reset();
    };

    const openEditModal = (empresa: Empresa) => {
        setEditingId(empresa.id);
        setData({
            nombre: empresa.nombre,
            rut: empresa.rut,
            tipo: empresa.tipo,
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('empresas.update', editingId), { onSuccess: () => closeModal() });
        } else {
            post(route('empresas.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Esta seguro de eliminar este registro?')) {
            router.delete(route('empresas.destroy', id));
        }
    };

    const empresasFiltradas = empresas.filter(e => {
    const term = searchTerm.toLowerCase();
    const rutLimpio = e.rut.replace(/[^0-9kK]/g, "");
    const searchLimpio = searchTerm.replace(/[^0-9kK]/g, "");

    return (
        e.nombre.toLowerCase().includes(term) || 
        rutLimpio.includes(searchLimpio) ||
        formatRut(e.rut).includes(searchTerm) 
    );
});

    return (
        <AuthenticatedLayout>
            <Head title="Empresas - AVA CRM" />

            <PageContainer>
                {/* Header */}
                <PageHeader 
                    title="Empresas"
                    subtitle="Directorio de clientes y aliados estratégicos"
                    icon={Factory}
                    actionLabel="Nueva Empresa"
                    onActionClick={() => setIsModalOpen(true)}
                />

                {/* Buscador */}
                <div className="flex justify-start">
                    <SearchEmpresa value={searchTerm} onChange={setSearchTerm} />
                </div>

                {/* Tabla */}
                <ContentPanel padding={false}>
                    <EmpresasTable 
                        empresas={empresasFiltradas}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                </ContentPanel>
            </PageContainer>

            {/* Modales */}
            <EmpresaModal
                isOpen={isModalOpen}
                onClose={closeModal}
                data={data}
                setData={setData}
                submit={submit}
                errors={errors}
                processing={processing}
                editingId={editingId}
                handleRutChange={handleRutChange}
            />


           <button 
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-24 right-6 z-50 flex items-center justify-center bg-[#c1f75e] text-black w-10 h-10 rounded-full shadow-2xl active:scale-90 transition-transform"
            >
                <Plus size={16} strokeWidth={3} />
            </button>
        </AuthenticatedLayout>
    );
}