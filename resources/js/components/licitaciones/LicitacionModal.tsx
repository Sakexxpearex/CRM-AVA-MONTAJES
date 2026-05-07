import { useForm } from '@inertiajs/react';
import { X, Briefcase, Building2, DollarSign, Calendar } from 'lucide-react';

export default function LicitacionModal({ isOpen, onClose, empresas, divisiones }: any) {
    if (!isOpen) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        empresa_id: '',
        division_id: '',
        nombre_proyecto: '',
        estado_pipeline: 'Prospecto',
        monto_estimado: '',
        descripcion: '',
        fecha_cierre: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('licitaciones.store'), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#c1f75e]">Nueva Licitación</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Nombre del Proyecto</label>
                            <input 
                                className="w-full bg-black/20 border-gray-800 rounded-xl text-sm text-white focus:border-[#c1f75e] transition-all"
                                value={data.nombre_proyecto}
                                onChange={e => setData('nombre_proyecto', e.target.value)}
                            />
                            {errors.nombre_proyecto && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.nombre_proyecto}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Empresa</label>
                            <select 
                                className="w-full bg-black/20 border-gray-800 rounded-xl text-sm text-white focus:border-[#c1f75e]"
                                value={data.empresa_id}
                                onChange={e => setData('empresa_id', e.target.value)}
                            >
                                <option value="">Seleccionar...</option>
                                {empresas.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">División</label>
                            <select 
                                className="w-full bg-black/20 border-gray-800 rounded-xl text-sm text-white focus:border-[#c1f75e]"
                                value={data.division_id}
                                onChange={e => setData('division_id', e.target.value)}
                            >
                                <option value="">Seleccionar...</option>
                                {divisiones.map((div: any) => <option key={div.id} value={div.id}>{div.nombre}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Monto Estimado</label>
                            <input 
                                type="number"
                                className="w-full bg-black/20 border-gray-800 rounded-xl text-sm text-white focus:border-[#c1f75e]"
                                value={data.monto_estimado}
                                onChange={e => setData('monto_estimado', e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Fecha Cierre</label>
                            <input 
                                type="date"
                                className="w-full bg-black/20 border-gray-800 rounded-xl text-sm text-white focus:border-[#c1f75e]"
                                value={data.fecha_cierre}
                                onChange={e => setData('fecha_cierre', e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-[#c1f75e] text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-[#c1f75e]/10"
                    >
                        {processing ? 'Guardando...' : 'Registrar Licitación'}
                    </button>
                </form>
            </div>
        </div>
    );
}