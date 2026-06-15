import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ClipboardCheck, Plus } from 'lucide-react';

import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

import PrecalificacionesTable from '@/components/precalificaciones/PrecalificacionesTable';
import PrecalificacionModal from '@/components/precalificaciones/PrecalificacionModal';

interface Props {
    precalificaciones: any[];
    empresas: any[];
    divisiones: any[];
    personas: any[]; 
}

export default function Index({ precalificaciones, empresas, divisiones, personas }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Precalificaciones de Proyectos" />

            <PageContainer>
                <PageHeader
                    title="Precalificaciones"
                    subtitle="Filtro previo y evaluación de viabilidad para nuevos proyectos potenciales"
                    icon={ClipboardCheck}
                    actionLabel="Nueva Propuesta"
                    onActionClick={() => setIsCreateOpen(true)}
                />

                <ContentPanel 
                    padding={false} 
                    className="bg-transparent dark:bg-transparent border-transparent dark:border-transparent shadow-none md:bg-white md:dark:bg-[#0d1117] md:border-gray-200 md:dark:border-gray-800 md:shadow-sm"
                >
                    <PrecalificacionesTable precalificaciones={precalificaciones} />
                </ContentPanel>
            </PageContainer>

            {/* Botón flotante para móviles */}
            <button
                onClick={() => setIsCreateOpen(true)}
                className="md:hidden fixed bottom-24 right-6 z-50 flex items-center justify-center bg-[#c1f75e] text-black w-12 h-12 rounded-full shadow-2xl active:scale-95 transition-transform border border-black/10"
                title="Nueva Propuesta"
            >
                <Plus size={18} strokeWidth={3} />
            </button>

            {/* Creación Rápida */}
            <PrecalificacionModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                empresas={empresas}
                divisiones={divisiones}
                personas={personas} 
            />
        </AuthenticatedLayout>
    );
}