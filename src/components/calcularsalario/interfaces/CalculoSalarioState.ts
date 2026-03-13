import type Colaborador from '../../../models/Colaborador';

export interface CalculoSalarioState {
  mes: number;
  totalHorasExtras: number;
  descontos: number;
  colaborador: Colaborador;
}