
export const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '---';

    return new Date(dateStr).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

export const formatRut = (value: string) => {
    if (!value) return '---';
    let cleaned = value.replace(/[^0-9kK]/g, "");
    if (cleaned.length <= 1) return cleaned;
    const dv = cleaned.slice(-1).toUpperCase();
    const digits = cleaned.slice(0, -1);
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
};