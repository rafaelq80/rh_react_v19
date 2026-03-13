// Interface que representa a resposta do cálculo de salário
export interface CalculoResponse {
	salario: number
	horasExtras: number
	valorHoraExtra: number
	valorTotalHorasExtras: number
	inss: number
	irrf: number
	totalDescontos: number
	salarioLiquido: number
}