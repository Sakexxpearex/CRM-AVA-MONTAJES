// Colores para los estado de las licitaciones

export default function EstadoBadge({ estado }: { estado: string }) {
    const configs: any = {
        'Prospecto': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        'Cotización': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Negociación': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        'Adjudicado': 'bg-[#c1f75e]/10 text-[#c1f75e] border-[#c1f75e]/20',
        'Perdido': 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const style = configs[estado] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${style}`}>
            {estado}
        </span>
    );
}