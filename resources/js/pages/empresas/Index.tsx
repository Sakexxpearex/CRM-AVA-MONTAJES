import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { 
    Building2, Plus, Search, MoreHorizontal, 
    X, Briefcase, FileText, Users, LoaderCircle 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';

interface Empresa {
    id: number;
    nombre: string;
    rut: string;
    tipo: 'Cliente' | 'Competencia' | 'Subcontratista';
}

const tipoConfig = {
    Cliente: { icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
    Competencia: { icon: Briefcase, color: 'text-red-600', bgColor: 'bg-red-50' },
    Subcontratista: { icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
};

export default function EmpresasIndex({ empresas }: { empresas: Empresa[] }) {
    const { flash } = usePage<any>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '', 
        rut: '', 
        tipo: 'Cliente' as any,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('empresas.store'), { 
            onSuccess: () => { 
                setIsModalOpen(false); 
                reset(); 
            } 
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Empresas - AVA CRM" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#B0FF08] pl-4 mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                            Empresas
                        </h1>
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            Directorio de clientes y aliados
                        </p>
                    </div>  
    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="hidden sm:flex items-center justify-center gap-2 bg-[#B0FF08] text-black font-extrabold text-xs px-5 py-3 rounded hover:bg-[#a2eb07] transition-all shadow-sm uppercase w-full sm:w-auto"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Nueva Empresa
                    </button>
                </div>

                {/* Buscador */}
                <div className="relative w-full max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-12 text-[11px] font-bold tracking-wider outline-none focus:ring-2 focus:ring-[#B0FF08] transition-all"
                        placeholder="BUSCAR POR NOMBRE O RUT..."
                    />
                </div>

                {/* Tabla */}
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <th className="px-6 py-4">Empresa</th>
                                    <th className="px-6 py-4 text-center">RUT</th>
                                    <th className="px-6 py-4 text-center">Categoría</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {empresas.map((empresa) => {
                                    const config = tipoConfig[empresa.tipo] || tipoConfig.Cliente;
                                    return (
                                        <tr key={empresa.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-100 dark:bg-[#1A1A1A] rounded flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-[#B0FF08] transition-all">
                                                        <Building2 size={16} />
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase">{empresa.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center font-mono text-xs text-gray-500 italic uppercase">
                                                {empresa.rut}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase ${config.bgColor} ${config.color} dark:bg-opacity-10`}>
                                                    <config.icon size={12} strokeWidth={3} />
                                                    {empresa.tipo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button className="p-1.5 text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Creación */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-[#111] w-full max-w-md rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white">Nuevo Registro</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black dark:hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">RUT Empresa</label>
                                <input 
                                    type="text" 
                                    value={data.rut}
                                    onChange={e => setData('rut', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08] transition-all"
                                    placeholder="12.345.678-9"
                                    required
                                />
                                <InputError message={errors.rut} />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">Nombre Comercial</label>
                                <input 
                                    type="text" 
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08] transition-all"
                                    required
                                />
                                <InputError message={errors.nombre} />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">Categoría</label>
                                <select 
                                    value={data.tipo}
                                    onChange={e => setData('tipo', e.target.value as any)}
                                    className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08] transition-all"
                                >
                                    <option value="Cliente">Cliente</option>
                                    <option value="Competencia">Competencia</option>
                                    <option value="Subcontratista">Subcontratista</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-[#B0FF08] text-black font-black py-4 rounded-lg uppercase text-xs tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? <LoaderCircle className="animate-spin" size={16} /> : "Guardar en Sistema"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <button 
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-24 right-6 z-50 flex items-center justify-center bg-[#B0FF08] text-black w-14 h-14 rounded-full shadow-2xl active:scale-90 transition-transform"
            >
                <Plus size={30} strokeWidth={3} />
            </button>
        </AuthenticatedLayout>
    );
}