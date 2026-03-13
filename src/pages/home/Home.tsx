import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const { usuario, isLogout } = useContext(AuthContext);
  const token = usuario.token;

  useEffect(() => {
    if (token === "") {
      if (!isLogout) {
        ToastAlerta("Você precisa estar logado!", "info");
      }
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex justify-center items-center overflow-hidden relative">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-1000"></div>
      
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 lg:px-12 py-12 relative z-10">
        {/* Coluna de Texto */}
        <div className="flex flex-col gap-6 items-center lg:items-start justify-center py-8 lg:py-4 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
          <div className="space-y-4">
            <h2 className="text-slate-900 text-5xl lg:text-6xl font-bold leading-tight opacity-0 animate-[slideInLeft_0.6s_ease-out_forwards]">
              Seja Bem-vinde!
            </h2>
            
            <div className="h-1 w-24 bg-linear-to-r from-slate-600 to-slate-400 rounded-full opacity-0 animate-[slideInLeft_0.6s_ease-out_0.2s_forwards]"></div>
            
            <p className="text-slate-700 text-xl lg:text-2xl leading-relaxed opacity-0 animate-[slideInLeft_0.6s_ease-out_0.3s_forwards]">
              A escolha inteligente para o RH do futuro!
            </p>
            
            <p className="text-slate-600 text-lg opacity-0 animate-[slideInLeft_0.6s_ease-out_0.4s_forwards]">
              Gestão completa de pessoas em uma única plataforma.
            </p>
          </div>

          {/* Cards de recursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full max-w-2xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.5s_forwards]">
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Gestão de Colaboradores</h3>
              <p className="text-slate-600 text-sm">Centralize informações e acompanhe sua equipe</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.6s_forwards]">
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Gestão de Departamentos</h3>
              <p className="text-slate-600 text-sm">Organize estruturas e facilite a comunicação interna</p>
            </div>
          </div>
        </div>

        {/* Coluna de Imagem */}
        <div className="flex justify-center items-center lg:justify-end opacity-0 animate-[fadeInRight_0.8s_ease-out_forwards]">
          <div className="relative">
            {/* Efeito de brilho atrás da imagem */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-400 to-slate-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            
            <img
              src="https://ik.imagekit.io/vzr6ryejm/rh/home.png?updatedAt=1730235086146"
              alt="Imagem Página Home"
              className="relative w-full max-w-lg drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

export default Home;