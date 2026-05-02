import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    [key: string]: string;
    nombre_1: string; nombre_2: string; apellido_1: string; apellido_2: string;
    cargo: string; rut: string; email: string; password: string; password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        nombre_1: '', nombre_2: '', apellido_1: '', apellido_2: '',
        cargo: '', rut: '', email: '', password: '', password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Estilo para inputs 
    const inputClasses = "h-11 bg-white dark:bg-[#0A0A0A] border-gray-200 dark:border-gray-800 text-sm text-black dark:text-white placeholder:text-gray-300 focus:ring-1 focus:ring-[#C1F75E] focus:border-[#C1F75E] transition-all outline-none rounded-md";

    // Estilo para labels
    const labelClasses = "text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1 block";

    return (
        <AuthLayout title="Crear Cuenta" description="Registra un nuevo operador en el sistema">
            <Head title="Registro de Usuario" />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid gap-3">
                    
                    {/* Nombres */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label className={labelClasses}>Primer nombre</Label>
                            <Input className={inputClasses} value={data.nombre_1} onChange={(e) => setData("nombre_1", e.target.value)} placeholder="EJ. JUAN" />
                            <InputError message={errors.nombre_1} />
                        </div>
                        <div>
                            <Label className={labelClasses}>Segundo nombre</Label>
                            <Input className={inputClasses} value={data.nombre_2} onChange={(e) => setData("nombre_2", e.target.value)} placeholder="EJ. CARLOS" />
                        </div>
                    </div>

                    {/* Apellidos */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label className={labelClasses}>Primer apellido</Label>
                            <Input className={inputClasses} value={data.apellido_1} onChange={(e) => setData("apellido_1", e.target.value)} placeholder="EJ. PEREZ" />
                            <InputError message={errors.apellido_1} />
                        </div>
                        <div>
                            <Label className={labelClasses}>Segundo apellido</Label>
                            <Input className={inputClasses} value={data.apellido_2} onChange={(e) => setData("apellido_2", e.target.value)} placeholder="EJ. GONZÁLEZ" />
                        </div>
                    </div>

                    {/* Cargo y Rut */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label className={labelClasses}>Cargo / Función</Label>
                            <Input className={inputClasses} value={data.cargo} onChange={(e) => setData("cargo", e.target.value)} placeholder="OPERADOR" />
                        </div>
                        <div>
                            <Label className={labelClasses}>RUT</Label>
                            <Input className={inputClasses} value={data.rut} onChange={(e) => setData("rut", e.target.value)} placeholder="12.345.678-9" />
                        </div>
                    </div>

                    {/*  Email  */}
                    <div>
                        <Label className={labelClasses}>Correo Electrónico</Label>
                        <Input type="email" className={inputClasses} value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="USUARIO@AVACRM.COM" />
                        <InputError message={errors.email} />
                    </div>

                    {/* Contraseñas */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label className={labelClasses}>Contraseña</Label>
                            <Input type="password" className={inputClasses} value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="••••••••" />
                            <InputError message={errors.password} />
                        </div>
                        <div>
                            <Label className={labelClasses}>Confirmar</Label>
                            <Input type="password" className={inputClasses} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="••••••••" />
                        </div>
                    </div>

                    {/* Botón Registrar */}
                    <button 
                        type="submit" 
                        className="mt-4 w-full bg-black dark:bg-[#A0F700] text-white dark:text-black h-12 rounded-md font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-900 dark:hover:bg-[#86CF00] transition-all flex items-center justify-center gap-2" 
                        disabled={processing}
                    >
                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Registrar Usuario"}
                    </button>
                </div>

                <div className="text-center mt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        ¿Ya tienes cuenta? 
                        <Link href={route('login')} className="text-black dark:text-[#C1F75E] underline ml-1 hover:text-[#86CF00]">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}