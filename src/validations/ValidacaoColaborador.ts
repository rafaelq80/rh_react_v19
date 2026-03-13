import type Colaborador from '../models/Colaborador'

export function validarCampoColaborador(
	campo: string,
	valor: string | number
): string {
	const valorString = String(valor)

	switch (campo) {
		case 'nome':
			if (!valorString || valorString.trim() === '') {
				return 'O nome é obrigatório'
			}
			if (valorString.length < 3) {
				return 'O nome deve ter pelo menos 3 caracteres'
			}
			if (valorString.length > 100) {
				return 'O nome deve ter no máximo 100 caracteres'
			}
			break

		case 'email':
			if (!valorString || valorString.trim() === '') {
				return 'O e-mail é obrigatório'
			}
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailPattern.test(valorString)) {
				return 'Digite um e-mail válido'
			}
			break

		case 'foto':
			if (!valorString || valorString.trim() === '') {
				return 'A foto é obrigatória'
			}
			const urlPattern = /^https?:\/\/.+/
			if (!urlPattern.test(valorString)) {
				return 'A foto deve ser uma URL válida (http:// ou https://)'
			}
			break

		case 'cargo':
			if (!valorString || valorString.trim() === '') {
				return 'O cargo é obrigatório'
			}
			if (valorString.length < 2) {
				return 'O cargo deve ter pelo menos 2 caracteres'
			}
			if (valorString.length > 100) {
				return 'O cargo deve ter no máximo 100 caracteres'
			}
			break

		case 'salario':
			const salario = Number(valor)
			if (isNaN(salario) || salario <= 0) {
				return 'O salário deve ser maior que zero'
			}
			if (salario > 1000000) {
				return 'O salário deve ser menor que R$ 1.000.000,00'
			}
			break

		case 'horasMensais':
			const horas = Number(valor)
			if (isNaN(horas) || horas <= 0) {
				return 'As horas mensais devem ser maior que zero'
			}
			if (horas > 744) {
				return 'As horas mensais não podem exceder 744 horas (31 dias x 24h)'
			}
			break

		case 'dependentes':
			const dependentes = Number(valor)
			if (isNaN(dependentes)) {
				return 'Informe um número válido de dependentes'
			}
			if (dependentes < 0) {
				return 'O número de dependentes não pode ser negativo'
			}
			if (dependentes > 50) {
				return 'O número de dependentes parece incorreto'
			}
			break

		case 'departamento':
			if (
				!valorString ||
				valorString === '' ||
				valorString === '0'
			) {
				return 'Selecione um departamento'
			}
			break
	}

	return ''
}

export function validarFormularioColaborador(
	colaborador: Colaborador
): Record<string, string> {
	const erros: Record<string, string> = {}

	const erroNome = validarCampoColaborador('nome', colaborador.nome || '')
	if (erroNome) erros.nome = erroNome

	const erroEmail = validarCampoColaborador(
		'email',
		colaborador.email || ''
	)
	if (erroEmail) erros.email = erroEmail

	const erroFoto = validarCampoColaborador('foto', colaborador.foto || '')
	if (erroFoto) erros.foto = erroFoto

	const erroCargo = validarCampoColaborador(
		'cargo',
		colaborador.cargo || ''
	)
	if (erroCargo) erros.cargo = erroCargo

	const erroSalario = validarCampoColaborador(
		'salario',
		colaborador.salario || 0
	)
	if (erroSalario) erros.salario = erroSalario

	const erroHoras = validarCampoColaborador(
		'horasMensais',
		colaborador.horasMensais || 0
	)
	if (erroHoras) erros.horasMensais = erroHoras

	const erroDependentes = validarCampoColaborador(
		'dependentes',
		colaborador.dependentes || 0
	)
	if (erroDependentes) erros.dependentes = erroDependentes

	const erroDepartamento = validarCampoColaborador(
		'departamento',
		colaborador.departamento?.id || 0
	)
	if (erroDepartamento) erros.departamento = erroDepartamento

	return erros
}

export function formularioValido(erros: Record<string, string>): boolean {
	return Object.values(erros).every((erro) => erro === '')
}
