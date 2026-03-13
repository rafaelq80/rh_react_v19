import { type ChangeEvent, type FormEvent, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { NumericFormat } from "react-number-format"
import { AuthContext } from "../../../contexts/AuthContext"
import type Colaborador from "../../../models/Colaborador"
import type Departamento from "../../../models/Departamento"
import { atualizar, cadastrar, listar } from "../../../services/Service"
import { ToastAlerta } from "../../../utils/ToastAlerta"
import {
	validarCampoColaborador,
	validarFormularioColaborador,
	formularioValido,
} from "../../../validations/ValidacaoColaborador"

function FormColaborador() {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [departamentos, setDepartamentos] = useState<Departamento[]>([])
	const [erros, setErros] = useState<Record<string, string>>({})

	const [departamento, setDepartamento] = useState<Departamento>({
		id: 0,
		descricao: "",
		icone: "",
	})

	const [colaborador, setColaborador] = useState<Colaborador>({ dependentes: 0 } as Colaborador)

	const { id } = useParams<{ id: string }>()
	const { usuario, handleLogout, isLogout } = useContext(AuthContext)
	const token = usuario.token

	async function buscarColaboradorPorId(id: string) {
		try {
			await listar(`/colaboradores/${id}`, setColaborador, {
				headers: {
					Authorization: token,
				},
			})
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
			} else {
				ToastAlerta("Colaborador não Encontrado!", "erro")
				retornar()
			}
		}
	}

	async function buscarDepartamentoPorId(id: string) {
		try {
			await listar(`/departamentos/${id}`, setDepartamento, {
				headers: {
					Authorization: token,
				},
			})
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
			} else {
				ToastAlerta("Departamento não Encontrado!", "erro")
				retornar()
			}
		}
	}

	async function buscarDepartamentos() {
		try {
			await listar(`/departamentos`, setDepartamentos, {
				headers: { Authorization: token },
			})
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
			}
		}
	}

	useEffect(() => {
		if (token === "") {
			if (!isLogout) {
				ToastAlerta("Você precisa estar logado!", "info")
			}
			navigate("/")
		}
	}, [token])

	useEffect(() => {
		buscarDepartamentos()
		if (id !== undefined) {
			buscarColaboradorPorId(id)
			setIsEditing(true)
		}
	}, [id])

	useEffect(() => {
		if (departamento.id !== 0) {
			setColaborador((prevState) => ({
				...prevState,
				departamento: departamento,
				usuario: usuario,
			}))

			const erro = validarCampoColaborador("departamento", departamento.id)
			setErros((prev) => ({ ...prev, departamento: erro }))
		}
	}, [departamento])

	function handleDepartamentoChange(e: ChangeEvent<HTMLSelectElement>) {
		const selectedId = e.target.value
		if (selectedId) {
			buscarDepartamentoPorId(selectedId)
		}
	}

	function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
		const { type, value, name } = e.target

		let valor: string | number = value

		switch (type) {
			case "number":
			case "range":
				valor = value === "" ? "" : parseFloat(Number(value).toFixed(2))
				break
			default:
				if (
					!isNaN(Number(value)) &&
					value !== "" &&
					name !== "nome" &&
					name !== "email" &&
					name !== "foto" &&
					name !== "cargo"
				) {
					valor = parseFloat(Number(value).toFixed(2))
				}
		}

		setColaborador((prevState) => ({
			...prevState,
			[name]: valor,
		}))

		const erro = validarCampoColaborador(name, valor)
		setErros((prev) => ({ ...prev, [name]: erro }))
	}

	function retornar() {
		navigate("/colaboradores")
	}

	async function gerarNovoColaborador(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const errosValidacao = validarFormularioColaborador(colaborador)
		setErros(errosValidacao)

		if (!formularioValido(errosValidacao)) {
			ToastAlerta("Por favor, corrija os erros no formulário", "erro")
			return
		}

		setIsLoading(true)

		if (id !== undefined) {
			try {
				await atualizar(`/colaboradores`, colaborador, setColaborador, {
					headers: {
						Authorization: token,
					},
				})
				ToastAlerta("Colaborador atualizado com sucesso", "sucesso")
			} catch (error: any) {
				if (error.toString().includes("401")) {
					handleLogout()
				} else {
					ToastAlerta("Erro ao atualizar o Colaborador!", "erro")
				}
			}
		} else {
			try {
				await cadastrar(`/colaboradores`, colaborador, setColaborador, {
					headers: {
						Authorization: token,
					},
				})
				ToastAlerta("Colaborador cadastrado com sucesso", "sucesso")
			} catch (error: any) {
				if (error.toString().includes("401")) {
					handleLogout()
				} else {
					ToastAlerta("Erro ao cadastrar o Colaborador!", "erro")
				}
			}
		}

		setIsLoading(false)
		retornar()
	}

	const departamentoSelecionado = colaborador.departamento?.id > 0

	return (
		<div className="container flex flex-col mx-auto items-center">
			{/* Header */}
			<h1 className="text-4xl text-center my-8">
				{isEditing ? "Editar Colaborador" : "Cadastrar Colaborador"}
			</h1>

			{/* Form Container */}
			<div className="flex flex-col w-full max-w-2xl gap-4 mb-8">
				<form
					className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
					onSubmit={gerarNovoColaborador}
				>
					{/* Nome */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="nome" className="text-sm font-semibold text-gray-700">
							Nome do Colaborador
						</label>
						<input
							id="nome"
							name="nome"
							type="text"
							placeholder="Nome completo"
							value={colaborador.nome || ""}
							onChange={atualizarEstado}
							required
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.nome
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							}`}
						/>
						{erros.nome && <span className="text-red-500 text-xs">{erros.nome}</span>}
					</div>

					{/* E-mail */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="email" className="text-sm font-semibold text-gray-700">
							E-mail
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="email@exemplo.com"
							value={colaborador.email || ""}
							onChange={atualizarEstado}
							required
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.email
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							}`}
						/>
						{erros.email && <span className="text-red-500 text-xs">{erros.email}</span>}
					</div>

					{/* Foto */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="foto" className="text-sm font-semibold text-gray-700">
							Foto (URL)
						</label>
						<input
							id="foto"
							name="foto"
							type="url"
							placeholder="https://..."
							value={colaborador.foto || ""}
							onChange={atualizarEstado}
							required
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.foto
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							}`}
						/>
						{erros.foto && <span className="text-red-500 text-xs">{erros.foto}</span>}
					</div>

					{/* Cargo */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="cargo" className="text-sm font-semibold text-gray-700">
							Cargo
						</label>
						<input
							id="cargo"
							name="cargo"
							type="text"
							placeholder="Ex: Desenvolvedor Full Stack"
							value={colaborador.cargo || ""}
							onChange={atualizarEstado}
							required
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.cargo
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							}`}
						/>
						{erros.cargo && <span className="text-red-500 text-xs">{erros.cargo}</span>}
					</div>

					{/* Salário */}
					<div className="flex flex-col gap-2 mb-5">
						<label htmlFor="salario" className="text-sm font-semibold text-gray-700">
							Salário
						</label>
						<NumericFormat
							id="salario"
							name="salario"
							value={colaborador.salario}
							onValueChange={(values) => {
								const novoSalario = values.floatValue ?? 0
								setColaborador({
									...colaborador,
									salario: novoSalario,
								})

								const erro = validarCampoColaborador("salario", novoSalario)
								setErros((prev) => ({
									...prev,
									salario: erro,
								}))
							}}
							thousandSeparator="."
							decimalSeparator=","
							decimalScale={2}
							fixedDecimalScale
							prefix="R$ "
							placeholder="R$ 0,00"
							required
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.salario
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							}`}
						/>
						{erros.salario && (
							<span className="text-red-500 text-xs">{erros.salario}</span>
						)}
					</div>

					{/* Horas Mensais e Dependentes em duas colunas */}
					<div className="flex gap-4 mb-5">
						<div className="flex flex-col gap-2 flex-1">
							<label
								htmlFor="horasMensais"
								className="text-sm font-semibold text-gray-700"
							>
								Horas/Mês (h)
							</label>
							<NumericFormat
								id="horasMensais"
								name="horasMensais"
								value={colaborador.horasMensais ?? ""}
								placeholder="220"
								allowNegative={false}
								decimalScale={0}
								allowLeadingZeros={false}
								onValueChange={(values) => {
									setColaborador({
										...colaborador,
										horasMensais: values.floatValue ?? 0,
									})
								}}
								className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
									erros.horasMensais
										? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
										: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
								}`}
							/>
							{erros.horasMensais && (
								<span className="text-red-500 text-xs">{erros.horasMensais}</span>
							)}
						</div>

						{/* Dependentes */}
						<div className="flex flex-col gap-2 flex-1">
							<label
								htmlFor="dependentes"
								className="text-sm font-semibold text-gray-700"
							>
								Dependentes
							</label>
							<NumericFormat
								id="dependentes"
								name="dependentes"
								value={colaborador.dependentes ?? 0}
								placeholder="0"
								allowNegative={false}
								decimalScale={0}
								allowLeadingZeros={false}
								onValueChange={(values) => {
									setColaborador({
										...colaborador,
										dependentes: values.floatValue ?? 0,
									})
								}}
								className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
									erros.dependentes
										? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
										: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
								}`}
							/>
							{erros.dependentes && (
								<span className="text-red-500 text-xs">{erros.dependentes}</span>
							)}
						</div>
					</div>

					{/* Departamento */}
					<div className="flex flex-col gap-2 mb-6">
						<label
							htmlFor="departamento"
							className="text-sm font-semibold text-gray-700"
						>
							Departamento
						</label>
						<select
							id="departamento"
							name="departamento"
							className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
								erros.departamento
									? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							}`}
							onChange={handleDepartamentoChange}
							value={colaborador.departamento?.id || ""}
						>
							<option value="" disabled>
								Selecione um Departamento
							</option>
							{departamentos.map((dept) => (
								<option key={dept.id} value={dept.id}>
									{dept.descricao}
								</option>
							))}
						</select>
						{erros.departamento && (
							<span className="text-red-500 text-xs">{erros.departamento}</span>
						)}
					</div>

					{/* Botão Submit */}
					<div className="flex justify-center pt-3">
						<button
							type="submit"
							disabled={!departamentoSelecionado || isLoading}
							className="flex justify-center items-center rounded disabled:bg-gray-300 bg-linear-to-r 
                from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold 
                w-1/2 mx-auto py-2.5 transition-all duration-200 active:scale-95"
						>
							{isLoading ? (
								<ClipLoader color="#ffffff" size={20} />
							) : (
								<span>{isEditing ? "Atualizar" : "Cadastrar"}</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default FormColaborador
