// Colores para los estado de las licitaciones

export default function EstadoBadge({ estado }: { estado: string }) {
    const configs: any = {
        // Estados del seeder / pipeline
        'Adjudicada': 'bg-[#c1f75e]/10 text-[#c1f75e] border-[#c1f75e]/20',
        'Evaluación': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Preparación': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'Filtro': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'Perdida': 'bg-red-500/10 text-red-400 border-red-500/20',
        'Presentada': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    };

    const style = configs[estado] || 'bg-white/5 text-gray-500 border-gray-800';

    return (
        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border tracking-wider transition-all ${style}`}>
            {estado}
        </span>
    );
}