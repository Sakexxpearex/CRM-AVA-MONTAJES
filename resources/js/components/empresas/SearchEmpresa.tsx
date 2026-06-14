import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  tipo: string;
  onTipoChange: (value: string) => void;
}

export default function SearchEmpresa({ value, onChange, tipo, onTipoChange }: Props) {
  return (
    <div className="flex w-full flex-col gap-2.5 md:flex-row md:max-w-3xl">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input 
          type="text" 
          className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg py-2.5 pl-11 pr-4 text-[11px] font-bold tracking-wider uppercase outline-none focus:ring-2 focus:ring-[#c1f75e] transition-all text-gray-800 dark:text-white"
          placeholder="BUSCAR POR NOMBRE..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <select
        className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-[#c1f75e] text-gray-800 dark:text-white cursor-pointer"
        value={tipo}
        onChange={(e) => onTipoChange(e.target.value)}
      >
        <option value="">Todas las Categorías</option>
        <option value="Cliente">Cliente</option>
        <option value="Competencia">Competencia</option>
        <option value="Subcontratista">Subcontratista</option>
      </select>
    </div>
  );
}