import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchEmpresa({ value, onChange }: Props) {
  return (
    <div className="relative w-full max-w-2xl">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={16}
      />

      <input
        type="text"
        className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-12 text-[11px] font-bold tracking-wider outline-none focus:ring-2 focus:ring-[#c1f75e] transition-all"
        placeholder="BUSCAR POR NOMBRE O RUT"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}