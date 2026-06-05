export interface Division {
  id: number;
  nombre: string;
  empresa_id: number;
}

export interface Empresa {
  id: number;
  nombre: string;
  alias?: string;
  rut: string;
  tipo: 'Cliente' | 'Competencia' | 'Subcontratista';
  divisiones?: Division[];
}