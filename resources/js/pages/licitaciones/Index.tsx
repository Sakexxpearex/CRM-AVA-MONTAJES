import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart3, Plus } from 'lucide-react';


// Componentes de pagina (para mantener todo igual)
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

// Componentes especificos de licitaciones
import LicitacionStats from '@/components/licitaciones/LicitacionStats';
import LicitacionesTable from '@/components/licitaciones/LicitacionesTable';
import LicitacionModal from '@/components/licitaciones/LicitacionModal';

export default function Index({ licitaciones, empresas, divisiones, stats }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Pipeline de Licitaciones" />

            <PageContainer>
                {/* Header */}
                <PageHeader 
                    title="Licitaciones"
                    subtitle="Gestión de oportunidades y pipeline comercial de AVA"
                    icon={BarChart3}
                    actionLabel="Nueva Licitación"
                    onActionClick={() => setIsModalOpen(true)}
                />

                {/* Estadísticas */}
                <LicitacionStats stats={stats} />

                {/*  Tabla */}
                <ContentPanel padding={false}>
                    <LicitacionesTable licitaciones={licitaciones} />
                </ContentPanel>
            </PageContainer>

            {/* Boton para vista mobile (copiado en cada page donde es necesario para que todas sean iguales) */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-24 right-6 z-50 flex items-center justify-center bg-[#c1f75e] text-black w-10 h-10 rounded-full shadow-2xl active:scale-90 transition-transform"
            >
                <Plus size={16} strokeWidth={3} />
            </button>

            {/* Modal de Registro */}
            <LicitacionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                empresas={empresas}
                divisiones={divisiones}
            />
        </AuthenticatedLayout>
    );
}