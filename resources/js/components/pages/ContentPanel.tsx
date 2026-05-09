import React from 'react';

interface Props {
    children: React.ReactNode;
    padding?: boolean;
    className?: string;
    title?: string;
}

export default function ContentPanel({ children, padding = true, className = "",title }: Props) {
    return (
        <div className={`bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-black/10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                        {title}
                    </h3>
                </div>
            )}
            
            <div className={`${padding ? 'p-6' : ''}`}>
                {children}
            </div>
        </div>
    );
}