import React from 'react';

interface Props {
    children: React.ReactNode;
    // Anchos personalizados por si alguna página necesita ser de distinto tamñaño
    className?: string;
}

export default function PageContainer({ children, className = "" }: Props) {
    return (
        <div className={`max-w-[1600px] mx-auto px-4 sm:px-8 py-10 space-y-8 ${className}`}>
            {children}
        </div>
    );
}