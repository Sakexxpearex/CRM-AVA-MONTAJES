import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-6">
            <div className="w-full max-w-[450px] flex flex-col items-center">
                
                {/* Logo y Encabezado */}
                <div className="text-center mb-8 w-full">
                    <Link href="/" className="flex justify-center mb-4">
                        <img 
                            src="/assets/logos/isotipo-negro-verde-original.svg" 
                            alt="AVA CRM Logo" 
                            className="w-48 h-48 lg:w-56 lg:h-56 object-contain"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">AVA CRM</h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Sistema de Gestión de Licitaciones
                    </p>
                </div>

                {/* Contenedor de los formularios */}
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}