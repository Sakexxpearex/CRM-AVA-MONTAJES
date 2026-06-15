import { Search, X } from 'lucide-react';

// Datos que se traen del index
interface Props {
    value: string; // El texto actual que esta escrito en la barra de búsqueda
    onChange: (value: string) => void; // Funcion que avisa cuando el usuario ingresa algo nuevo
    estado: string; // El valor actual seleccionado en el filtro del estado
    onEstadoChange: (value: string) => void; // Funcion que avisa cuando el usuario elige otro estado
    // Props necesarias para renderizar y cambiar el filtro por empresa
    empresas: any[]; // Lista completa de empresas (viene de la BD)
    empresa: string; // El ID de la empresa que esta en el momento seleccionada en el filtro
    onEmpresaChange: (value: string) => void; // Funcion que avisa cuando se selecciona una empresa distinta
    montoOrder: string; // El orden actual del monto
    onMontoOrderChange: (value: string) => void; // Funcion que avisa cuando cambian el orden
    estados: string[]; // Lista de todos los estados posibles del pipeline para poblar su respectivo <select>
    onClear: () => void; // Función que avisa al padre que el usuario hizo clic en el botón "X" para limpiar los filtros
}

// Renderiza la interfaz grafica 
export default function SearchLicitaciones({
    value,
    onChange,
    estado,
    onEstadoChange,
    empresas, 
    empresa, 
    onEmpresaChange, 
    montoOrder,
    onMontoOrderChange,
    estados,
    onClear,
}: Props) {
    // Pregunta si hay algún filtro o busqueda activa
    const hayFiltrosActivos = value !== '' || estado !== '' || montoOrder !== '' || empresa !== '';

    return (
        <div className="flex w-full max-w-5xl flex-col gap-3 lg:flex-row">
            <div className="relative w-full lg:flex-1 transition-all duration-500 ease-in-out">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                />

                <input
                    type="text"
                    className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-12 pr-10 text-[11px] font-bold tracking-wider outline-none focus:ring-2 focus:ring-[#c1f75e] transition-all"
                    placeholder="BUSCAR POR DPC O NOMBRE"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                
                {/*Boton que borra el texto */}
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
                <option value="">Por defecto</option>
                <option value="desc">Monto descendente</option>
                <option value="asc">Monto Ascendente</option>
            </select>

            { /* Solo aparece si hay filtros aplicados */ }
            {hayFiltrosActivos && (
                <button
                    onClick={onClear}
                    type="button"
                    title="Limpiar Filtros"
                    className="flex items-center justify-center shrink-0 w-11 h-11 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}