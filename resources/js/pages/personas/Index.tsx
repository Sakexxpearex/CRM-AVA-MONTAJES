import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import PersonasHeader from '@/components/personas/PersonasHeader';
import PersonasTable from '@/components/personas/PersonasTable';
import PersonaModal from '@/components/personas/PersonaModal';
import PersonasMobile from '@/components/personas/PersonasMobile';

import { Persona } from '@/types/persona';

interface Division {
    id: number;
    nombre: string;
    empresa: { id: number; nombre: string }; // Aseguramos traer el id de la empresa
}

export default function PersonasIndex({ personas, divisiones }: { personas: Persona[], divisiones: Division[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Agregamos 'put' y 'reset' al hook
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre_1: '',
        nombre_2: '',
        apellido_1: '',
        apellido_2: '',
        rut: '',
        email: '',
        telefono: '',
        division_id: '',
        empresa_id: '', // Se llena vía useEffect en el Modal
        cargo_actual: '',
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        reset(); // Limpia los campos al cerrar
    };

    const openEditModal = (persona: Persona) => {
        setEditingId(persona.id);

        setData({
            rut: persona.rut,
            nombre_1: persona.nombre_1,
            nombre_2: persona.nombre_2 || '',
            apellido_1: persona.apellido_1,
            apellido_2: persona.apellido_2 || '',
            email: persona.email,
            telefono: persona.telefono,
            // Al editar, estos pueden ir vacíos si el controlador maneja el update de la persona
            // o puedes cargar los valores actuales si los necesitas.
            division_id: persona.trabajo_actual?.division_id?.toString() || '',
            empresa_id: persona.trabajo_actual?.division?.empresa_id?.toString() || '',
            cargo_actual: persona.trabajo_actual?.cargo || '',
        });

        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // Usamos put para actualizaciones
            put(route('personas.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            // Usamos post para creaciones
            post(route('personas.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Contactos - AVA CRM" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
                
                {/* Header */}
                <PersonasHeader 
                    onCreate={() => {
                        reset();
                        setEditingId(null);
                        setIsModalOpen(true);
                    }}
                />

                {/* Mobile View */}
                <PersonasMobile personas={personas} />

                {/* Desktop View */}
                <PersonasTable 
                    personas={personas}
                    onEdit={openEditModal}
                    onDelete={(id) => {
                        if (confirm('¿Estás seguro de eliminar este contacto? Esta acción no se puede deshacer.')) {
                            router.delete(route('personas.destroy', id));
                        }
                    }}
                />
            </div>

            {/* Modal de Registro/Edición */}
            <PersonaModal
                isOpen={isModalOpen}
                onClose={closeModal}
                data={data}
                setData={setData}
                submit={submit}
                processing={processing}
                errors={errors}
                divisiones={divisiones}
                editingId={editingId}
            />

            {/* Floating Action Button (Mobile) */}
            <button 
                onClick={() => {
                    reset();
                    setEditingId(null);
                    setIsModalOpen(true);
                }}
                className="md:hidden fixed bottom-24 right-6 z-50 flex items-center justify-center bg-[#C1F75E] text-black w-14 h-14 rounded-full shadow-2xl active:scale-90 transition-transform"
            >
                <Plus size={30} strokeWidth={3} />
            </button>
        </AuthenticatedLayout>
    );
}