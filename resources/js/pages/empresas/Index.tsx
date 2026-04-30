import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Building2, Plus, Search, MoreHorizontal, CheckCircle2, X, Briefcase, FileText, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';

interface Empresa {
    id: number;
    nombre: string;
    rut: string;
    tipo: 'Cliente' | 'Competencia' | 'Subcontratista';
}

// Mapa de iconos y colores por tipo de empresa
const tipoConfig = {
    Cliente: { icon: FileText, color: 'text-[#B0FF08]', bgColor: 'bg-[#B0FF08]/10' },
    Competencia: { icon: Briefcase, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    Subcontratista: { icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
};

export default function EmpresasIndex({ empresas }: { empresas: Empresa[] }) {
    const { flash } = usePage<any>().props;
    const [showFlash, setShowFlash] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        rut: '',
        tipo: 'Cliente' as 'Cliente' | 'Competencia' | 'Subcontratista',
    });

    useEffect(() => {
        if (flash?.message) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('empresas.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Empresas - Directorio" />

            {/* Notificación */}
            {showFlash && flash?.message && (
                <div className="fixed top-24 right-10 z-[120] animate-in fade-in slide-in-from-right-5 duration-300">
                    <div className="bg-[#B0FF08] text-black px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 font-bold border border-black/10">
                        <CheckCircle2 size={18} />
                        <span className="text-sm">{flash.message}</span>
                    </div>
                </div>
            )}

            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-white tracking-tighter">Directorio</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gestión centralizada de entidades y aliados.</p>
                    </div>
                    
                    {/* BOTÓN DESKTOP: Se oculta en móvil (hidden) y aparece en md (flex) */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="hidden md:flex items-center justify-center gap-2 bg-[#B0FF08] text-black font-bold text-sm px-6 py-3 rounded-full hover:bg-[#B0FF08]/90 active:scale-95 transition-all shadow-lg shadow-[#B0FF08]/10"
                    >
                        <Plus size={18} />
                        <span>Añadir Empresa</span>
                    </button>
                </div>

                {/* Barra de busqueda */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre de empresa o RUT..." 
                        className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-gray-950 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-1 focus:ring-[#B0FF08] focus:border-[#B0FF08] transition-all text-sm font-medium"
                    />
                </div>

                {/* Tabla de empresas */}
                <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#141414]">
                            <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Empresa</th>
                                <th className="px-6 py-4 hidden md:table-cell">RUT</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                            {empresas.length > 0 ? (
                                empresas.map((empresa) => {
                                    const { icon: TipoIcon, color, bgColor } = tipoConfig[empresa.tipo] || tipoConfig.Cliente;
                                    return (
                                        <tr key={empresa.id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-600 group-hover:border-[#B0FF08]/40 group-hover:text-[#B0FF08] transition-colors">
                                                        <Building2 size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-base text-gray-950 dark:text-white tracking-tight">
                                                            {empresa.nombre}
                                                        </span>
                                                        <span className="md:hidden block text-xs text-gray-500 mt-0.5">{empresa.rut}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 hidden md:table-cell text-gray-600 dark:text-gray-400 font-mono text-sm tracking-tight">
                                                {empresa.rut}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgColor}`}>
                                                    <TipoIcon size={14} className={color} />
                                                    <span className={`text-xs font-bold ${color}`}>
                                                        {empresa.tipo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right relative">
                                                <button className="p-2 text-gray-400 dark:text-gray-600 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <Building2 size={40} className="mx-auto mb-5 text-gray-300 dark:text-gray-700" />
                                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No hay empresas registradas.</p>
                                        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">Haz clic en "Añadir Empresa" para comenzar.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Boton para version mobile */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex md:hidden fixed bottom-24 right-6 z-[90] items-center justify-center bg-[#B0FF08] text-black w-14 h-14 rounded-full shadow-2xl active:scale-95 transition-all ring-4 ring-black/10"
            >
                <Plus size={28} strokeWidth={3} />
            </button>
            {/*  Crear empresa  */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
                    
                    <div className="relative bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 w-full max-w-lg rounded-3xl p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-950 dark:hover:text-white">
                            <X size={20} />
                        </button>

                        <div className="mb-9">
                            <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white tracking-tighter">Nueva Empresa</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">Completa los datos para registrar la entidad.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">RUT </label>
                                <input 
                                    type="text"
                                    value={data.rut}
                                    onChange={e => setData('rut', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl py-3.5 px-5 text-gray-950 dark:text-white focus:ring-1 focus:ring-[#B0FF08] focus:border-[#B0FF08] outline-none transition-all font-medium text-sm"
                                    placeholder="Ej: 77.888.999-K"
                                />
                                <InputError message={errors.rut} className="mt-2" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">Nombre Comercial</label>
                                <input 
                                    type="text"
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl py-3.5 px-5 text-gray-950 dark:text-white focus:ring-1 focus:ring-[#B0FF08] focus:border-[#B0FF08] outline-none transition-all font-medium text-sm"
                                    placeholder="Nombre de la compañía"
                                />
                                <InputError message={errors.nombre} className="mt-2" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">Tipo de Relación</label>
                                <div className="relative">
                                    <select 
                                        value={data.tipo}
                                        onChange={e => setData('tipo', e.target.value as any)}
                                        className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl py-3.5 px-5 text-gray-950 dark:text-white focus:ring-1 focus:ring-[#B0FF08] focus:border-[#B0FF08] outline-none transition-all font-medium text-sm appearance-none"
                                    >
                                        <option value="Cliente">Cliente</option>
                                        <option value="Competencia">Competencia</option>
                                        <option value="Subcontratista">Subcontratista</option>
                                    </select>
                                    <MoreHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={16} />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#B0FF08] text-black font-bold py-4 rounded-xl hover:bg-[#B0FF08]/90 active:scale-98 transition-all shadow-md mt-4 disabled:opacity-50 text-sm"
                            >
                                {processing ? 'Procesando...' : 'Guardar Empresa'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}