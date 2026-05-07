import { Building2, Briefcase, FileText, Users, Trash2, Edit3, ChevronRight } from 'lucide-react';

interface Empresa {
  id: number;
  nombre: string;
  rut: string;
  tipo: 'Cliente' | 'Competencia' | 'Subcontratista';
}

const tipoConfig = {
  Cliente: { icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
  Competencia: { icon: Briefcase, color: 'text-red-600', bgColor: 'bg-red-50' },
  Subcontratista: { icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
};

interface Props {
  empresas: Empresa[];
  onEdit: (empresa: Empresa) => void;
  onDelete: (id: number) => void;
}

export default function EmpresasTable({ empresas, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-4">
      {/* Vista mobile */}
      <div className="md:hidden space-y-3 pb-24">
        {empresas.length > 0 ? (
          empresas.map((empresa) => {
            const config = tipoConfig[empresa.tipo] || tipoConfig.Cliente;
            return (
              <div 
                key={empresa.id}
                className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 text-[#C1F75E] rounded-xl flex items-center justify-center border border-gray-700">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase leading-tight">
                        {empresa.nombre}
                      </h3>
                      <p className="text-[10px] font-mono text-gray-500 mt-0.5 italic">{empresa.rut}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${config.bgColor} ${config.color} dark:bg-opacity-10`}>
                    {empresa.tipo}
                  </span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => onEdit(empresa)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-white/5 rounded-lg text-[10px] font-black uppercase text-gray-600 dark:text-gray-400"
                  >
                    <Edit3 size={14} /> Editar
                  </button>
                  <button 
                    onClick={() => onDelete(empresa.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-[10px] font-black uppercase text-red-600"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            No hay registros
          </div>
        )}
      </div>

      {/* Vista pc */}
      <div className="hidden md:block bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4 text-center">RUT</th>
                <th className="px-6 py-4 text-center">Categoría</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {empresas.map((empresa) => {
                const config = tipoConfig[empresa.tipo] || tipoConfig.Cliente;
                return (
                  <tr key={empresa.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-[#1A1A1A] rounded flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-[#C1F75E] transition-all">
                          <Building2 size={16} />
                        </div>
                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase">{empresa.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center font-mono text-xs text-gray-500 italic uppercase">{empresa.rut}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase ${config.bgColor} ${config.color} dark:bg-opacity-10`}>
                        <config.icon size={12} strokeWidth={3} /> {empresa.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(empresa)} className="p-2 text-gray-400 hover:text-black dark:hover:text-[#C1F75E] transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => onDelete(empresa.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}