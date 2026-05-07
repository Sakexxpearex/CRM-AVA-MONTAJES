import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

//Componentes 
import EmpresaModal from '@/components/empresas/EmpresaModal';
import EmpresasTable from '@/components/empresas/EmpresaTable';
import SearchEmpresa from '@/components/empresas/SearchEmpresa';
import EmpresasHeader from '@/components/empresas/EmpresaHeader';
import { Empresa } from '@/types/empresa'


export default function EmpresasIndex({ empresas }: { empresas: Empresa[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '', 
        rut: '', 
        tipo: 'Cliente' as any,
    });

    // Formateador de rut
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
            put(route('empresas.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('empresas.store'), { 
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Esta seguro de eliminar este registro?')) {
            router.delete(route('empresas.destroy', id));
        }
    };

    const empresasFiltradas = empresas.filter(e => 
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.rut.includes(searchTerm)
    );

    return (
        <AuthenticatedLayout>
            <Head title="Empresas - AVA CRM" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
                
                <EmpresasHeader onCreate={() => setIsModalOpen(true)} />

                {/* Buscador */}
                <SearchEmpresa
                value={searchTerm}
                onChange={setSearchTerm}
                />

            
            {/* Tabla */}
            <EmpresasTable 
                empresas={empresasFiltradas}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />
                        </div>

            {/* Modal de creación/actualización) */}
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
            {/* Boton mobile */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-24 right-6 z-50 flex items-center justify-center bg-[#C1F75E] text-black w-14 h-14 rounded-full shadow-2xl active:scale-90 transition-transform"
            >
                <Plus size={30} strokeWidth={3} />
            </button>
        </AuthenticatedLayout>
    );
}