import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import type Colaborador from '../../../models/Colaborador'

interface FormCalcularSalarioProps {
  colaborador: Colaborador
  onClose: () => void
}

function FormCalcularSalario({ colaborador, onClose }: Readonly<FormCalcularSalarioProps>) {
  const navigate = useNavigate()
  
  // Estados para os campos do formulário
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1)
  const [totalHorasExtras, setTotalHorasExtras] = useState<number>(0)
  const [descontos, setDescontos] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validação simples dos campos
  const isValid = mes >= 1 && mes <= 12 && totalHorasExtras >= 0 && descontos >= 0

  // Ao submeter, navega para a tela de cálculo com os dados preenchidos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || !colaborador?.id) return
    
    setIsSubmitting(true)
    
    try {
      navigate(`/calcularsalario/${colaborador.id}`, {
        state: {
          mes,
          totalHorasExtras,
          descontos,
          colaborador
        }
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo de seleção de mês */}
      <div>
        <label 
          htmlFor="mes"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Mês de Referência
        </label>
        <select
          id="mes"
          name="mes"
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200
            text-gray-800 font-medium bg-white hover:border-gray-400"
          disabled={isSubmitting}
        >
          <option value={1}>Janeiro</option>
          <option value={2}>Fevereiro</option>
          <option value={3}>Março</option>
          <option value={4}>Abril</option>
          <option value={5}>Maio</option>
          <option value={6}>Junho</option>
          <option value={7}>Julho</option>
          <option value={8}>Agosto</option>
          <option value={9}>Setembro</option>
          <option value={10}>Outubro</option>
          <option value={11}>Novembro</option>
          <option value={12}>Dezembro</option>
        </select>
      </div>

      {/* Campo de horas extras */}
      <div>
        <label 
          htmlFor="totalHorasExtras"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Horas Extras
        </label>
        <NumericFormat
          id="totalHorasExtras"
          value={totalHorasExtras}
          onValueChange={(values) => setTotalHorasExtras(values.floatValue || 0)}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={0}
          allowNegative={false}
          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200
            text-gray-800 font-medium bg-white hover:border-gray-400"
          disabled={isSubmitting}
          placeholder="0"
        />
      </div>

      {/* Campo de descontos */}
      <div>
        <label 
          htmlFor="descontos"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Descontos (R$)
        </label>
        <NumericFormat
          id="descontos"
          value={descontos}
          onValueChange={(values) => setDescontos(values.floatValue || 0)}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          prefix="R$ "
          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200
            text-gray-800 font-medium bg-white hover:border-gray-400"
          disabled={isSubmitting}
          placeholder="R$ 0,00"
        />
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3 pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold 
            rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-linear-to-r from-slate-600 to-slate-700 
            hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-lg 
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Processando..." : "Prosseguir"}
        </button>
      </div>
    </form>
  )
}

export default FormCalcularSalario