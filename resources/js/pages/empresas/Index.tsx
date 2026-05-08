import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Factory, Plus, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

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

    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9kK]/g, "");
        if (value.length > 1) {
            const dv = value.slice(-1).toUpperCase();
            const digits = value.slice(0, -1);
            value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
        }
        setData('rut', value);
    };

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

    const submitDivision = (e: React.FormEvent) => {
        e.preventDefault();
        divisionForm.post(route('divisiones.store'), {
            onSuccess: () => {
                setIsDivisionModalOpen(false);
                divisionForm.reset();
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Esta seguro de eliminar este registro?')) {
            router.delete(route('empresas.destroy', id));
        }
    };

    const empresasFiltradas = empresas.filter(e => 
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || e.rut.includes(searchTerm)
    );

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
                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={() => setIsDivisionModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:text-[#c1f75e] hover:border-[#c1f75e]/30 transition-all"
                    >
                        <LayoutGrid size={14} /> Nueva División
                    </button>
                </div>

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

            <DivisionModal 
                isOpen={isDivisionModalOpen}
                onClose={() => setIsDivisionModalOpen(false)}
                data={divisionForm.data}
                setData={divisionForm.setData}
                submit={submitDivision}
                errors={divisionForm.errors}
                processing={divisionForm.processing}
                empresas={empresas} // Lista de mepresas para el select
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