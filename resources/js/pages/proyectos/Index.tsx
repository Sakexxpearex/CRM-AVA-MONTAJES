import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Briefcase, Target, Hash, ChevronRight, LayoutGrid } from 'lucide-react';
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';
/// Hay q separar este modulo en componentes en un futuro

export default function ProyectosIndex({ proyectos }: any) {
    return (
        <AuthenticatedLayout>
            <Head title="Proyectos - AVA" />

            <PageContainer>
                <PageHeader 
                    title="Proyectos"
                    subtitle="Listado oficial de centros de costo y ejecución"
                    icon={Briefcase}
                />

                <ContentPanel padding={false}>
                    {/* Vista mobile*/}
                    <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {proyectos.map((proy: any) => (
                            <div key={proy.id} className="p-5 space-y-4 active:bg-gray-50 dark:active:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-[#c1f75e] border border-gray-800 shadow-lg">
                                            <Hash size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#c1f75e] uppercase tracking-widest font-mono">
                                                {proy.centro_costo}
                                            </p>
                                            <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase leading-tight mt-0.5">
                                                {proy.nombre}
                                            </h3>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-mono text-gray-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                                        #{proy.id}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 dark:bg-black/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Referencia / Alias</span>
                                        <span className="text-[10px] font-bold dark:text-gray-300 uppercase">
                                            {proy.alias || 'Sin Alias'}
                                        </span>
                                    </div>
                                    <button className="flex items-center gap-2 bg-[#c1f75e] text-black px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-[#c1f75e]/10">
                                        Detalle <ChevronRight size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vista pc */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Centro de Costo</th>
                                    <th className="px-6 py-4">Nombre del Proyecto</th>
                                    <th className="px-6 py-4">Alias / Ref</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {proyectos.map((proy: any) => (
                                    <tr key={proy.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-[10px] font-mono text-gray-500">
                                            #{proy.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-gray-900 rounded text-[#c1f75e]">
                                                    <Hash size={12} />
                                                </div>
                                                <span className="font-mono text-xs font-bold text-gray-700 dark:text-[#c1f75e]">
                                                    {proy.centro_costo}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase tracking-tight group-hover:text-[#c1f75e] transition-colors">
                                                {proy.nombre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                                                {proy.alias || '---'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-gray-400 hover:text-[#c1f75e] transition-colors">
                                                <Target size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ContentPanel>

                {proyectos.length === 0 && (
                    <div className="text-center py-20 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-50 border-2 border-dashed border-gray-800 rounded-3xl mt-6">
                        No hay proyectos activos registrados
                    </div>
                )}
            </PageContainer>
        </AuthenticatedLayout>
    );
}