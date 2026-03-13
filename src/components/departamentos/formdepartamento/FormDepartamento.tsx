import { type ChangeEvent, type FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import AuthContext from "../../../contexts/AuthContext";
import type Departamento from "../../../models/Departamento";
import { atualizar, cadastrar, listar } from "../../../services/Service";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import {
  validarCampoDepartamento,
  validarFormularioDepartamento,
  formularioValido,
} from "../../../validations/ValidacaoDepartamento";

function FormDepartamento() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [departamento, setDepartamento] = useState<Departamento>({} as Departamento);
  const [erros, setErros] = useState<Record<string, string>>({});

  const { usuario, handleLogout, isLogout } = useContext(AuthContext);
  const token = usuario.token;

  const { id } = useParams<{ id: string }>();

  async function buscarPorId(id: string) {
    try {
      await listar(`/departamentos/${id}`, setDepartamento, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error: any) {
      if (error.toString().includes("401")) {
        handleLogout();
      } else {
        ToastAlerta("Departamento não Encontrado!", "erro");
        retornar();
      }
    }
  }

  useEffect(() => {
    if (token === "") {
      if (!isLogout) {
        ToastAlerta("Você precisa estar logado!", "info");
      }
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    if (id !== undefined) {
      buscarPorId(id);
      setIsEditing(true);
    }
  }, [id]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setDepartamento({
      ...departamento,
      [name]: value,
    });

    const erro = validarCampoDepartamento(name, value);
    setErros((prev) => ({ ...prev, [name]: erro }));
  }

  async function gerarNovoDepartamento(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errosValidacao = validarFormularioDepartamento(departamento);
    setErros(errosValidacao);

    if (!formularioValido(errosValidacao)) {
      ToastAlerta("Por favor, corrija os erros no formulário", "erro");
      return;
    }

    setIsLoading(true);

    if (id !== undefined) {
      try {
        await atualizar(`/departamentos`, departamento, setDepartamento, {
          headers: {
            Authorization: token,
          },
        });
        ToastAlerta("Departamento atualizado com sucesso", "sucesso");
      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout();
        } else {
          ToastAlerta('Erro ao atualizar o Departamento!', 'erro');
        }
      }
    } else {
      try {
        await cadastrar(`/departamentos`, departamento, setDepartamento, {
          headers: {
            Authorization: token,
          },
        });
        ToastAlerta("Departamento cadastrado com sucesso", "sucesso");
      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout();
        } else {
          ToastAlerta('Erro ao cadastrar o Departamento!', 'erro');
        }
      }
    }

    setIsLoading(false);
    retornar();
  }

  function retornar() {
    navigate("/departamentos");
  }

  return (
    <div className="container flex flex-col mx-auto items-center">
      {/* Header */}
      <h1 className="text-4xl text-center my-8">
        {isEditing ? "Editar Departamento" : "Cadastrar Departamento"}
      </h1>

      {/* Form Container */}
      <div className="flex flex-col w-full max-w-2xl gap-4 mb-8">
        <form
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          onSubmit={gerarNovoDepartamento}
        >
          {/* Descrição */}
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="descricao" className="text-sm font-semibold text-gray-700">
              Descrição
            </label>
            <input
              type="text"
              placeholder="Descrição do Departamento"
              id="descricao"
              name="descricao"
              required
              value={departamento.descricao || ""}
              onChange={atualizarEstado}
              className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
                erros.descricao
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              }`}
            />
            {erros.descricao && (
              <span className="text-red-500 text-xs">{erros.descricao}</span>
            )}
          </div>

          {/* Ícone */}
          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="icone" className="text-sm font-semibold text-gray-700">
              Ícone (URL)
            </label>
            <input
              type="url"
              placeholder="https://..."
              id="icone"
              name="icone"
              value={departamento.icone || ""}
              onChange={atualizarEstado}
              className={`border-2 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
                erros.icone
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              }`}
            />
            {erros.icone && (
              <span className="text-red-500 text-xs">{erros.icone}</span>
            )}
            <p className="text-xs text-gray-500">
              Deixe em branco para usar o ícone padrão
            </p>
          </div>

          {/* Botão Submit */}
          <div className="flex justify-center pt-3">
            <button
              type="submit"
              disabled={isLoading}
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
  );
}

export default FormDepartamento;