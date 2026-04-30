import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
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

    const inputClasses = "bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black h-11";

    return (
        <AuthLayout title="Crear Cuenta" description="Ingresa tus datos para acceder al sistema AVA">
            <Head title="Registro" />

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-4">
                    
                    {/* Nombres */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-1.5">
                            <Label className="dark:text-gray-300 text-[11px] uppercase">Primer nombre</Label>
                            <Input className={inputClasses} value={data.nombre_1} onChange={(e) => setData("nombre_1", e.target.value)} placeholder="Juan" />
                            <InputError message={errors.nombre_1} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="dark:text-gray-300 text-[11px] uppercase">Segundo nombre</Label>
                            <Input className={inputClasses} value={data.nombre_2} onChange={(e) => setData("nombre_2", e.target.value)} placeholder="Carlos" />
                        </div>
                    </div>

                    {/* Apellidos */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-1.5">
                            <Label className="dark:text-gray-300 text-[11px] uppercase">Primer apellido</Label>
                            <Input className={inputClasses} value={data.apellido_1} onChange={(e) => setData("apellido_1", e.target.value)} placeholder="Perez" />
                            <InputError message={errors.apellido_1} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="dark:text-gray-300 text-[11px] uppercase">Segundo apellido</Label>
                            <Input className={inputClasses} value={data.apellido_2} onChange={(e) => setData("apellido_2", e.target.value)} placeholder="González" />
                        </div>
                    </div>

                    {/* Cargo y Rut */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-1.5">
                            <Label className="dark:text-gray-300 text-[11px] uppercase">Cargo</Label>
                            <Input className={inputClasses} value={data.cargo} onChange={(e) => setData("cargo", e.target.value)} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="dark:text-gray-300 text-[11px] uppercase">RUT</Label>
                            <Input className={inputClasses} value={data.rut} onChange={(e) => setData("rut", e.target.value)} placeholder="12.345.678-9" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="grid gap-1.5">
                        <Label className="dark:text-gray-300 text-[11px] uppercase">Correo Electrónico</Label>
                        <Input type="email" className={inputClasses} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>

                    {/* Contraseña*/}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-1.5">
                            <Label className="dark:text-gray-300 text-[11px] uppercase">Contraseña</Label>
                            <Input type="password" className={inputClasses} value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="dark:text-gray-300 text-[11px] uppercase">Confirmar</Label>
                            <Input type="password" className={inputClasses} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        </div>
                    </div>

                    {/* Boton registrar */}
                    <Button 
                        type="submit" 
                        className="mt-4 w-full bg-black hover:bg-gray-800 text-white h-12 rounded-xl font-bold uppercase tracking-wider transition-all" 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Registrar Usuario
                    </Button>
                </div>

                <div className="text-center text-sm mt-2">
                    <span className="dark:text-gray-300">¿Ya tienes cuenta?</span>
                    <TextLink href={route('login')} className="dark:text-[#B0FF08] underline ml-1">
                        Inicia sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}