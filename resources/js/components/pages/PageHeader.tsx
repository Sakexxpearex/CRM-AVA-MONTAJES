import { Link } from '@inertiajs/react';
import { LucideIcon, Plus } from 'lucide-react';

interface Props {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    actionLabel?: string;
    actionHref?: string;
    onActionClick?: () => void;
    children?: React.ReactNode;
}

export default function PageHeader({ 
    title, 
    subtitle, 
    icon: Icon, 
    actionLabel, 
    actionHref, 
    onActionClick,
    children
}: Props) {
    
    // Boton para mantener armonia 
    const buttonClass = "hidden md:flex items-center justify-center gap-2 bg-[#c1f75e] text-black font-extrabold text-xs px-5 py-3 rounded hover:bg-[#a2eb07] transition-all uppercase shadow-lg shadow-[#c1f75e]/20";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#c1f75e] pl-4 mb-8">
            <div>
                {/* Título */}
                <h1 className="flex items-center gap-3 text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    <Icon size={24} className="text-[#c1f75e] shrink-0" />
                    <span>{title}</span>
                </h1>
                
                {subtitle && (
                    <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 shrink-0 h-fit">

                {children}

                {/* Botón Principal */}
                {actionLabel && (
                    <>
                        {actionHref ? (
                            <Link href={actionHref} className={buttonClass}>
                                <Plus size={16} strokeWidth={3} />
                                {actionLabel}
                            </Link>
                        ) : (
                            <button onClick={onActionClick} className={buttonClass}>
                                <Plus size={16} strokeWidth={3} />
                                {actionLabel}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}