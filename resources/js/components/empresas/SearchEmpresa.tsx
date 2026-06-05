import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  tipo: string;
  onTipoChange: (value: string) => void;
}

export default function SearchEmpresa({ value, onChange, tipo, onTipoChange }: Props) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-3 md:flex-row">
      <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input type="text" 
      className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-12 text-[11px] font-bold tracking-wider outline-none focus:ring-2 focus:ring-[#c1f75e] transition-all"
      placeholder="BUSCAR POR NOMBRE"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      />
      </div>

      <select
        className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-[#c1f75e]"
        value={tipo}
        onChange={(e) => onTipoChange(e.target.value)}>
          <option value="">Todos</option>
          <option value="Cliente">Cliente</option>
          <option value="Competencia">Competencia</option>
          <option value="Subcontratista">Subcontratista</option>
        </select>
    </div>
  );
}