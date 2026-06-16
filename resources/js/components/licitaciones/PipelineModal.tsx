import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, TrendingUp, ShieldAlert, CheckCircle, Star } from 'lucide-react';
import InputError from '@/components/input-error';

export default function PipelineModal({ 
    isOpen, 
    onClose, 
    licitacion, 
    empresasCompetencia = [], 
    contactos = [] // Recibimos los contactos asociados a esta licitación
}: any) {
    
    // Estados para la animación de las estrellas
    const [hoverEmpresa, setHoverEmpresa] = useState(0);
    const [hoverPersona, setHoverPersona] = useState(0);

    const { data, setData, patch, post, processing, errors, reset } = useForm({
        estado_pipeline: licitacion?.estado_pipeline || '',
        competencia_ganadora_id: licitacion?.competencia_ganadora_id || '',
        
        // Datos de evaluación Empresa
        estrellas_empresa: 0,
        comentario_empresa: '',
        
        // Datos de evaluación Contacto
        persona_id: '',
        estrellas_persona: 0,
        comentario_persona: '',
    });

    useEffect(() => {
        if (isOpen && licitacion) {
            reset();
            setData('estado_pipeline', licitacion.estado_pipeline);
            setData('competencia_ganadora_id', licitacion.competencia_ganadora_id || '');
            
            // Si la licitación ya tiene un contacto principal asignado, lo preseleccionamos
            if (licitacion.persona_id) {
                setData('persona_id', licitacion.persona_id);
            }
        }
    }, [isOpen, licitacion]);

    // Variables de control semánticas
    const isPerdida = data.estado_pipeline === 'Perdida';
    const isGanada = data.estado_pipeline === 'Adjudicada';
    
    // Determina si el estado seleccionado exige evaluación
    const isEstadoCierre = ['Adjudicada', 'Operativa', 'Perdida', 'Desierta'].includes(data.estado_pipeline);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEstadoCierre) {
            // Ruta para cierres con evaluación
            post(route('licitaciones.cerrar', licitacion.id), {
                onSuccess: () => { onClose(); reset(); },
            });
        } else {
            // Ruta normal para avance en el pipeline
            patch(route('licitaciones.update_pipeline', licitacion.id), {
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    if (!isOpen || !licitacion) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl p-5 md:p-8 shadow-2xl transition-all style-scrollbar">
                
                {/* Cabecera del Modal */}
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${isPerdida ? 'bg-red-500/10 text-red-400' : isGanada ? 'bg-blue-500/10 text-blue-400' : 'bg-[#c1f75e]/10 text-[#c1f75e]'}`}>
                            {isGanada ? <CheckCircle size={18} /> : <TrendingUp size={18} />}
                        </div>
                        <h2 className="text-lg md:text-xl font-black uppercase italic dark:text-white tracking-tighter">
                            {isEstadoCierre ? 'Cerrar Licitacion' : 'Estado del Pipeline'}
                        </h2>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white p-1 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* 1. Selector Principal de Estado */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">Fase de la Licitacion</label>
                        <select 
                            className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white focus:ring-1 focus:ring-[#c1f75e] outline-none cursor-pointer"
                            value={data.estado_pipeline}
                            onChange={e => setData('estado_pipeline', e.target.value)}
                            required
                        >
                            <option value="Evaluacion" className="dark:bg-[#111]">Evaluacion</option>
                            <option value="Preparacion" className="dark:bg-[#111]">Preparacion</option>
                            <option value="Filtro" className="dark:bg-[#111]">Filtro</option>
                            <option value="Presentada" className="dark:bg-[#111]">Presentada</option>
                            <option value="Adjudicada" className="dark:bg-[#111]">Adjudicada</option>
                            <option value="Operativa" className="dark:bg-[#111]">Operativa</option>
                            <option value="Perdida" className="dark:bg-[#111]">Perdida</option>
                            <option value="Desierta" className="dark:bg-[#111]">Desierta</option>
                        </select>
                    </div>

                    {/* 2. Lógica para licitaciones perdidas (Competencia) */}
                    {isPerdida && (
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase italic tracking-wide">
                                <ShieldAlert size={13} /> Competencia Adjudicada
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block">¿Quien gano la licitacion?</label>
                                <select 
                                    className="w-full bg-black border border-red-500/20 rounded-lg text-sm p-3 text-white focus:border-red-500 outline-none cursor-pointer"
                                    value={data.competencia_ganadora_id}
                                    onChange={e => setData('competencia_ganadora_id', e.target.value)}
                                    required={isPerdida}
                                >
                                    <option value="" className="dark:bg-[#111]">Seleccionar competencia...</option>
                                    {empresasCompetencia.map((emp: any) => (
                                        <option key={emp.id} value={emp.id} className="dark:bg-[#111]">{emp.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* 3. Lógica de Evaluación (Solo en Cierre) */}
                    {isEstadoCierre && (
                        <div className="p-4 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl space-y-6 animate-in fade-in zoom-in-95">
                            
                            {/* --- EVALUACIÓN EMPRESA --- */}
                            <div className="space-y-4">
                                <div className="text-center space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                                        Califica a la Empresa
                                    </label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={`empresa-${star}`}
                                                className={`transition-all duration-200 hover:scale-110 ${
                                                    star <= (hoverEmpresa || data.estrellas_empresa) 
                                                        ? "text-yellow-400 drop-shadow-md" 
                                                        : "text-gray-300 dark:text-gray-700"
                                                }`}
                                                onClick={() => setData('estrellas_empresa', star)}
                                                onMouseEnter={() => setHoverEmpresa(star)}
                                                onMouseLeave={() => setHoverEmpresa(0)}
                                            >
                                                <Star fill="currentColor" size={32} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">
                                        Feedback Comercial (Opcional)
                                    </label>
                                    <textarea 
                                        className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white min-h-[60px] outline-none focus:ring-1 focus:ring-[#c1f75e] resize-none"
                                        placeholder="Detalles sobre pagos, procesos, estructura..."
                                        value={data.comentario_empresa}
                                        onChange={e => setData('comentario_empresa', e.target.value)}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-200 dark:border-gray-800" />

                            {/* --- EVALUACIÓN CONTACTO --- */}
                            <div className="space-y-4">
                                <div className="text-center space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block mb-2">
                                        Califica al Contacto Principal
                                    </label>
                                    
                                    <select 
                                        className="w-full max-w-[250px] mx-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-2 mb-3 dark:text-white outline-none focus:ring-1 focus:ring-[#c1f75e] text-center"
                                        value={data.persona_id}
                                        onChange={e => setData('persona_id', e.target.value)}
                                    >
                                        <option value="">Selecciona al contacto...</option>
                                        {contactos.map((contacto: any) => (
                                            <option key={contacto.id} value={contacto.id}>
                                                {contacto.nombre_completo || `${contacto.nombre_1} ${contacto.apellido_1}`}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={`persona-${star}`}
                                                className={`transition-all duration-200 hover:scale-110 ${
                                                    star <= (hoverPersona || data.estrellas_persona) 
                                                        ? "text-yellow-400 drop-shadow-md" 
                                                        : "text-gray-300 dark:text-gray-700"
                                                }`}
                                                onClick={() => setData('estrellas_persona', star)}
                                                onMouseEnter={() => setHoverPersona(star)}
                                                onMouseLeave={() => setHoverPersona(0)}
                                            >
                                                <Star fill="currentColor" size={32} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 ml-1 block tracking-wider">
                                        Feedback Personal (Opcional)
                                    </label>
                                    <textarea 
                                        className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg text-sm p-3 dark:text-white min-h-[60px] outline-none focus:ring-1 focus:ring-[#c1f75e] resize-none"
                                        placeholder="¿Fue receptivo? ¿Agilizo la negociacion?"
                                        value={data.comentario_persona}
                                        onChange={e => setData('comentario_persona', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                        </div>
                    )}

                    {/* Botón de Submit */}
                    <button 
                        type="submit" 
                        disabled={processing}
                        className={`w-full py-3.5 md:py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-40
                            ${isGanada ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                              isPerdida ? 'bg-red-600 text-white hover:bg-red-700' : 
                              'bg-[#c1f75e] text-black hover:bg-[#aee64c]'}
                        `}
                    >
                        {processing ? 'Procesando...' : isEstadoCierre ? 'Confirmar y Cerrar Licitacion' : 'Actualizar Estado'}
                    </button>
                </form>
            </div>
        </div>
    );
}