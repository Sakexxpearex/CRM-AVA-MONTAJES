import { LucideIcon } from 'lucide-react';

interface Props {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color?: 'neon' | 'blue' | 'gray';
}

export default function StatCard({ label, value, icon: Icon, trend, color = 'neon' }: Props) {
    const colorStyles = {
        neon: 'text-[#c1f75e] bg-[#c1f75e]/10 border-[#c1f75e]/20',
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        gray: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    };

    const selectedStyle = colorStyles[color as keyof typeof colorStyles] || colorStyles.neon;

    return (
        <div className="p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm relative overflow-hidden group transition-all">
            {/* Acento lateral neón */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#c1f75e] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-3">
                        {label}
                    </p>
                    
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black dark:text-white font-mono tracking-tighter leading-none whitespace-nowrap">
                            {value}
                        </h3>
                        {trend && (
                            <span className="text-[#c1f75e] text-[8px] font-black uppercase italic">
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Iconos */}
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 mt-1 ${selectedStyle}`}>
                    <Icon size={18} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
}