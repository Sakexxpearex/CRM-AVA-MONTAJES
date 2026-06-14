import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Settings } from 'lucide-react';
import InputError from '@/components/input-error';

export default function LicitacionEditModal({
    isOpen,
    onClose,
    licitacion,
    empresas = [],
    divisiones = [],
}: any) {
    const { data, setData, put, processing, errors } = useForm({
        nombre_proyecto: licitacion?.nombre_proyecto || '',
        empresa_id: licitacion?.empresa_id || '',
        division_id: licitacion?.division_id || '',
        monto_estimado: licitacion?.monto_estimado || '',
        descripcion: licitacion?.descripcion || '',
        fecha_cierre: licitacion?.fecha_cierre || '',
    });

    useEffect(() => {
        if (isOpen && licitacion) {
            setData({
                nombre_proyecto: licitacion.nombre_proyecto || '',
                empresa_id: licitacion.empresa_id || '',
                division_id: licitacion.division_id || '',
                monto_estimado: licitacion.monto_estimado || '',
                descripcion: licitacion.descripcion || '',
                fecha_cierre: licitacion.fecha_cierre || '',
            });
        }
    }, [isOpen, licitacion]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('licitaciones.update', licitacion.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    const handleEmpresaChange = (empresaId: string) => {
        setData({
            ...data,
            empresa_id: empresaId,
            division_id: '',
        });
    };

    if (!isOpen || !licitacion) return null;

    const divisionesFiltradas =
        divisiones?.filter((division: any) => String(division.empresa_id) === String(data.empresa_id)) || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />

            {/* Ajuste estructural responsivo con scroll interno para pantallas compactas */}
            <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl p-5 md:p-8 shadow-2xl style-scrollbar">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#c1f75e]/20 text-[#c1f75e] rounded-lg shrink-0">
                            <Settings size={18} />
                        </div>
                        <h2 className="text-lg md:text-xl font-black uppercase italic dark:text-white tracking-tighter">
                            Editar Ficha de Licitación
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-black dark:hover:text-white p-1 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">
                            Nombre del Proyecto
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none transition-all"
                            value={data.nombre_proyecto}
                            onChange={(e) => setData('nombre_proyecto', e.target.value)}
                            required
                        />
                        <InputError message={errors.nombre_proyecto} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">
                                Empresa Cliente
                            </label>
                            <select
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none cursor-pointer"
                                value={data.empresa_id}
                                onChange={(e) => handleEmpresaChange(e.target.value)}
                                required
                            >
                                <option value="" className="dark:bg-[#111]">Seleccionar...</option>
                                {empresas.map((emp: any) => (
                                    <option key={emp.id} value={emp.id} className="dark:bg-[#111]">{emp.nombre}</option>
                                ))}
                            </select>
                            <InputError message={errors.empresa_id} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">
                                División / Área
                            </label>
                            <select
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none cursor-pointer disabled:opacity-40"
                                value={data.division_id}
                                onChange={(e) => setData('division_id', e.target.value)}
                                required
                                disabled={!data.empresa_id}
                            >
                                <option value="" className="dark:bg-[#111]">Seleccionar...</option>
                                {divisionesFiltradas.map((div: any) => (
                                    <option key={div.id} value={div.id} className="dark:bg-[#111]">{div.nombre}</option>
                                ))}
                            </select>
                            <InputError message={errors.division_id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">
                                Monto Estimado (CLP)
                            </label>
                            <input
                                type="number"
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none font-mono"
                                value={data.monto_estimado}
                                onChange={(e) => setData('monto_estimado', e.target.value)}
                            />
                            <InputError message={errors.monto_estimado} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">
                                Fecha de Cierre Estimada
                            </label>
                            <input
                                type="date"
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none cursor-pointer"
                                value={data.fecha_cierre}
                                onChange={(e) => setData('fecha_cierre', e.target.value)}
                            />
                            <InputError message={errors.fecha_cierre} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider italic">
                            Alcance Técnico / Descripción
                        </label>
                        <textarea
                            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white min-h-[100px] md:min-h-[120px] outline-none focus:ring-1 focus:ring-[#c1f75e] resize-none style-scrollbar"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                        />
                        <InputError message={errors.descripcion} />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-white/5 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white py-3.5 md:py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#c1f75e] hover:text-black hover:border-transparent transition-all shadow-xl disabled:opacity-50 mt-2"
                    >
                        {processing ? 'Guardando...' : 'Actualizar Ficha Técnica'}
                    </button>
                </form>
            </div>
        </div>
    );
}