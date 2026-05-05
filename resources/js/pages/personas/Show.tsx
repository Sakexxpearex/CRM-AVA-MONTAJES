import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, Mail, Phone, Linkedin, 
    Building2, Calendar, Briefcase, MessageSquare, 
    ExternalLink, MapPin, Clock
} from 'lucide-react';

interface HistorialLaboral {
    id: number;
    cargo: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    estado_actual: boolean;
    division: {
        nombre: string;
        empresa: { nombre: string };
    };
}

interface Persona {
    id: number;
    rut: string;
    nombre_completo: string;
    email: string;
    telefono: string;
    perfil_linkedin: string;
    trabajo_actual?: HistorialLaboral;
    historial_laboral: HistorialLaboral[];
}

export default function PersonaShow({ persona }: { persona: Persona }) {
    return (
        <AuthenticatedLayout>
            <Head title={`${persona.nombre_completo} - Detalle`} />

            <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-6">
                
                {/* Botón Volver */}
                <Link 
                    href={route('personas.index')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-[#c1f75e] transition-colors text-xs font-black uppercase tracking-widest"
                >
                    <ChevronLeft size={16} /> Volver al listado
                </Link>

                {/* Header Profile Card */}
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar Grande */}
                        <div className="w-24 h-24 bg-gray-900 text-[#c1f75e] rounded-2xl flex items-center justify-center text-3xl font-black border-2 border-gray-800 shadow-2xl">
                            {persona.nombre_completo.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                    {persona.nombre_completo}
                                </h1>
                                <p className="text-gray-500 font-mono text-sm italic">{persona.rut}</p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <a href={`mailto:${persona.email}`} className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#c1f75e] hover:text-black transition-all">
                                    <Mail size={14} /> {persona.email}
                                </a>
                                <a href={`tel:${persona.telefono}`} className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#c1f75e] hover:text-black transition-all">
                                    <Phone size={14} /> {persona.telefono}
                                </a>
                                {persona.perfil_linkedin && (
                                    <a href={persona.perfil_linkedin} target="_blank" className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                                        <Linkedin size={14} /> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <button className="w-full md:w-auto bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:opacity-80 transition-opacity">
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Columna Izquierda: Info Laboral Actual */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <Briefcase size={14} /> Trayectoria Laboral
                            </h3>

                            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
                                {persona.historial_laboral.map((empleo, idx) => (
                                    <div key={idx} className="relative pl-12">
                                        {/* Punto de la línea de tiempo */}
                                        <div className={`absolute left-0 top-1 w-[36px] h-[36px] rounded-full flex items-center justify-center border-4 border-white dark:border-[#111] z-10 ${empleo.estado_actual ? 'bg-[#c1f75e] text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                            <Building2 size={16} />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div>
                                                <h4 className="font-black text-sm uppercase dark:text-white">
                                                    {empleo.cargo}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 font-bold">
                                                    {empleo.division.empresa.nombre} — <span className="text-xs font-normal">{empleo.division.nombre}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase ${empleo.estado_actual ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Clock size={12} />
                                                    {empleo.fecha_inicio} - {empleo.estado_actual ? 'Actualidad' : empleo.fecha_fin}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Columna Derecha: Notas y Actividad */}
                    <div className="space-y-6">
                        <section className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <MessageSquare size={14} /> Notas Recientes
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-[#c1f75e] transition-all cursor-pointer group">
                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                        "Se conversó sobre el nuevo proyecto de la zona sur. Quedó de enviar los planos el viernes."
                                    </p>
                                    <div className="mt-3 text-[10px] font-black uppercase text-gray-400 group-hover:text-black dark:group-hover:text-white">
                                        12 Mayo, 2024
                                    </div>
                                </div>

                                <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:border-[#c1f75e] hover:text-[#c1f75e] transition-all">
                                    + Añadir Nota
                                </button>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}