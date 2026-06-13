import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { OctagonAlert, Clock } from 'lucide-react';
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

export default function AlertasIndex({ alertas }: { alertas: any[] }) {

    // Función para renderizar el mensaje del contador amigable adaptado a modo oscuro
    const renderContadorRetraso = (dias: number) => {
        if (dias === 1) return <span className="text-red-500 dark:text-red-400">Hace 1 día debiste contactar</span>;
        return <span className="text-red-500 dark:text-red-400">Hace {dias} días debiste contactar</span>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Alertas de Licitaciones - AVA" />

            <PageContainer>
                <PageHeader
                    title="Licitaciones Estancadas"
                    subtitle="Proyectos sin interacción comercial por más de 30 días"
                    icon={OctagonAlert}
                />

                <ContentPanel padding={false}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-black/20 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                                <tr>
                                    <th className="px-6 py-3">Empresa / División</th>
                                    <th className="px-6 py-3">Licitación</th>
                                    <th className="px-6 py-3">Última Interacción</th>
                                    <th className="px-6 py-3">Responsable</th>
                                    <th className="px-6 py-3">Retraso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {alertas.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                            ¡Felicidades! No hay licitaciones estancadas.
                                        </td>
                                    </tr>
                                ) : (
                                    alertas.map((alerta) => (
                                        <tr key={alerta.id} className="hover:bg-red-50/50 dark:hover:bg-red-500/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-bold dark:text-gray-200 uppercase">{alerta.empresa}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">{alerta.division}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold dark:text-gray-200 uppercase">
                                                {alerta.nombre_proyecto}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-bold dark:text-gray-200 uppercase">{alerta.ultima_interaccion_fecha}</div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 inline-block px-2 py-0.5 rounded mt-1 uppercase italic">
                                                    {alerta.ultima_interaccion_tipo}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] text-gray-500 uppercase italic">
                                                {alerta.ultima_interaccion_quien}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-md inline-flex border border-red-100 dark:border-red-500/20">
                                                    <Clock size={14} className="text-red-500 dark:text-red-400" />
                                                    {renderContadorRetraso(alerta.dias_retraso)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </ContentPanel>
            </PageContainer>
        </AuthenticatedLayout>
    );
}