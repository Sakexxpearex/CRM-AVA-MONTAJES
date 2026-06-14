import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    BarChart3,
    Building2,
    Users,
    Zap,
    DollarSign,
    Target,
    Trophy,
    OctagonAlert
} from 'lucide-react';

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
                {/* Perfil: Justificado al centro en móvil para mejor ergonomía, a la derecha en escritorio */}
                <div className="flex justify-center sm:justify-end items-center gap-3 mb-8 bg-gray-50 dark:bg-[#111] sm:bg-transparent dark:sm:bg-transparent p-3 sm:p-0 rounded-xl border border-gray-100 dark:border-gray-800 sm:border-0">
                    <div className="text-right">
                        <p className="text-sm font-bold dark:text-white leading-none">
                            {user.nombre_1} {user.apellido_1}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium tracking-tighter uppercase mt-1">
                            {user.email}
                        </p>
                    </div>
                    <div className="w-9 h-9 bg-[#c1f75e] rounded flex items-center justify-center text-black font-black text-xs shadow-sm shrink-0">
                        {user.nombre_1[0]}{user.apellido_1[0]}
                    </div>
                </div>

                {/* Header */}
                <PageHeader
                    title="Dashboard"
                    subtitle="Resumen de actividad, métricas y gestión comercial"
                    icon={LayoutDashboard}
                />

                {/* SECCIÓN 1: RENDIMIENTO COMERCIAL */}
                <div className="mb-8">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">
                        Rendimiento Comercial
                    </h2>
                    {/* Grilla fluida: 1 columna en móvil, 2 en tablets chicas, 3 en escritorio */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                        <div className="sm:col-span-2 lg:col-span-1"> {/* Hace que ocupe el ancho completo si queda sola */}
                            <StatCard
                                label="Proyectos Ganados"
                                value={stats.licitaciones_ganadas || 0}
                                trend={`De ${stats.licitaciones_participadas || 0} presentadas`}
                                icon={Trophy}
                                color="neon"
                            />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: MÉTRICAS OPERATIVAS */}
                <div className="mb-8">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">
                        Gestión de Base de Datos
                    </h2>
                    {/* Grilla fluida: de 1 columna pasa a 2 y luego a 4 en pantallas grandes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatCard
                            label="Licitaciones Activas"
                            value={stats.totalLicitaciones || 0}
                            trend={`${stats.nuevasLicitaciones || 0} nuevas`}
                            icon={BarChart3}
                        />
                        <StatCard
                            label="Empresas"
                            value={stats.totalEmpresas || 0}
                            icon={Building2}
                            color="gray"
                        />
                        <StatCard
                            label="Contactos"
                            value={stats.totalPersonas || 0}
                            icon={Users}
                            color="gray"
                        />
                        <StatCard
                            label="Ritmo Mensual"
                            value={stats.nuevasLicitaciones || 0}
                            trend="Nuevos ingresos"
                            icon={Zap}
                            color="neon"
                        />
                    </div>
                </div>

                {/* SECCIÓN 3: ALERTAS DE ATENCIÓN */}
                <div className="mb-8">
                    <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4 ml-1">
                        Atención Requerida
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Optimizamos el contenedor interactivo para comportamiento táctil (active:scale-98 en móvil) */}
                        <div
                            onClick={() => router.get('/alertas-estancadas')}
                            className="block transition-all duration-200 lg:hover:scale-[1.02] lg:hover:shadow-md active:scale-95 rounded-2xl cursor-pointer"
                        >
                            <StatCard
                                label="Licitaciones Estancadas"
                                value={stats.alertas_vencidas}
                                trend="Sin gestión comercial por más de 30 días"
                                icon={OctagonAlert}
                            />
                        </div>
                    </div>
                </div>
            </PageContainer>
        </AuthenticatedLayout>
    );
}