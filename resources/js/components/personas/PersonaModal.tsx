import { X, LoaderCircle, Briefcase, Users, Linkedin } from 'lucide-react';
import InputError from '@/components/input-error';
import { useEffect } from 'react';
import { formatRut } from '@/utils/formatters';

interface Division {
    id: number;
    nombre: string;
    empresa: { id: number; nombre: string };
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    setData: any;
    submit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: any;
    divisiones: Division[];
    editingId: number | null;
    isLimited?: boolean; // Nueva propiedad para modo "Editar Perfil"
}

export default function PersonaModal({
    isOpen,
    onClose,
    data,
    setData,
    submit,
    processing,
    errors,
    divisiones = [],
    editingId,
    isLimited = false // Por defecto es false (modo normal)
}: Props) {

    const getPhoneDigits = (value: string) => {
        const cleaned = String(value || '').replace(/\D/g, '');
        return cleaned.startsWith('56') ? cleaned.slice(2, 11) : cleaned.slice(0, 9);
    };

    useEffect(() => {
        if (data.division_id && !isLimited) {
            const divSeleccionada = divisiones.find(d => d.id === parseInt(data.division_id));
            if (divSeleccionada) {
                setData('empresa_id', divSeleccionada.empresa.id);
            }
        }
    }, [data.division_id]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#111] w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-y-auto max-h-[95vh]">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-2 italic">
                        <Users size={20} className="text-[#c1f75e]" />
                        {isLimited
                            ? 'Editar Perfil Detallado'
                            : (editingId ? 'Editar Contacto' : 'Nuevo Contacto')}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-4 md:space-y-6">

                    {/* Rut */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
                            RUT (ID único)
                        </label>
                        <input
                            type="text"
                            value={data.rut}
                            onChange={e => setData('rut', formatRut(e.target.value))}
                            maxLength={12}
                            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#c1f75e]"
                            placeholder="12.345.678-K"
                            required
                        />
                        <InputError message={errors.rut} />
                    </div>

                    {/* Nombres */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Primer Nombre</label>
                            <input
                                type="text"
                                value={data.nombre_1}
                                onChange={e => setData('nombre_1', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                                placeholder="Obligatorio"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block italic text-gray-600">Segundo Nombre</label>
                            <input
                                type="text"
                                value={data.nombre_2}
                                onChange={e => setData('nombre_2', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                                placeholder="Obligatorio"
                                required
                            />
                        </div>
                    </div>

                    {/* Apellidos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Apellido Paterno</label>
                            <input
                                type="text"
                                value={data.apellido_1}
                                onChange={e => setData('apellido_1', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                                placeholder="Obligatorio"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Apellido Materno</label>
                            <input
                                type="text"
                                value={data.apellido_2}
                                onChange={e => setData('apellido_2', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                                placeholder="Obligatorio"
                                required
                            />
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
                                Email Corporativo
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
                                Teléfono
                            </label>
                            <input
                                type='tel'
                                inputMode='numeric'
                                maxLength={9}
                                value={getPhoneDigits(data.telefono)}
                                onChange={e => setData('telefono', e.target.value)}
                                placeholder='91234567'
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                            />
                        </div>
                    </div>

                    {/* Solo en perfil (isLimited) */}
                    {isLimited && (
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block flex items-center gap-1">
                                <Linkedin size={10} /> Perfil LinkedIn
                            </label>
                            <input
                                type="url"
                                placeholder="https://linkedin.com/in/usuario"
                                value={data.perfil_linkedin || ''}
                                onChange={e => setData('perfil_linkedin', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                            />
                        </div>
                    )}

                    {/* Info laboral (!isLimited) */}
                    {!isLimited && (
                        <div className="bg-gray-50 dark:bg-[#0A0A0A] p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">

                            <h3 className="text-[10px] font-black text-[#c1f75e] uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={12} />
                                Vinculación Laboral Inmediata
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block italic">Empresa - División</label>
                                    <select
                                        value={data.division_id}
                                        onChange={e => setData('division_id', e.target.value)}
                                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                                        required
                                    >
                                        <option value="">Seleccione División...</option>
                                        {(divisiones || []).map(div => (
                                            <option key={div.id} value={div.id}>
                                                {div.empresa?.nombre} - {div.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.empresa_id} />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block italic">Cargo Actual</label>
                                    <input
                                        type="text"
                                        value={data.cargo_actual} // Sincronizado con el controlador
                                        onChange={e => setData('cargo_actual', e.target.value)}
                                        className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e]"
                                        placeholder="Ej: Gerente de Operaciones"
                                        required
                                    />
                                    <InputError message={errors.cargo_actual} />
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Enviar */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#c1f75e] text-black font-black py-4 rounded-xl uppercase text-xs tracking-widest hover:brightness-95 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c1f75e]/20"
                    >
                        {processing ? (
                            <LoaderCircle className="animate-spin" size={16} />
                        ) : (
                            isLimited || editingId ? "Actualizar Perfil" : "Registrar Persona y Trabajo"
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}