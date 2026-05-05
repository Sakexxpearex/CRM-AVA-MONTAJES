export interface Empresa {
  id: number;
  nombre: string;
  rut: string;
  tipo: 'Cliente' | 'Competencia' | 'Subcontratista';
}