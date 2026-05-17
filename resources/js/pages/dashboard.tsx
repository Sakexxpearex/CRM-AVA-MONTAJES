import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    BarChart3, 
    Building2, 
    Users, 
    Zap, 
    DollarSign, 
    Target, 
    Trophy 
} from 'lucide-react';

// Componentes de pagina
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import StatCard from '@/components/dashboard/StatCard';

export default function Dashboard({ stats }: any) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    if (!stats) {
        return <div className="p-10 text-white font-mono text-xs">Error: No se recibieron estadísticas del servidor.</div>;
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <PageContainer>
                {/* Usuario esquina superior derecha */}
                <div className="flex justify-end items-center gap-3 mb-6">
                    <div className="text-right">
                        <p className="text-sm font-bold dark:text-white leading-none">
                            {user.nombre_1} {user.apellido_1}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium tracking-tighter uppercase">
                            {user.email}
                        </p>
                    </div>
                    <div className="w-9 h-9 bg-[#c1f75e] rounded flex items-center justify-center text-black font-black text-xs shadow-sm">
                        {user.nombre_1[0]}{user.apellido_1[0]}
                    </div>
                </div>

                {/* Header */}
                <PageHeader
                    title="Dashboard"
                    subtitle="Resumen de actividad, métricas y gestión comercial"
                    icon={LayoutDashboard}
                />

                {/* SECCIÓN 1: RENDIMIENTO COMERCIAL (NUEVO) */}
                <div className="mb-8">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">
                        Rendimiento Comercial
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            label="Éxito Acumulado"
                            value={stats.volumen_total_formateado || '$0'}
                            trend="Total histórico adjudicado"
                            icon={DollarSign}
                            color="neon"
                        />
                        <StatCard
                            label="Win Rate"
                            value={`${stats.win_rate || 0}%`}
                            trend="Efectividad de cierre"
                            icon={Target}
                            color="blue"
                        />
                        <StatCard
                            label="Proyectos Ganados"
                            value={stats.licitaciones_ganadas || 0}
                            trend={`De ${stats.licitaciones_participadas || 0} presentadas`}
                            icon={Trophy}
                            color="neon"
                        />
                    </div>
                </div>

                {/* SECCIÓN 2: MÉTRICAS OPERATIVAS */}
                <div>
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">
                        Gestión de Base de Datos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard
                            label="Licitaciones Activas"
                            value={stats.totalLicitaciones}
                            trend={`${stats.nuevasLicitaciones} nuevas`}
                            icon={BarChart3}
                        />
                        <StatCard
                            label="Empresas"
                            value={stats.totalEmpresas}
                            icon={Building2}
                            color="gray"
                        />
                        <StatCard
                            label="Contactos"
                            value={stats.totalPersonas}
                            icon={Users}
                            color="gray"
                        />
                        <StatCard
                            label="Ritmo Mensual"
                            value={stats.nuevasLicitaciones}
                            trend="Nuevos ingresos"
                            icon={Zap}
                            color="neon"
                        />
                    </div>
                </div>
            </PageContainer>
        </AuthenticatedLayout>
    );
}