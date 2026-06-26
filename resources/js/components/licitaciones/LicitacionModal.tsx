import { useForm } from '@inertiajs/react';
import { X, Briefcase, DollarSign, Calendar, FileText, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LicitacionModal({ isOpen, onClose, empresas, divisiones }: any) {
    const [divisionesFiltradas, setDivisionesFiltradas] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        empresa_id: '',
        division_id: '',
        nombre_proyecto: '',
        estado_pipeline: 'Evaluación',
        monto_estimado: '',
        descripcion: '',
        fecha_cierre: '',
        certidumbre: '', // <--- Aquí ya lo tenías
    });

    useEffect(() => {
        if (data.empresa_id) {
            const filtradas = divisiones.filter(
                (div: any) => div.empresa_id === parseInt(data.empresa_id)
            );
            setDivisionesFiltradas(filtradas);
        }
    }, [data.empresa_id]);

    if (!isOpen) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('licitaciones.store'), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            
            {/* Cerrar */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Contenedor modal */}
            <div className="relative bg-white dark:bg-[#111] w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-y-auto max-h-[95vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-2">
                        <Briefcase size={20} className="text-[#c1f75e]" />
                        Nueva Licitación
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    
                    {/* Nombre del proyecto */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block tracking-widest">
                            Nombre del Proyecto
                        </label>
                        <input 
                            type="text"
                            required
                            placeholder="Ej: Mantención Planta Concentradora"
                            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#c1f75e] transition-all"
                            value={data.nombre_proyecto}
                            onChange={e => setData('nombre_proyecto', e.target.value)}
                        />
                        {errors.nombre_proyecto && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.nombre_proyecto}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Empresa */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block tracking-widest italic">
                                Empresa Mandante
                            </label>
                            <select 
                                required
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white focus:ring-2 focus:ring-[#c1f75e] outline-none disabled:opacity-30"
                                value={data.empresa_id}
                                onChange={e => setData('empresa_id', e.target.value)}
                            >
                                <option value="" className="dark:bg-[#111]">Seleccionar Empresa...</option>
                                {empresas
                                    .filter((emp: any) => emp.tipo === 'Cliente')
                                    .map((emp: any) => (
                                        <option key={emp.id} value={emp.id} className="dark:bg-[#111]">
                                            {emp.nombre}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* División */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block tracking-widest italic">
                                División / Faena
                            </label>
                            <select 
                                required
                                disabled={!data.empresa_id}
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white focus:ring-2 focus:ring-[#c1f75e] outline-none disabled:opacity-30"
                                value={data.division_id}
                                onChange={e => setData('division_id', e.target.value)}
                            >
                                <option value="" className="dark:bg-[#111]">Seleccionar División...</option>
                                {divisionesFiltradas.map((div: any) => (
                                    <option key={div.id} value={div.id} className="dark:bg-[#111]">{div.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Monto */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block tracking-widest">
                                <DollarSign size={10} className="inline mr-1" /> Monto Estimado (CLP)
                            </label>
                            <input 
                                type="number"
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white focus:ring-2 focus:ring-[#c1f75e] font-mono"
                                value={data.monto_estimado}
                                onChange={e => setData('monto_estimado', e.target.value)}
                            />
                        </div>
                        
                        {/* Estado */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 italic">Estado en Pipeline</label>
                            <select 
                                required
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white focus:ring-2 focus:ring-[#c1f75e] outline-none"
                                value={data.estado_pipeline}
                                onChange={e => setData('estado_pipeline', e.target.value)}
                            >
                                <option value="Evaluación">Evaluación</option>
                                <option value="Preparación">Preparación</option>
                                <option value="Adjudicada">Adjudicada</option>
                                <option value="Perdida">Perdida</option>
                                <option value="Desierta">Desierta</option>
                                <option value="Presentada">Presentada</option>
                            </select>
                        </div>
                        
                        {/* Fecha de cierre */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block tracking-widest">
                                <Calendar size={10} className="inline mr-1" /> Fecha Estimada Cierre
                            </label>
                            <input 
                                type="date"
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white focus:ring-2 focus:ring-[#c1f75e]"
                                value={data.fecha_cierre}
                                onChange={e => setData('fecha_cierre', e.target.value)}
                            />
                        </div>

                        {/* NUEVO: Certidumbre (Agregado a la grilla) */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block tracking-widest flex items-center gap-1">
                                <Target size={10} className="inline" /> Nivel Certidumbre
                            </label>
                            <select 
                                required
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white focus:ring-2 focus:ring-[#c1f75e] outline-none"
                                value={data.certidumbre}
                                onChange={e => setData('certidumbre', e.target.value)}
                            >
                                <option value="" disabled className="dark:bg-[#111]">Seleccionar...</option>
                                <option value="C1">C1 - Alta Probabilidad</option>
                                <option value="C2">C2 - Probabilidad Media</option>
                                <option value="C3">C3 - Baja Probabilidad</option>
                            </select>
                            {errors.certidumbre && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.certidumbre}</p>}
                        </div>
                    </div>

                    {/* Descripción*/}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block tracking-widest flex items-center gap-2">
                            <FileText size={12} /> Breve Descripción del Alcance
                        </label>
                        <textarea 
                            rows={4}
                            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white focus:ring-2 focus:ring-[#c1f75e] resize-none"
                            value={data.descripcion}
                            onChange={e => setData('descripcion', e.target.value)}
                        />
                    </div>

                    {/* Enviar*/}
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-[#c1f75e] text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[#c1f75e]/20 flex items-center justify-center gap-2"
                    >
                        {processing ? 'Procesando...' : 'Registrar Licitación'}
                    </button>
                </form>
            </div>
        </div>
    );
}