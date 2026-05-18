import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Users, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

import PersonasTable from '@/components/personas/PersonasTable';
import PersonaModal from '@/components/personas/PersonaModal';
import SearchPersona from '@/components/personas/SearchPersona';
import { Persona } from '@/types/persona';

interface EmpresaOption {
    id: number;
    nombre: string;
}

interface Props {
    personas: Persona[];
    divisiones: any[];
    empresas: EmpresaOption[];
    filters?: {
        search?: string;
        empresa_id?: string;
    };
}

export default function PersonasIndex({
    personas,
    divisiones,
    empresas,
    filters = {},
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
    const [empresaFiltro, setEmpresaFiltro] = useState(filters.empresa_id ?? '');
    const firstRender = useRef(true);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre_1: '',
        nombre_2: '',
        apellido_1: '',
        apellido_2: '',
        rut: '',
        email: '',
        telefono: '',
        division_id: '',
        empresa_id: '',
        cargo_actual: '',
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        reset();
    };

    const openEditModal = (persona: Persona) => {
        setEditingId(persona.id);

        setData({
            nombre_1: persona.nombre_1,
            nombre_2: persona.nombre_2 || '',
            apellido_1: persona.apellido_1,
            apellido_2: persona.apellido_2 || '',
            rut: persona.rut || '',
            email: persona.email || '',
            telefono: persona.telefono || '',
            division_id: persona.trabajo_actual?.division_id?.toString() || '',
            empresa_id: persona.trabajo_actual?.division?.empresa_id?.toString() || '',
            cargo_actual: persona.trabajo_actual?.cargo || '',
        });

        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            put(route('personas.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('personas.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Deseas eliminar este contacto?')) {
            router.delete(route('personas.destroy', id));
        }
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                route('personas.index'),
                {
                    search: searchTerm.trim() || undefined,
                    empresa_id: empresaFiltro || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['personas', 'empresas', 'filters'],
                },
            );
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [searchTerm, empresaFiltro]);

    return (
        <AuthenticatedLayout>
            <Head title="Directorio de Contactos - AVA" />

            <PageContainer>
                <PageHeader
                    title="Personas"
                    subtitle="Gestión de contactos, cargos y relaciones comerciales"
                    icon={Users}
                    actionLabel="Nuevo Contacto"
                    onActionClick={() => setIsModalOpen(true)}
                />

                <div className="flex justify-start">
                    <SearchPersona
                        value={searchTerm}
                        onChange={setSearchTerm}
                        empresaId={empresaFiltro}
                        onEmpresaChange={setEmpresaFiltro}
                        empresas={empresas}
                    />
                </div>

                <ContentPanel padding={false}>
                    <PersonasTable
                        personas={personas}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                </ContentPanel>
            </PageContainer>

            <PersonaModal
                isOpen={isModalOpen}
                onClose={closeModal}
                data={data}
                setData={setData}
                submit={submit}
                errors={errors}
                processing={processing}
                divisiones={divisiones}
                editingId={editingId}
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