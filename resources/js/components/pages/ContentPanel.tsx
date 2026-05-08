import React from 'react';

interface Props {
    children: React.ReactNode;
    padding?: boolean;
    className?: string;
}

export default function ContentPanel({ children, padding = true, className = "" }: Props) {
    return (
        <div className={`
            bg-white dark:bg-[#111] 
            rounded-2xl 
            border border-gray-200 dark:border-gray-800 
            shadow-sm 
            overflow-hidden
            ${padding ? 'p-6 md:p-8' : 'p-0'}
            ${className}
        `}>
            {children}
        </div>
    );
}