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
            description="Bienvenido de vuelta al Sistema de Gestión"
        >
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="w-full space-y-5">
                {/* Email */}
                <div className="flex flex-col w-full">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                        Email
                    </Label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full h-12 px-4 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#B0FF08] focus:border-[#B0FF08] text-gray-900 dark:text-white placeholder:text-gray-400 transition-all outline-none"
                        placeholder="usuario@ejemplo.com"
                        required
                        autoFocus
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Contraseña
                        </Label>
                        {canResetPassword && (
                            <Link 
                                href={route('password.request')} 
                                className="text-xs text-gray-500 hover:text-[#B0FF08] transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full h-12 px-4 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#B0FF08] focus:border-[#B0FF08] text-gray-900 dark:text-white placeholder:text-gray-400 transition-all outline-none"
                        placeholder="••••••••"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Boton de entrar */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full h-14 bg-black dark:bg-[#B0FF08] text-white dark:text-black rounded-xl font-black text-lg hover:opacity-90 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2 tracking-widest"
                >
                    {processing ? (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                    ) : (
                        "ENTRAR"
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}