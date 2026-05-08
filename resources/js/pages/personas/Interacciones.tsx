import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Calendar, History } from 'lucide-react';

// Componentes de pagina (para mantener todo igual)
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

// Componentes especificos de interacciones
import TimeLine from '@/components/interacciones/TimeLine';

export default function InteraccionesIndex({ persona }: any) {
    // Agrupar interacciones por mes y año
    const groupedInteracciones = persona.interacciones.reduce((groups: any, interaccion: any) => {
        const date = new Date(interaccion.fecha);
        const monthYear = date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
        if (!groups[monthYear]) groups[monthYear] = [];
        groups[monthYear].push(interaccion);
        return groups;
    }, {});

    return (
        <AuthenticatedLayout>
            <Head title={`Historial - ${persona.nombre_1} ${persona.apellido_1}`} />

            {/* Ancho maximo*/}
            <PageContainer className="max-w-4xl">
                
                {/* Navegación */}
                <Link 
                    href={route('personas.show', persona.id)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-[#c1f75e] transition-all group w-fit mb-2 tracking-widest"
                >
                    <ChevronLeft size={14} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform"/> 
                    Volver al Perfil
                </Link>

                {/* Header */}
                <PageHeader 
                    title="Historial de Actividad"
                    subtitle={`Bitácora completa de gestiones con ${persona.nombre_1} ${persona.apellido_1}`}
                    icon={History}
                />

                {/* Resumen */}
                <div className="flex justify-start mb-10">
                    <div className="px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 shadow-sm">
                        <Calendar size={14} className="text-[#c1f75e]" /> 
                        {persona.interacciones.length} Gestiones registradas
                    </div>
                </div>

                {/* TimeLine */}
                <div className="space-y-12">
                    {Object.keys(groupedInteracciones).length > 0 ? (
                        Object.entries(groupedInteracciones).map(([month, interacciones]: any) => (
                            <div key={month} className="space-y-6">
                                {/* Separador de Mes */}
                                <div className="relative flex items-center">
                                    <div className="bg-gray-100 dark:bg-white/5 px-4 py-1 rounded border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] z-10">
                                        {month}
                                    </div>
                                    <div className="absolute h-[1px] w-full bg-gray-200 dark:bg-gray-800"></div>
                                </div>

                                <ContentPanel padding={false} className="bg-transparent border-none shadow-none overflow-visible">
                                    <TimeLine month={month} interacciones={interacciones} />
                                </ContentPanel>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                            <History size={40} className="mx-auto text-gray-300 dark:text-gray-800 mb-4" />
                            <p className="text-gray-500 uppercase font-black text-[10px] tracking-widest">Sin registros históricos en la bitácora</p>
                        </div>
                    )}
                </div>
            </PageContainer>
        </AuthenticatedLayout>
    );
}