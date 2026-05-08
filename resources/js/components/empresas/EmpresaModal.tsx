import { X, LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';

interface EmpresaForm {
  nombre: string;
  rut: string;
  tipo: 'Cliente' | 'Competencia' | 'Subcontratista';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: EmpresaForm;
  setData: (key: keyof EmpresaForm, value: any) => void;
  submit: (e: React.FormEvent) => void;
  errors: any;
  processing: boolean;
  editingId: number | null;
  handleRutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function EmpresaModal({
  isOpen,
  onClose,
  data,
  setData,
  submit,
  errors,
  processing,
  editingId,
  handleRutChange,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-[#111] w-full max-w-md rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white">
            {editingId ? 'Actualizar Empresa' : 'Nuevo Registro'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          
          {/* RUT */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">
              RUT Empresa
            </label>
            <input
              type="text"
              value={data.rut}
              onChange={handleRutChange}
              className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#C1F75E] transition-all"
              placeholder="12.345.678-9"
              required
              maxLength={12}
            />
            <InputError message={errors.rut} />
          </div>

          {/* Nombre */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">
              Nombre Comercial
            </label>
            <input
              type="text"
              value={data.nombre}
              onChange={(e) => setData('nombre', e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#C1F75E] transition-all"
              required
            />
            <InputError message={errors.nombre} />
          </div>

          {/* Tipo */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">
              Categoría
            </label>
            <select
              value={data.tipo}
              onChange={(e) => setData('tipo', e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#C1F75E] transition-all"
            >
              <option value="Cliente">Cliente</option>
              <option value="Competencia">Competencia</option>
              <option value="Subcontratista">Subcontratista</option>
            </select>
          </div>

          {/* Enviar */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-[#C1F75E] text-black font-black py-4 rounded-lg uppercase text-xs tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : editingId ? (
              'Actualizar Datos'
            ) : (
              'Guardar en Sistema'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}