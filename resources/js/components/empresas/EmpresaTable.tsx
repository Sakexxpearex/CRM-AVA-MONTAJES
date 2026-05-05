import { Building2, Briefcase, FileText, Users, Trash2, Edit3 } from 'lucide-react';

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
    
    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          
          {/* Header */}
          <thead>
            <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <th className="px-6 py-4">Empresa</th>
              <th className="px-6 py-4 text-center">RUT</th>
              <th className="px-6 py-4 text-center">Categoría</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          {/* Tabla */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {empresas.length > 0 ? (
              empresas.map((empresa) => {
                const config = tipoConfig[empresa.tipo] || tipoConfig.Cliente;

                return (
                  <tr
                    key={empresa.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    
                    {/* Nombre */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-[#1A1A1A] rounded flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-[#C1F75E] transition-all">
                          <Building2 size={16} />
                        </div>
                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200 uppercase">
                          {empresa.nombre}
                        </span>
                      </div>
                    </td>

                    {/* RUT */}
                    <td className="px-6 py-3 text-center font-mono text-xs text-gray-500 italic uppercase">
                      {empresa.rut}
                    </td>

                    {/* Tipo */}
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase ${config.bgColor} ${config.color} dark:bg-opacity-10`}
                      >
                        <config.icon size={12} strokeWidth={3} />
                        {empresa.tipo}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        <button
                          onClick={() => onEdit(empresa)}
                          className="p-2 text-gray-400 hover:text-black dark:hover:text-[#C1F75E] transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          onClick={() => onDelete(empresa.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
                >
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}