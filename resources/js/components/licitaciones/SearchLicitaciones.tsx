import { Search, X } from 'lucide-react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    estado: string;
    onEstadoChange: (value: string) => void;
    // NUEVO: Props necesarias para renderizar y cambiar el filtro por empresa
    empresas: any[];
    empresa: string;
    onEmpresaChange: (value: string) => void;
    montoOrder: string;
    onMontoOrderChange: (value: string) => void;
    estados: string[];
    onClear: () => void; // <-- Nueva prop para manejar la limpieza
}

export default function SearchLicitaciones({
    value,
    onChange,
    estado,
    onEstadoChange,
    empresas, // NUEVO
    empresa, // NUEVO
    onEmpresaChange, // NUEVO
    montoOrder,
    onMontoOrderChange,
    estados,
    onClear,
}: Props) {
    // Evaluamos lógicamente si hay algún filtro o búsqueda activa
    const hayFiltrosActivos = value !== '' || estado !== '' || montoOrder !== '';

    return (
        <div className="flex w-full max-w-5xl flex-col gap-3 lg:flex-row">
            {/* MODIFICACIÓN DISEÑO: 
                Cambié 'flex-1' por clases responsivas y animadas. En móvil ocupa el 100%. 
                En escritorio (lg) arranca con un tamaño compacto (max-w-[250px]) y cuando 
                se hace foco en él para escribir (focus-within) se expande suavemente hasta ocupar todo el espacio disponible (max-w-[800px]).
                Todo manteniendo el contorno de color #c1f75e original. */}
            <div className="relative w-full lg:flex-1 lg:max-w-[250px] lg:focus-within:max-w-[800px] transition-all duration-500 ease-in-out">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                />

                <input
                    type="text"
                    className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-12 pr-10 text-[11px] font-bold tracking-wider outline-none focus:ring-2 focus:ring-[#c1f75e] transition-all"
                    placeholder="BUSCAR POR NOMBRE O DPC" // Ajuste sutil para recordar el DPC
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                
                {/* Pequeño botón (X) dentro del input para borrar solo el texto rápidamente */}
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Borrar texto"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <select
                className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-[#c1f75e]"
                value={estado}
                onChange={(e) => onEstadoChange(e.target.value)}
            >
                <option value="">Todos los estados</option>

                {estados.map((estado) => (
                    <option key={estado} value={estado}>
                        {estado}
                    </option>
                ))}
            </select>

            {/* NUEVO: Selector de Empresas. Respeta el color de focus #c1f75e general de la aplicación */}
            <select
                className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-[#c1f75e]"
                value={empresa}
                onChange={(e) => onEmpresaChange(e.target.value)}
            >
                <option value="">Todas las empresas</option>
                {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                        {emp.nombre}
                    </option>
                ))}
            </select>

            <select
                className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-[#c1f75e]"
                value={montoOrder}
                onChange={(e) => onMontoOrderChange(e.target.value)}
            >
                <option value="">Orden normal</option>
                <option value="desc">Monto descendente</option>
                <option value="asc">Monto Ascendente</option>
            </select>

            { /* Solo aparece si hay filtros aplicados */ }
            {hayFiltrosActivos && (
                <button
                    onClick={onClear}
                    type="button"
                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg px-4 py-3 text-[11px] font-bold uppercase outline-none focus:ring-2 focus:ring-red-500 transition-colors whitespace-nowrap"
                >
                    Limpiar Filtros
                </button>
            )}
        </div>
    );
}