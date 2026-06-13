import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { BarChart3, Plus, LayoutGrid, List } from 'lucide-react';

import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

import LicitacionStats from '@/components/licitaciones/LicitacionStats';
import LicitacionesTable from '@/components/licitaciones/LicitacionesTable';
import LicitacionesKanban from '@/components/licitaciones/LicitacionesKanban';
import LicitacionModal from '@/components/licitaciones/LicitacionModal';
import SearchLicitacion from '@/components/licitaciones/SearchLicitaciones';


export default function Index({
    licitaciones,
    empresas,
    divisiones,
    stats,
    filters = {},
    estados = [],
}: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Definimos 'kanban' como la vista por defecto
    const [vista, setVista] = useState<'kanban' | 'tabla'>('kanban');

    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
    const [estadoFiltro, setEstadoFiltro] = useState(filters.estado ?? '');
    const [montoOrder, setMontoOrder] = useState(filters.monto_order ?? '');
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                route('licitaciones.index'),
                {
                    search: searchTerm.trim() || undefined,
                    estado: estadoFiltro || undefined,
                    monto_order: montoOrder || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['licitaciones', 'filters', 'estados'],
                },
            );
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [searchTerm, estadoFiltro, montoOrder]);

    return (
        <AuthenticatedLayout>
            <Head title="Pipeline de Licitaciones" />

            <PageContainer>
                <PageHeader
                    title="Licitaciones"
                    subtitle="Gestión de oportunidades y pipeline comercial de AVA"
                    icon={BarChart3}
                    actionLabel="Nueva Licitación"
                    onActionClick={() => setIsModalOpen(true)}
                >
                    {/* Selector para elegir entre el tablero o la lista */}
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

                <LicitacionStats stats={stats} />

                <div className="flex justify-start">
                    <SearchLicitacion
                        value={searchTerm}
                        onChange={setSearchTerm}
                        estado={estadoFiltro}
                        onEstadoChange={setEstadoFiltro}
                        montoOrder={montoOrder}
                        onMontoOrderChange={setMontoOrder}
                        estados={estados}
                    />
                </div>

                {/* renderizado segun lo que se selecciona*/}
                {vista === 'kanban' ? (
                    <div className="mt-4">
                        <LicitacionesKanban licitaciones={licitaciones} />
                    </div>
                ) : (
                    <ContentPanel padding={false}>
                        <LicitacionesTable licitaciones={licitaciones} />
                    </ContentPanel>
                )}
            </PageContainer>

            <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-24 right-6 z-50 flex items-center justify-center bg-[#c1f75e] text-black w-10 h-10 rounded-full shadow-2xl active:scale-90 transition-transform"
            >
                <Plus size={16} strokeWidth={3} />
            </button>

            <LicitacionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                empresas={empresas}
                divisiones={divisiones}
            />
        </AuthenticatedLayout>
    );
}