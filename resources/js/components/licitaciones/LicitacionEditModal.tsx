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
        nombre_proyecto: licitacion.nombre_proyecto || '',
        empresa_id: licitacion.empresa_id || '',
        division_id: licitacion.division_id || '',
        monto_estimado: licitacion.monto_estimado || '',
        descripcion: licitacion.descripcion || '',
        fecha_cierre: licitacion.fecha_cierre || '',
    });

    useEffect(() => {
        if (isOpen) {
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

    if (!isOpen) return null;

    const divisionesFiltradas =
        divisiones?.filter((division: any) => division.empresa_id == data.empresa_id) || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-2xl rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#c1f75e]/20 text-[#c1f75e] rounded-lg">
                            <Settings size={20} />
                        </div>

                        <h2 className="text-xl font-black uppercase italic dark:text-white tracking-tighter">
                            Editar Ficha de Licitación
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1">
                            Nombre del Proyecto
                        </label>

                        <input
                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none"
                            value={data.nombre_proyecto}
                            onChange={(e) => setData('nombre_proyecto', e.target.value)}
                            required
                        />

                        <InputError message={errors.nombre_proyecto} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-gray-500 ml-1">
                                Empresa Cliente
                            </label>

                            <select
                                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none"
                                value={data.empresa_id}
                                onChange={(e) => handleEmpresaChange(e.target.value)}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {empresas.map((empresa: any) => (
                                    <option key={empresa.id} value={empresa.id}>
                                        {empresa.nombre}
                                    </option>
                                ))}
                            </select>

                            <InputError message={errors.empresa_id} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-gray-500 ml-1">
                                División / Área
                            </label>

                            <select
                                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none"
                                value={data.division_id}
                                onChange={(e) => setData('division_id', e.target.value)}
                                required
                                disabled={!data.empresa_id}
                            >
                                <option value="">Seleccionar...</option>
                                {divisionesFiltradas.map((division: any) => (
                                    <option key={division.id} value={division.id}>
                                        {division.nombre}
                                    </option>
                                ))}
                            </select>

                            <InputError message={errors.division_id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-gray-500 ml-1">
                                Monto Estimado (CLP)
                            </label>

                            <input
                                type="number"
                                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none"
                                value={data.monto_estimado}
                                onChange={(e) => setData('monto_estimado', e.target.value)}
                            />

                            <InputError message={errors.monto_estimado} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-gray-500 ml-1">
                                Fecha de Cierre Estimada
                            </label>

                            <input
                                type="date"
                                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none"
                                value={data.fecha_cierre}
                                onChange={(e) => setData('fecha_cierre', e.target.value)}
                            />

                            <InputError message={errors.fecha_cierre} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest italic">
                            Alcance Técnico / Descripción
                        </label>

                        <textarea
                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white min-h-[120px] outline-none focus:ring-1 focus:ring-[#c1f75e]"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                        />

                        <InputError message={errors.descripcion} />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-white/5 border border-gray-800 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#c1f75e] hover:text-black transition-all shadow-xl disabled:opacity-50 mt-4"
                    >
                        {processing ? 'Guardando...' : 'Actualizar Ficha Técnica'}
                    </button>
                </form>
            </div>
        </div>
    );
}