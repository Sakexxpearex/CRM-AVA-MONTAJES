import TimelineItem from './TimeLineItem';

export default function TimeLine({ month, interacciones }: any) {
    return (
        <div className="relative">
            {/* Mes */}
            <div className="sticky top-24 z-20 mb-8">
                <div className="inline-block bg-[#c1f75e] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#c1f75e]/10">
                    {month}
                </div>
            </div>

            {/* Línea vertical que conecta los puntos */}
            <div className="absolute left-[15px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-[#c1f75e]/30 to-transparent"></div>

            <div className="space-y-8">
                {interacciones.map((int: any) => (
                    <TimelineItem key={int.id} interaccion={int} />
                ))}
            </div>
        </div>
    );
}