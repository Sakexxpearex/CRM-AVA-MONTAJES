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
import { useState, useEffect } from 'react';

export default function Dashboard({ stats }: any) {
    const { auth, flash } = usePage().props as any;
    const user = auth.user;
    const [verAlerta, setVerAlerta] = useState(false);

    useEffect(() => {
        // Si el backend envió una alerta flash, activamos el componente visual
        if (flash?.alerta_flash) {
            setVerAlerta(true);
        }
    }, [flash]);

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
                        <p className="text-[10px] text-gray-500 font-medium tracking-tighter uppercase mt-1">
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
                {verAlerta && (
                    <div className="mb-6 flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 animate-pulse">
                        <div className="flex items-center gap-3">
                            <OctagonAlert className="w-5 h-5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider">Atención Inmediata</p>
                                <p className="text-sm font-medium text-gray-200 mt-0.5">{flash.alerta_flash}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setVerAlerta(false)}
                            className="text-gray-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-black/20 hover:bg-black/40 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                )}

                {/* SECCIÓN 1: RENDIMIENTO COMERCIAL */}
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
                <div className="mb-8">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">
                        Gestión de Base de Datos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                        {/* Aquí está la magia: Usamos un div con router.get en lugar de un Link */}
                        <div
                            onClick={() => router.get('/alertas-estancadas')}
                            className="block transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-xl cursor-pointer"
                        >
                            <StatCard
                                label="Licitaciones Estancadas"
                                value={stats.alertas_vencidas}
                                icon={OctagonAlert}
                            />
                        </div>

                    </div>

                </div>

            </PageContainer>
        </AuthenticatedLayout>
    );
}