import React, { useState, useEffect } from 'react';
import { Building2, ArrowRight, FileText } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { 
    DndContext, 
    useDroppable, 
    useDraggable,
    PointerSensor, 
    useSensor, 
    useSensors, 
    DragEndEvent,
    pointerWithin
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import EstadoBadge from './EstadoBadge';


const COLUMNAS = [
    { id: 'Evaluación', titulo: 'Evaluación', color: 'border-t-blue-500 text-blue-500 bg-blue-500/5' },
    { id: 'Preparación', titulo: 'Preparación', color: 'border-t-orange-500 text-orange-500 bg-orange-500/5' },
    { id: 'Presentada', titulo: 'Presentada', color: 'border-t-cyan-500 text-cyan-500 bg-cyan-500/5' },
    { id: 'Perdida', titulo: 'Perdida', color: 'border-t-red-500 text-red-500 bg-red-500/5' },
    { id: 'Adjudicada', titulo: 'Adjudicada / Ganada', color: 'border-t-emerald-500 text-emerald-500 bg-emerald-500/5' } // 🌟 Estilizado completo
];

// Subcomponente para las tarjetas
function TarjetaLicitacion({ lic, formatMoney, estadoActual }: { lic: any; formatMoney: Function; estadoActual: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: lic.id.toString(),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : undefined, 
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`block bg-white dark:bg-[#141414] border rounded-xl p-4 group cursor-grab active:cursor-grabbing select-none transition-shadow ${
                isDragging 
                    ? 'border-blue-500 dark:border-[#c1f75e] shadow-2xl z-50 scale-[1.02]' 
                    : 'border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-md'
            }`}
        >
            <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-mono text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                    ID: #{lic.id}
                </span>
                <EstadoBadge estado={estadoActual} />
            </div>

            <Link href={route('licitaciones.show', lic.id)} data-no-drag>
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-[#c1f75e] transition-colors line-clamp-2 mb-4">
                    {lic.nombre_proyecto}
                </h3>
            </Link>

            <div className="space-y-1.5 border-t border-slate-50 dark:border-gray-800/50 pt-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-gray-400">
                    <Building2 size={11} className="text-slate-400 dark:text-gray-600 shrink-0" />
                    <span className="truncate font-bold uppercase">{lic.empresa?.nombre || 'S/N'}</span>
                </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-50 dark:border-gray-800/30 flex justify-between items-center">
                <div className="text-[11px] font-mono font-black tracking-tight text-slate-900 dark:text-white">
                    {formatMoney(lic.monto_estimado)}
                </div>
                <Link href={route('licitaciones.show', lic.id)} data-no-drag className="p-1 text-slate-400 dark:text-gray-600 group-hover:text-slate-800 dark:group-hover:text-[#c1f75e] transition-colors">
                    <ArrowRight size={12} />
                </Link>
            </div>
        </div>
    );
}

// Subcomponente para las columnas
function ColumnaDroppable({ columna, children, tarjetasColumna, formatMoney }: { columna: any; children: React.ReactNode; tarjetasColumna: any[]; formatMoney: Function }) {
    const { setNodeRef, isOver } = useDroppable({
        id: columna.id,
    });

    const totalMonto = tarjetasColumna.reduce((sum, lic) => sum + (parseFloat(lic.monto_estimado) || 0), 0);

    return (
        <div className="bg-white dark:bg-[#111] border border-slate-100 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col min-h-[500px] shadow-sm">
            {/* Cabecera */}
            <div className={`border-t-4 ${columna.color} p-4 flex flex-col gap-1 border-b border-slate-100 dark:border-gray-800 bg-slate-50/30 dark:bg-white/[0.01]`}>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-gray-300">
                        {columna.titulo}
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full font-black text-slate-500 dark:text-gray-400">
                        {tarjetasColumna.length}
                    </span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-[#c1f75e] font-mono mt-0.5">
                    {formatMoney(totalMonto)}
                </span>
            </div>

            {/* Cuerpo receptor (Modificado con min-h-[400px] para asegurar el área de colisión) */}
            <div 
                ref={setNodeRef}
                className={`p-3 space-y-3 max-h-[65vh] min-h-[400px] h-full overflow-y-auto flex-1 transition-colors duration-150 ${
                    isOver ? 'bg-slate-50/50 dark:bg-white/[0.02]' : 'bg-white dark:bg-transparent'
                }`}
            >
                {children}
            </div>
        </div>
    );
}

// Componente principal
export default function LicitacionesKanban({ licitaciones = [] }: { licitaciones: any[] }) {
    const [localLicitaciones, setLocalLicitaciones] = useState(licitaciones);

    useEffect(() => {
        setLocalLicitaciones(licitaciones);
    }, [licitaciones]);

    // Evita que los clics normales o scroll de página activen un "arrastre accidental"
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Tienes que mover el mouse 8 pixeles antes de empezar a arrastrar
            },
        })
    );

    const formatMoney = (val: any) => {
        const num = parseFloat(val);
        return isNaN(num) ? '$ 0' : new Intl.NumberFormat('es-CL', { 
            style: 'currency', currency: 'CLP', maximumFractionDigits: 0 
        }).format(num);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Si se soltó fuera de una columna válida, no hacemos nada
        if (!over) return;

        const licitacionId = parseInt(active.id as string);
        const nuevoEstado = over.id as string;

        // Buscamos la tarjeta en nuestro estado local
        const licitacionClave = localLicitaciones.find(l => l.id === licitacionId);
        
        // Si la tarjeta no existe o se soltó en la misma columna donde ya estaba, cancelamos
        if (!licitacionClave || licitacionClave.estado_pipeline === nuevoEstado) return;

        // 1. REACCIÓN OPTIMISTA: Movemos la tarjeta de inmediato en interfaz
        setLocalLicitaciones(prev => prev.map(lic => 
            lic.id === licitacionId ? { ...lic, estado_pipeline: nuevoEstado } : lic
        ));

        // 2. PERSISTENCIA REAL: Cambiamos el estado en la base de datos a través de Laravel
        router.put(route('licitaciones.updatePipeline', licitacionId), {
            estado_pipeline: nuevoEstado
        }, {
            preserveScroll: true, // Evita saltos raros de scroll si la página es larga
            onError: () => {
                // Si se rechaza el cambio, se devuelve automáticamente la tarjeta a su columna de origen
                setLocalLicitaciones(licitaciones);
            }
        });
    };

    return (
        // 🌟 Cambiado a closestPointer para máxima precisión táctil y de cursor
        <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
            {/* 🌟 Grid adaptativo: muta a 5 columnas en monitores grandes (xl) para calzar el pipeline completo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-start bg-slate-50/50 dark:bg-transparent p-1 rounded-2xl">
                {COLUMNAS.map((columna) => {
                    const tarjetasColumna = localLicitaciones.filter(lic => lic.estado_pipeline === columna.id);

                    return (
                        <ColumnaDroppable 
                            key={columna.id} 
                            columna={columna} 
                            tarjetasColumna={tarjetasColumna} 
                            formatMoney={formatMoney}
                        >
                            {tarjetasColumna.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 dark:border-gray-800 rounded-xl p-4 m-1">
                                    <FileText size={16} className="text-slate-300 dark:text-gray-700 mb-2" />
                                    <span className="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">Sin Registros</span>
                                </div>
                            ) : (
                                tarjetasColumna.map((lic) => (
                                    <TarjetaLicitacion 
                                        key={lic.id} 
                                        lic={lic} 
                                        formatMoney={formatMoney} 
                                        estadoActual={lic.estado_pipeline}
                                    />
                                ))
                            )}
                        </ColumnaDroppable>
                    );
                })}
            </div>
        </DndContext>
    );
}