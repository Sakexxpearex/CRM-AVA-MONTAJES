import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Briefcase, Target, Hash } from 'lucide-react';
// Componentes de pagina (para mantener todo igual)
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

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
                    <div className="overflow-x-auto">
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
                                            <span className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase tracking-tight">
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
            </PageContainer>
        </AuthenticatedLayout>
    );
}