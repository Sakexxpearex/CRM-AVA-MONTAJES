import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X, ClipboardCheck } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    empresas: any[];
    divisiones: any[];
    personas: any[];
    precalificacionAEditar?: any | null; // 🌟 Nueva Prop para edición
}

export default function PrecalificacionModal({ isOpen, onClose, empresas, divisiones, personas, precalificacionAEditar }: ModalProps) {
    if (!isOpen) return null;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        empresa_id: '',
        division_id: '',
        persona_id: '', 
        nombre_precalificacion: '', 
        monto_estimado: '',
        resumen_visita: '',
    });

    // 🌟 Sincronizar datos si entra en modo Edición o Limpiar si es creación
    useEffect(() => {
        if (isOpen) {
            if (precalificacionAEditar) {
                setData({
                    empresa_id: String(precalificacionAEditar.empresa_id || ''),
                    division_id: String(precalificacionAEditar.division_id || ''),
                    persona_id: String(precalificacionAEditar.persona_id || ''),
                    nombre_precalificacion: precalificacionAEditar.nombre_precalificacion || '',
                    monto_estimado: precalificacionAEditar.monto_estimado || '',
                    resumen_visita: precalificacionAEditar.resumen_visita || '',
                });
            } else {
                reset();
            }
        }
    }, [isOpen, precalificacionAEditar]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (precalificacionAEditar) {
            // Ruta de actualización (PUT)
            put(route('precalificaciones.update', precalificacionAEditar.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            // Ruta de creación (POST)
            post(route('precalificaciones.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const divisionesFiltradas = data.empresa_id
        ? divisiones.filter((d) => String(d.empresa_id) === String(data.empresa_id))
        : [];

    const personasFiltradas = data.empresa_id
        ? personas.filter((p) => {
            const idEmpresaDePersona = p.trabajo_actual?.division?.empresa_id;
            return String(idEmpresaDePersona) === String(data.empresa_id);
        })
        : [];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl overflow-hidden transition-colors duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <ClipboardCheck className="text-[#c1f75e]" size={22} />
                        <h3 className="text-lg font-black tracking-tight text-gray-950 dark:text-white uppercase">
                            {precalificacionAEditar ? 'Editar Precalificación' : 'Nueva Precalificación'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto style-scrollbar">
                    
                    {/* Nombre de la Oportunidad */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">
                            Nombre de la Oportunidad / Proyecto <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Mantención de Plantas Eléctricas Norte"
                            value={data.nombre_precalificacion}
                            onChange={(e) => setData('nombre_precalificacion', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 focus:border-[#c1f75e] focus:ring-0 text-gray-900 dark:text-white rounded-md outline-none transition-all"
                        />
                        {errors.nombre_precalificacion && <p className="text-xs text-rose-500 mt-1">{errors.nombre_precalificacion}</p>}
                    </div>

                    {/* Cliente/Empresa y División */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">
                                Cliente / Empresa <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                value={data.empresa_id}
                                onChange={(e) => setData(old => ({ ...old, empresa_id: e.target.value, division_id: '', persona_id: '' }))}
                                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-[#c1f75e] text-gray-700 dark:text-white rounded-md outline-none"
                            >
                                <option value="">Selecciona una empresa...</option>
                                {empresas.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">
                                División Receptora <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                disabled={!data.empresa_id}
                                value={data.division_id}
                                onChange={(e) => setData('division_id', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-[#c1f75e] text-gray-700 dark:text-white rounded-md outline-none disabled:opacity-50"
                            >
                                <option value="">Selecciona una división...</option>
                                {divisionesFiltradas.map((div) => (
                                    <option key={div.id} value={div.id}>{div.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Contacto y Monto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">
                                Contacto Autorizado / Estratégico
                            </label>
                            <select
                                disabled={!data.empresa_id}
                                value={data.persona_id}
                                onChange={(e) => setData('persona_id', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-[#c1f75e] text-gray-700 dark:text-white rounded-md outline-none disabled:opacity-50"
                            >
                                <option value="">Selecciona un contacto...</option>
                                {personasFiltradas.map((pers) => (
                                    <option key={pers.id} value={pers.id}>
                                        {pers.nombre_1} {pers.apellido_1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">
                                Monto Preliminar Estimado (Opcional)
                            </label>
                            <input
                                type="number"
                                placeholder="$ 0.00"
                                value={data.monto_estimado}
                                onChange={(e) => setData('monto_estimado', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 focus:border-[#c1f75e] text-gray-900 dark:text-white rounded-md outline-none"
                            />
                        </div>
                    </div>

                    {/* Resumen */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider italic mb-1">
                            Minuta / Resumen de Visita a Terreno <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Describe el alcance técnico..."
                            value={data.resumen_visita}
                            onChange={(e) => setData('resumen_visita', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 focus:border-[#c1f75e] text-gray-900 dark:text-white rounded-md outline-none resize-none"
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-md text-xs"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-[#c1f75e] text-black font-black rounded-md text-xs uppercase tracking-wider disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : precalificacionAEditar ? 'Guardar Cambios' : 'Crear Propuesta'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}