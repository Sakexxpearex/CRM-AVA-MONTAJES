import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, BarChart3 } from 'lucide-react';

// Importamos los componentes que creamos
import LicitacionStats from '@/components/licitaciones/LicitacionStats';
import LicitacionesTable from '@/components/licitaciones/LicitacionesTable';
import LicitacionesMobile from '@/components/licitaciones/LicitacionesMobile';
import LicitacionModal from '@/components/licitaciones/LicitacionModal';

export default function Index({ licitaciones, empresas, divisiones }: any) {
    // Estado para controlar el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Pipeline de Licitaciones" />

            <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-8">
                
                {/* 1. HEADER: Título y Botón de Acción */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
                            <BarChart3 className="text-[#c1f75e]" size={32} />
                            Proyectos
                        </h1>
                        <p className="text-gray-500 font-medium ml-1">
                            Control de licitaciones y oportunidades comerciales
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#c1f75e] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#c1f75e]/20 flex items-center justify-center gap-2"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Nueva Licitación
                    </button>
                </div>

                {/* 2. STATS: Resumen financiero y de cantidad */}
                <LicitacionStats licitaciones={licitaciones} />

                {/* 3. LISTADO: Renderizado Condicional (Desktop vs Mobile) */}
                <div className="space-y-4">
                    {/* Esta tabla se oculta en móviles automáticamente dentro del componente */}
                    <LicitacionesTable licitaciones={licitaciones} />
                    
                    {/* Estas cards se ocultan en desktop automáticamente dentro del componente */}
                    <LicitacionesMobile licitaciones={licitaciones} />

                    {/* Empty State: Si no hay licitaciones */}
                    {licitaciones.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-dashed border-gray-800">
                            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                                No hay licitaciones registradas aún
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. MODAL: Formulario de creación */}
            <LicitacionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                empresas={empresas} 
                divisiones={divisiones} 
            />

        </AuthenticatedLayout>
    );
}