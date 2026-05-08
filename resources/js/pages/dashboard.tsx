import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { LayoutDashboard, BarChart3, Building2, Users } from 'lucide-react';

// Componentes de pagina (para mantener todo igual)
import PageContainer from '@/components/pages/PageContainer';
import PageHeader from '@/components/pages/PageHeader';
import ContentPanel from '@/components/pages/ContentPanel';

// Componentes especificos del dashboard
import StatCard from '@/components/dashboard/StatCard';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const user = auth.user;

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

                {/* Metricas*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        label="Licitaciones Activas"
                        value="12"
                        trend="+2 este mes"
                        icon={BarChart3}
                    />
                    <StatCard 
                        label="Empresas"
                        value="24"
                        icon={Building2}
                    />
                    <StatCard 
                        label="Contactos"
                        value="156"
                        icon={Users}
                    />
                </div>
            </PageContainer>
        </AuthenticatedLayout>
    );
}