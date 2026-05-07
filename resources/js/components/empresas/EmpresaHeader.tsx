import { Head} from '@inertiajs/react';
import { Plus } from 'lucide-react';
interface Props {
  onCreate: () => void;
}

export default function EmpresasHeader({ onCreate }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#c1f75e] pl-4 mb-8">
      
      <div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
          Empresas
        </h1>
        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Directorio de clientes y aliados
        </p>
      </div>  

      <button 
        onClick={onCreate}
        className="hidden sm:flex items-center justify-center gap-2 bg-[#c1f75e] text-black font-extrabold text-xs px-5 py-3 rounded hover:bg-[#a2eb07] transition-all shadow-sm uppercase w-full sm:w-auto"
      >
        <Plus size={16} strokeWidth={3} />
        Nueva Empresa
      </button>

    </div>
  );
}