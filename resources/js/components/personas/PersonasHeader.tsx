import { Plus, Users } from 'lucide-react';

interface Props {
    onCreate: () => void;
}

export default function PersonasHeader({ onCreate }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#c1f75e] pl-4">
            
            {/* Título */}
            <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                    <Users size={20} className="text-[#c1f75e]" />
                    Directorio de Contactos
                </h1>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                    Gestión de capital humano y relaciones
                </p>
            </div>  

            {/* Botón Desktop */}
            <button 
                onClick={onCreate}
                className="hidden md:flex items-center justify-center gap-2 bg-[#c1f75e] text-black font-extrabold text-xs px-5 py-3 rounded hover:bg-[#a2eb07] transition-all uppercase shadow-lg shadow-[#c1f75e]/20"
            >
                <Plus size={16} strokeWidth={3} />
                Nuevo Contacto
            </button>

        </div>
    );
}