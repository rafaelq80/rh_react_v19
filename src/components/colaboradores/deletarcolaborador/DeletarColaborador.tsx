import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { AuthContext } from "../../../contexts/AuthContext"
import type Colaborador from "../../../models/Colaborador"
import { deletar, listar } from "../../../services/Service"
import { ToastAlerta } from "../../../utils/ToastAlerta"

function DeletarColaborador() {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [colaborador, setColaborador] = useState<Colaborador>({} as Colaborador)

  const { id } = useParams<{ id: string }>()

  const { usuario, handleLogout, isLogout } = useContext(AuthContext)
  const token = usuario.token

  async function buscarPorId(id: string) {
    try {
      await listar(`/colaboradores/${id}`, setColaborador, {
        headers: {
          Authorization: token,
        },
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      } else {
        ToastAlerta('Erro ao buscar Colaborador!', 'erro')
        retornar()
      }
    }
  }

  useEffect(() => {
    if (token === '') {
      if (!isLogout) {
        ToastAlerta('Você precisa estar logado!', 'info')
      }
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    if (id !== undefined) {
      buscarPorId(id)
    }
  }, [id])

  async function deletarColaborador() {
    setIsLoading(true)

    try {
      await deletar(`/colaboradores/${id}`, {
        headers: {
          Authorization: token,
        },
      })

      ToastAlerta('Colaborador excluído com sucesso!', 'sucesso')
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      } else {
        ToastAlerta('Erro ao excluir o Colaborador!', 'erro')
      }
    }

    setIsLoading(false)
    retornar()
  }

  function retornar() {
    navigate("/colaboradores")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-4xl text-center my-4 font-bold text-gray-800">
          Excluir Colaborador
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Tem certeza que deseja remover este colaborador?
          Esta ação não pode ser desfeita.
        </p>

        {/* Card do Colaborador */}
        <div className="bg-linear-to-r from-slate-600 to-slate-700 rounded-xl p-6 mb-8">
          <p className="text-white text-sm font-semibold mb-3">
            Colaborador a ser removido:
          </p>
          
          <div className="flex items-center gap-4">
            {colaborador.foto ? (
              <img
                src={colaborador.foto}
                alt={colaborador.nome}
                className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://ik.imagekit.io/vzr6ryejm/profile/usuario.svg?updatedAt=1729485119852'
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-xs font-bold">N/A</span>
              </div>
            )}
            
            <div className="flex-1">
              <p className="text-white text-2xl font-bold wrap-break-word">
                {colaborador.nome || 'Carregando...'}
              </p>
              {colaborador.cargo && (
                <p className="text-white/80 text-sm mt-1">
                  {colaborador.cargo}
                </p>
              )}
            </div>
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
            onClick={deletarColaborador}
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

export default DeletarColaborador