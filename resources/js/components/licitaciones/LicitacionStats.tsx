import { BarChart3, Briefcase, Trophy } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard'; 

export default function LicitacionStats({ stats = {} }: { stats?: any }) {
    // Variables de respaldo por stats viene vacion
    const montoTotal = stats?.montoTotal || 0;
    const activos = stats?.activos || 0;
    const montoGanado = stats?.montoGanado || 0;

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat('es-CL', { 
            style: 'currency', currency: 'CLP', maximumFractionDigits: 0 
        }).format(val);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                label="Pipeline Total" 
                value={formatMoney(montoTotal)} 
                icon={BarChart3} 
                color="neon"
            />
            <StatCard 
                label="Oportunidades Abiertas" 
                value={activos} 
                icon={Briefcase} 
                color="blue"
            />
            <StatCard 
                label="Éxito Acumulado" 
                value={formatMoney(montoGanado)} 
                icon={Trophy} 
                color="neon"
            />
        </div>
    );
}