import { X, LayoutGrid } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    setData: (key: string, value: any) => void;
    submit: (e: React.FormEvent) => void;
    errors: any;
    processing: boolean;
    empresas: any[]; //que empresa pertenece 
    hideEmpresaSelect: boolean
    editingId?: number | null;
}

export default function DivisionModal({ isOpen, onClose, data, setData, submit, errors, processing, empresas, editingId, hideEmpresaSelect }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
                <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors">
                    <X size={20}/>
                </button>

                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3 italic">
                    <LayoutGrid className="text-[#c1f75e]" size={24} /> 
                    {editingId ? 'Editar División' : 'Nueva División'}
                </h2>

                <form onSubmit={submit} className="space-y-5">
                    {/* Selección de empresa */}
                    {!hideEmpresaSelect && (
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">Empresa Matriz</label>
                            <select 
                                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none"
                                value={data.empresa_id}
                                onChange={e => setData('empresa_id', e.target.value)}
                                required
                            >
                                <option value="">Seleccionar empresa...</option>
                                {empresas.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                                ))}
                            </select>
                            {errors.empresa_id && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.empresa_id}</p>}
                        </div>
                    )}

                    {/* Nombre de la división */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">Nombre de la División / Área</label>
                        <input 
                            type="text"
                            placeholder="Ej: Gerencia de IT, Planta Norte..."
                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-[#c1f75e]"
                            value={data.nombre}
                            onChange={e => setData('nombre', e.target.value)}
                            required
                        />
                        {errors.nombre && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.nombre}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-[#c1f75e] text-black py-4 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-[#c1f75e]/10 hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                    >
                        {processing 
                            ? 'Procesando...' 
                            : (editingId ? 'Actualizar División' : 'Confirmar División')
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}