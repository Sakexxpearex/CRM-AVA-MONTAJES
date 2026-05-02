import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    // Estilos labels e inputs 
    const inputClasses = "h-11 w-full bg-white dark:bg-[#0A0A0A] border-gray-200 dark:border-gray-800 text-sm text-black dark:text-white placeholder:text-gray-300 focus:ring-1 focus:ring-[#C1F75E] focus:border-[#C1F75E] transition-all outline-none rounded-md px-4";
    const labelClasses = "text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 block";

    return (
        <AuthLayout 
            title="Recuperar Acceso" 
            description="Enviaremos un enlace de restauración a tu correo"
        >
            <Head title="Restablecer contraseña" />

            {status && (
                <div className="mb-6 p-3 bg-[#F3FAEC] dark:bg-[#F3FAEC]/5 border border-[#86CF00]/20 text-center text-[10px] font-bold uppercase tracking-widest text-[#86CF00]">
                    {status}
                </div>
            )}

            <div className="w-full">
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex flex-col">
                        <Label htmlFor="email" className={labelClasses}>Dirección de Correo</Label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            className={inputClasses}
                            placeholder="EMAIL@EJEMPLO.COM"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <button 
                        type="submit"
                        className="w-full h-12 bg-black dark:bg-[#A0F700] text-white dark:text-black rounded-md font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-900 dark:hover:bg-[#86CF00] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                            "Enviar Instrucciones"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        O, regresar al 
                        <Link 
                            href={route('login')} 
                            className="text-black dark:text-[#C1F75E] font-black underline ml-1 hover:text-[#86CF00] transition-colors"
                        >
                            inicio de sesión
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}