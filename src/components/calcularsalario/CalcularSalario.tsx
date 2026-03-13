import { ArrowLeftIcon, CalendarBlankIcon, PrinterIcon } from '@phosphor-icons/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import AuthContext from '../../contexts/AuthContext';
import { cadastrar } from '../../services/Service';
import { getErrorMessage } from '../../utils/ErrorMessage';
import { formatarMoeda } from '../../utils/FormatarMoeda';
import { ToastAlerta } from '../../utils/ToastAlerta';
import Holerite from './holerite/Holerite';
import { type CalculoResponse } from './interfaces/CalculoResposta';
import { type CalculoSalarioState } from './interfaces/CalculoSalarioState';

// Lista dos meses do ano
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function CalcularSalario() {
  // Pega o ID da URL
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, handleLogout } = useContext(AuthContext);

  // Pega os dados que vieram do formulário
  const state = location.state as CalculoSalarioState | undefined;

  // Estados do componente
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CalculoResponse | null>(null);

  // Busca o cálculo do salário na API
  async function buscarCalculoSalario() {
    setIsLoading(true);
    setError(null);
    
    try {
      await cadastrar(
        `/colaboradores/calcularsalario/${id}`,
        {
          totalHorasExtras: state?.totalHorasExtras ?? 0,
          descontos: state?.descontos ?? 0,
        },
        setResultado,
        {
          headers: {
            Authorization: usuario.token,
          },
        }
      );
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      if (errorMsg.includes('401')) {
        handleLogout();
      } else {
        setError('Erro ao calcular salário. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Executa quando a página carrega
  useEffect(() => {
    if (!state || !id) {
      setError('Dados inválidos para o cálculo');
      setIsLoading(false);
      return;
    }
    buscarCalculoSalario();
  }, [id, state]);

  // Verifica se o usuário está logado
  useEffect(() => {
    if (usuario.token === '') {
      ToastAlerta('Você precisa estar logado!', 'info');
      navigate('/');
    }
  }, [usuario.token, navigate]);

  // Se não tem dados, mostra mensagem de erro
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12 max-w-md w-full text-center space-y-6">
          <div className="text-red-600 text-xl font-semibold">Dados não encontrados</div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-slate-600 to-slate-700 
              hover:from-slate-700 hover:to-slate-800 px-6 py-3 text-white font-bold rounded-xl
              shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <ArrowLeftIcon size={20} />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Botão Voltar e Título */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium
              transition-colors duration-200"
          >
            <ArrowLeftIcon size={24} />
            <span className="hidden sm:inline">Voltar</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Holerite
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Card do Holerite */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Cabeçalho com dados do colaborador */}
          <div className="bg-linear-to-r from-slate-600 to-slate-700 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {state.colaborador.nome}
                </h2>
                <p className="text-slate-200 text-sm">
                  {state.colaborador.cargo}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CalendarBlankIcon size={20} className="text-white" />
                <span className="text-white font-semibold">
                  {MESES[(state.mes || 1) - 1]} {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="p-6">
            {isLoading && <TelaCarregando />}
            {error && <TelaErro mensagem={error} />}
            {resultado && <ResumoDoCalculo resultado={resultado} state={state} />}
          </div>

          {/* Rodapé com botões */}
          {resultado && (
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300
                    text-gray-800 font-semibold rounded-xl transition-all duration-200 active:scale-95"
                >
                  <ArrowLeftIcon size={20} />
                  Voltar
                </button>
                
                <PDFDownloadLink
                  document={<Holerite resultado={resultado} state={state} />}
                  fileName={`holerite-${state.colaborador.nome.replace(/\s+/g, '-')}-${MESES[(state.mes || 1) - 1]}.pdf`}
                >
                  {({ loading }) => (
                    <button
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r 
                        from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white 
                        font-semibold rounded-xl transition-all duration-200 active:scale-95
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PrinterIcon size={20} />
                      {loading ? 'Gerando PDF...' : 'Baixar PDF'}
                    </button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente: Tela de Carregamento
function TelaCarregando() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <SyncLoader color="#18181b" size={16} />
      <span className="mt-4 text-base text-gray-600 font-medium">
        Calculando salário...
      </span>
    </div>
  );
}

// Componente: Tela de Erro
function TelaErro({ mensagem }: { mensagem: string }) {
  return (
    <div className="p-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl mb-4 text-center">
      <p className="font-semibold">{mensagem}</p>
    </div>
  );
}

// Componente: Resumo do Cálculo
function ResumoDoCalculo({ 
  resultado, 
  state 
}: { 
  resultado: CalculoResponse; 
  state: CalculoSalarioState 
}) {
  return (
    <div className="space-y-6">
      
      {/* Cards com os valores principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <CardValor 
          titulo="Salário Base" 
          valor={resultado.salario}
          corFundo="bg-blue-50"
          corTexto="text-blue-700"
        />
        
        <CardValor 
          titulo="Horas Extras" 
          valor={resultado.valorTotalHorasExtras}
          corFundo="bg-green-50"
          corTexto="text-green-700"
        />
        
        <CardValor 
          titulo="Total Descontos" 
          valor={resultado.totalDescontos}
          corFundo="bg-red-50"
          corTexto="text-red-700"
        />
        
        <CardValor 
          titulo="Salário Líquido" 
          valor={resultado.salarioLiquido}
          corFundo="bg-gradient-to-br from-slate-600 to-slate-700"
          corTexto="text-white"
          destacado
        />
      </div>

      {/* Seção de Detalhes */}
      <div className="bg-linear-to-br from-slate-50 to-gray-50 rounded-xl p-6 border-2 border-slate-200">
        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-slate-600 rounded"></span>
          Detalhes do Cálculo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <ItemDetalhe 
            nome="Horas extras trabalhadas" 
            valor={`${state.totalHorasExtras}h`} 
          />
          
          {state.totalHorasExtras > 0 && (
            <ItemDetalhe 
              nome="Valor por hora extra" 
              valor={formatarMoeda(resultado.valorHoraExtra)} 
            />
          )}
          
          <ItemDetalhe 
            nome="INSS descontado" 
            valor={formatarMoeda(resultado.inss)} 
          />
          
          <ItemDetalhe 
            nome="IRRF descontado" 
            valor={formatarMoeda(resultado.irrf)} 
          />
          
          <ItemDetalhe 
            nome="Outros descontos" 
            valor={formatarMoeda(state.descontos)} 
          />
          
          <ItemDetalhe 
            nome="Mês de referência" 
            valor={MESES[(state.mes || 1) - 1]} 
          />
        </div>
      </div>
    </div>
  );
}

// Componente: Card de Valor
function CardValor({ 
  titulo, 
  valor, 
  corTexto = 'text-gray-700', 
  corFundo = 'bg-gray-50',
  destacado = false
}: { 
  titulo: string; 
  valor: number; 
  corTexto?: string; 
  corFundo?: string;
  destacado?: boolean;
}) {
  return (
    <div className={`p-5 rounded-xl ${corFundo} ${destacado ? 'shadow-lg' : 'border-2 border-gray-200'} 
      transition-all duration-200 hover:shadow-md`}>
      <span className={`text-sm font-medium block mb-2 ${destacado ? 'text-slate-200' : 'text-gray-600'}`}>
        {titulo}
      </span>
      <span className={`text-2xl font-bold ${corTexto}`}>
        {formatarMoeda(valor)}
      </span>
    </div>
  );
}

// Componente: Item de Detalhe
function ItemDetalhe({ nome, valor }: { nome: string; valor: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
      <span className="text-sm font-medium text-gray-600">{nome}</span>
      <span className="text-sm font-bold text-slate-700">{valor}</span>
    </div>
  );
}

export default CalcularSalario;