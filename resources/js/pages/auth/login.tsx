import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

// Importación de componentes de UI
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title="Iniciar Sesión" 
            description="Ingresa tus credenciales para acceder"
        >
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-[#86CF00]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="w-full space-y-6">
                {/* Email */}
                <div className="flex flex-col w-full">
                    <Label 
                        htmlFor="email" 
                        className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1"
                    >
                        Email de Usuario
                    </Label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full h-11 px-4 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md focus:border-[#C1F75E] focus:ring-1 focus:ring-[#C1F75E] text-sm text-gray-900 dark:text-white placeholder:text-xs placeholder:text-gray-300 transition-all outline-none"
                        placeholder="USUARIO@EJEMPLO.COM"
                        required
                        autoFocus
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <Label 
                            htmlFor="password" 
                            className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]"
                        >
                            Contraseña
                        </Label>
                        {canResetPassword && (
                            <Link 
                                href={route('password.request')} 
                                className="text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#86CF00] transition-colors"
                            >
                                ¿Olvidaste tu clave?
                            </Link>
                        )}
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full h-11 px-4 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-md focus:border-[#C1F75E] focus:ring-1 focus:ring-[#C1F75E] text-sm text-gray-900 dark:text-white placeholder:text-gray-300 transition-all outline-none"
                        placeholder="••••••••"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Botón de entrada */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full h-12 bg-black dark:bg-[#A0F700] text-white dark:text-black rounded-md font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-900 dark:hover:bg-[#86CF00] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2 border border-transparent"
                >
                    {processing ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        "Ingresar"
                    )}
                </button>
            </form>

            {/* sección de registro  */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">
                    ¿No tienes acceso al sistema?
                </p>
                <Link
                    href={route('register')}
                    className="inline-block w-full py-3 border border-gray-200 dark:border-gray-800 rounded-md text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-[#C1F75E] hover:text-[#C1F75E] transition-all"
                >
                    Registrar nueva cuenta
                </Link>
            </div>
        </AuthLayout>
    );
}