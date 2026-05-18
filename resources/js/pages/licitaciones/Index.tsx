
import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart3, Plus, LayoutGrid, List } from 'lucide-react';

// Componentes de pagina (para mantener todo igual)
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

// Componentes especificos de licitaciones
import LicitacionStats from '@/components/licitaciones/LicitacionStats';
import LicitacionesTable from '@/components/licitaciones/LicitacionesTable';
import LicitacionModal from '@/components/licitaciones/LicitacionModal';
import LicitacionesKanban from '@/components/licitaciones/LicitacionesKanban'; // Tu nuevo tablero

export default function Index({ licitaciones, empresas, divisiones, stats }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Definimos 'kanban' como la vista por defecto
    const [vista, setVista] = useState<'kanban' | 'tabla'>('kanban');

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
                >
                    {/* Selector para elegir entre el tablero o la vista*/}
                    <div className="flex bg-white/5 p-1 rounded-lg border border-gray-800 gap-1 w-full sm:w-auto justify-center sm:mr-4">
                        <button 
                            onClick={() => setVista('kanban')}
                            className={`flex items-center gap-1.5 px-3 py-2 h-[32px] rounded text-[10px] font-black uppercase tracking-wider transition-all duration-150 ${
                                vista === 'kanban' 
                                    ? 'bg-[#c1f75e] text-black shadow-lg shadow-[#c1f75e]/10' 
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <LayoutGrid size={12} strokeWidth={vista === 'kanban' ? 3 : 2} />
                            <span>Tablero</span>
                        </button>
                        <button 
                            onClick={() => setVista('tabla')}
                            className={`flex items-center gap-1.5 px-3 py-2 h-[32px] rounded text-[10px] font-black uppercase tracking-wider transition-all duration-150 ${
                                vista === 'tabla' 
                                    ? 'bg-[#c1f75e] text-black shadow-lg shadow-[#c1f75e]/10' 
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <List size={12} strokeWidth={vista === 'tabla' ? 3 : 2} />
                            <span>Lista</span>
                        </button>
                    </div>
                </PageHeader>

                {/* estadisticas globales */}
                <LicitacionStats stats={stats} />

                <div className="mt-6">
                    {vista === 'kanban' ? (
                        // El Tablero Kanban por defecto
                        <LicitacionesKanban licitaciones={licitaciones} />
                    ) : (
                        // El listado plano dentro de su panel original
                        <ContentPanel padding={false}>
                            <LicitacionesTable licitaciones={licitaciones} />
                        </ContentPanel>
                    )}
                </div>
            </PageContainer>

            {/* Boton para vista mobile */}
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