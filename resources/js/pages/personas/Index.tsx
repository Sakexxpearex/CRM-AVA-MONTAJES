import AuthenticatedLayout from '@/layouts/authenticated/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Users, Plus, Search, X, LoaderCircle, Trash2, Edit3, 
    Mail, Phone, Linkedin, Building
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';

// Definimos la interface según tu modelo de PHP
interface Persona {
    id: number;
    rut: string;
    nombre_1: string;
    nombre_2: string;
    apellido_1: string;
    apellido_2: string;
    email: string;
    telefono: string;
    perfil_linkedin: string;
    nombre_completo: string; // Accessor de PHP
    trabajo_actual?: {
        division: {
            nombre: string;
            empresa: { nombre: string };
        };
        cargo: string;
    };
}

export default function PersonasIndex({ personas }: { personas: Persona[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        rut: '',
        nombre_1: '',
        nombre_2: '',
        apellido_1: '',
        apellido_2: '',
        email: '',
        telefono: '',
        perfil_linkedin: '',
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        reset();
    };

    const openEditModal = (persona: Persona) => {
        setEditingId(persona.id);
        setData({
            rut: persona.rut,
            nombre_1: persona.nombre_1,
            nombre_2: persona.nombre_2 || '',
            apellido_1: persona.apellido_1,
            apellido_2: persona.apellido_2 || '',
            email: persona.email,
            telefono: persona.telefono,
            perfil_linkedin: persona.perfil_linkedin || '',
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('personas.update', editingId), { onSuccess: () => closeModal() });
        } else {
            post(route('personas.store'), { onSuccess: () => closeModal() });
        }
    };

    const personasFiltradas = personas.filter(p => 
        p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.rut.includes(searchTerm)
    );

    // Función para generar iniciales del Avatar
    const getInitials = (n1: string, a1: string) => `${n1[0]}${a1[0]}`.toUpperCase();

    return (
        <AuthenticatedLayout>
            <Head title="Contactos - AVA CRM" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
                
                {/* Header similar a Empresas */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#c1f75e] pl-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                            Directorio de Contactos
                        </h1>
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            Gestión de capital humano y relaciones
                        </p>
                    </div>  
                    <button onClick={() => setIsModalOpen(true)} className="bg-[#c1f75e] text-black font-extrabold text-xs px-5 py-3 rounded hover:bg-[#a2eb07] transition-all uppercase flex items-center gap-2">
                        <Plus size={16} strokeWidth={3} /> Nuevo Contacto
                    </button>
                </div>

                {/* Buscador */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="BUSCAR POR NOMBRE O RUT..."
                        className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-12 text-[11px] font-bold tracking-wider outline-none focus:ring-2 focus:ring-[#c1f75e]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tabla de Personas */}
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#0A0A0A] text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4">Empresa / Cargo</th>
                                <th className="px-6 py-4 text-center">Comunicación</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {personasFiltradas.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-900 text-[#c1f75e] rounded flex items-center justify-center font-black text-xs border border-gray-700">
                                                {getInitials(p.nombre_1, p.apellido_1)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-800 dark:text-white uppercase">{p.nombre_completo}</div>
                                                <div className="text-[10px] text-gray-500 font-mono italic">{p.rut}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.trabajo_actual ? (
                                            <div>
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                                                    <Building size={12} className="text-[#c1f75e]" />
                                                    {p.trabajo_actual.division.empresa.nombre}
                                                </div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{p.trabajo_actual.cargo}</div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic font-bold uppercase tracking-widest">Sin trabajo actual</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-3">
                                            <a href={`mailto:${p.email}`} title={p.email} className="text-gray-400 hover:text-blue-500 transition-colors">
                                                <Mail size={16} />
                                            </a>
                                            <a href={`tel:${p.telefono}`} title={p.telefono} className="text-gray-400 hover:text-green-500 transition-colors">
                                                <Phone size={16} />
                                            </a>
                                            {p.perfil_linkedin && (
                                                <a href={p.perfil_linkedin} target="_blank" className="text-gray-400 hover:text-blue-700 transition-colors">
                                                    <Linkedin size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-black dark:hover:text-[#B0FF08]"><Edit3 size={16} /></button>
                                            <button onClick={() => {/* logic delete */}} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal con Grid para Nombres */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white dark:bg-[#111] w-full max-w-2xl rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white">
                                {editingId ? 'Editar Contacto' : 'Nuevo Contacto'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-black"><X size={20} /></button>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* RUT - Ocupa toda la fila arriba */}
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">RUT</label>
                                    <input type="text" value={data.rut} onChange={e => setData('rut', e.target.value)} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08]" />
                                    <InputError message={errors.rut} />
                                </div>

                                {/* Nombres */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Primer Nombre</label>
                                    <input type="text" value={data.nombre_1} onChange={e => setData('nombre_1', e.target.value)} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08]" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Segundo Nombre</label>
                                    <input type="text" value={data.nombre_2} onChange={e => setData('nombre_2', e.target.value)} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08]" />
                                </div>

                                {/* Apellidos */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Apellido Paterno</label>
                                    <input type="text" value={data.apellido_1} onChange={e => setData('apellido_1', e.target.value)} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08]" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Apellido Materno</label>
                                    <input type="text" value={data.apellido_2} onChange={e => setData('apellido_2', e.target.value)} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08]" />
                                </div>

                                {/* Contacto */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Email</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08]" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Teléfono</label>
                                    <input type="text" value={data.telefono} onChange={e => setData('telefono', e.target.value)} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-[#B0FF08]" required />
                                </div>
                            </div>

                            <button type="submit" disabled={processing} className="w-full bg-[#B0FF08] text-black font-black py-4 rounded-lg uppercase text-xs tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2">
                                {processing ? <LoaderCircle className="animate-spin" size={16} /> : (editingId ? "Actualizar Contacto" : "Guardar Contacto")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}