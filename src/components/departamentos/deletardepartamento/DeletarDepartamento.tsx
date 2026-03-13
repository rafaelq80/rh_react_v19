import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import AuthContext from "../../../contexts/AuthContext"
import type Departamento from "../../../models/Departamento"
import { deletar, listar } from "../../../services/Service"
import { ToastAlerta } from "../../../utils/ToastAlerta"

function DeletarDepartamento() {
	const navigate = useNavigate()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [departamento, setDepartamento] = useState<Departamento>({} as Departamento)

	const { usuario, handleLogout, isLogout } = useContext(AuthContext)
	const token = usuario.token

	const { id } = useParams<{ id: string }>()

	async function buscarPorId(id: string) {
		try {
			await listar(`/departamentos/${id}`, setDepartamento, {
				headers: {
					Authorization: token,
				},
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
				ToastAlerta("Você precisa estar logado", "info")
			}
			navigate("/")
		}
	}, [token])

	useEffect(() => {
		if (id !== undefined) {
			buscarPorId(id)
		}
	}, [id])

	async function deletarDepartamento() {
		setIsLoading(true)

		try {
			await deletar(`/departamentos/${id}`, {
				headers: {
					Authorization: token,
				},
			})

			ToastAlerta("Departamento apagado com sucesso", "sucesso")
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
			} else {
				ToastAlerta("Erro ao deletar o Departamento!", "erro")
			}
		}

		setIsLoading(false)
		retornar()
	}

	function retornar() {
		navigate("/departamentos")
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-8 px-4">
			<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
				<h1 className="text-4xl text-center my-4 font-bold text-gray-800">
					Excluir Departamento
				</h1>

				<p className="text-gray-600 text-center mb-8">
					Tem certeza que deseja remover este departamento? Esta ação não pode ser
					desfeita.
				</p>

				{/* Card do Departamento */}
				<div className="bg-linear-to-r from-slate-600 to-slate-700 rounded-xl p-6 mb-8">
					<p className="text-white text-sm font-semibold mb-3">
						Departamento a ser removido:
					</p>

					<div className="flex items-center gap-3">
						{departamento.icone ? (
							<div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md border-2 border-gray-200 overflow-hidden">
								<img
									src={departamento.icone}
									alt={departamento.descricao}
									className="w-10 h-10 object-contain"
									onError={(e) => {
										e.currentTarget.src =
											"https://ik.imagekit.io/vzr6ryejm/rh/icones/smiley-sad.svg?updatedAt=1730246853172"
									}}
								/>
							</div>
						) : (
							<div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-md">
								<span className="text-gray-600 text-sm font-bold">N/A</span>
							</div>
						)}

						<p className="text-white text-2xl font-bold wrap-break-word flex-1">
							{departamento.descricao || "Carregando..."}
						</p>
					</div>
				</div>
				{/* Botões de Ação */}
				<div className="flex gap-4">
					<button
						type="button"
						onClick={retornar}
						className="flex-1 px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg 
              transition-all duration-200 active:scale-95"
					>
						Não
					</button>

					<button
						type="button"
						onClick={deletarDepartamento}
						disabled={isLoading}
						className="flex-1 flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 
              disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold rounded-lg 
              transition-all duration-200 active:scale-95 h-12"
					>
						{isLoading ? (
							<ClipLoader color="#ffffff" size={24} />
						) : (
							<span>Sim, Excluir</span>
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeletarDepartamento
