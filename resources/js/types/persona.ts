export interface HistorialLaboral {
    id: number;
    cargo: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    estado_actual: boolean;
    division: {
        id: number;
        nombre: string;
        empresa: { nombre: string };
    };
}

export interface Persona {
    id: number;
    rut: string;
    nombre_1: string;
    nombre_2: string;
    apellido_1: string;
    apellido_2: string;
    email: string;
    telefono: string;
    perfil_linkedin: string;
    nombre_completo: string;
    trabajo_actual?: {
        division_id: number;
        division: {
            id: number;
            nombre: string;
            empresa_id: number;
            empresa: { nombre: string };
        };
        cargo: string;
    };
    historial_laboral?: HistorialLaboral[];
}