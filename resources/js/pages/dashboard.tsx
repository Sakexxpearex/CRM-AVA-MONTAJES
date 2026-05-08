import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

interface Props {
    stats: {
        totalLicitaciones: number;
        totalEmpresas: number;
        totalPersonas: number;
        nuevasLicitaciones: number;

    }
}
export default function Dashboard({ stats }: Props) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* Usuario (esquina superior derecha) */}
            <div className="flex justify-end mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold dark:text-white leading-none">
                            {user.nombre_1} {user.apellido_1}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                            {user.email}
                        </p>
                    </div>
                    <div className="w-9 h-9 bg-[#86CF00] rounded-full flex items-center justify-center text-black font-black text-xs shadow-sm">
                        {user.nombre_1[0]}{user.apellido_1[0]}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-bold dark:text-white">Dashboard</h2>
                </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm relative overflow-hidden group">
                    {/* Acento de color verde neón */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#86CF00] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Licitaciones Activas</h3>
                    <div className="flex items-end gap-2 mt-2">
                        <p className="text-5xl font-black dark:text-white">{stats.totalLicitaciones}</p>
                        <span className="text-[#86CF00] text-sm font-bold mb-2">+ {stats.nuevasLicitaciones}</span>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Empresas</h3>
                    <p className="text-5xl font-black mt-2 dark:text-white">{stats.totalEmpresas}</p>
                </div>

                <div className="p-6 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Contactos</h3>
                    <p className="text-5xl font-black mt-2 dark:text-white">{stats.totalPersonas}</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}