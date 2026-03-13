import {
  MagnifyingGlassIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type Departamento from '../../../models/Departamento'
import { createDepartamentoColumns } from './DepartamentoColumns'

interface DepartamentoDataTableProps {
  departamentos: Departamento[]
}

function DepartamentoDataTable({ departamentos }: DepartamentoDataTableProps) {
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = createDepartamentoColumns()

  const table = useReactTable({
    data: departamentos,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Barra de Pesquisa e Botão */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="departamento"
            name="departamento"
            placeholder="Pesquisar departamentos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
              transition-all duration-300 text-sm"
          />
        </div>
        <button
          onClick={() => navigate('/cadastrardepartamento')}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-slate-600 to-slate-700 
            hover:from-slate-700 hover:to-slate-800 px-6 py-2.5 text-white font-bold rounded-xl
            shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
        >
          <PlusIcon size={20} />
          <span className="hidden sm:inline">Novo Departamento</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          {table.getFlatHeaders().map((header, index) => {
            const colSpan = index === 0 || index === 2 ? 'col-span-1' : 'col-span-10'
            return (
              <div
                key={header.id}
                className={`${colSpan} py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wider
                  cursor-pointer hover:bg-gray-200 transition-colors duration-200
                  ${index === 0 || index === 2 ? 'text-center' : 'text-left'}`}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            )
          })}
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-12 hover:bg-gray-50 transition-colors duration-200"
            >
              {row.getVisibleCells().map((cell, index) => {
                const colSpan = index === 0 || index === 2 ? 'col-span-1' : 'col-span-10'
                return (
                  <div
                    key={cell.id}
                    className={`${colSpan} flex items-center px-4 py-4 text-sm
                      ${index === 0 || index === 2 ? 'justify-center' : 'justify-start'}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows.map((row) => {
          const departamento = row.original
          return (
            <div
              key={row.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 space-y-4
                hover:shadow-xl transition-all duration-300"
            >
              {/* Header do Card - Ícone e Descrição */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0">
                  <img
                    src={departamento.icone || "https://ik.imagekit.io/vzr6ryejm/rh/icones/smiley-sad.svg?updatedAt=1730246853172"}
                    alt={departamento.descricao}
                    className="w-full h-full object-cover rounded-full border-2 border-slate-500 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://ik.imagekit.io/vzr6ryejm/rh/icones/smiley-sad.svg?updatedAt=1730246853172";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {departamento.descricao}
                  </h3>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => navigate(`/atualizardepartamento/${departamento.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600
                    text-white font-semibold py-2.5 rounded-lg transition-colors duration-200
                    active:scale-95"
                >
                  <PencilIcon size={18} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => navigate(`/deletardepartamento/${departamento.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                    text-white font-semibold py-2.5 rounded-lg transition-colors duration-200
                    active:scale-95"
                >
                  <TrashIcon size={18} />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 
        bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg border-2 border-gray-300 hover:border-slate-500 
              hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-95"
            aria-label="Página anterior"
          >
            <CaretLeftIcon size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg border-2 border-gray-300 hover:border-slate-500 
              hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-95"
            aria-label="Próxima página"
          >
            <CaretRightIcon size={20} className="text-gray-700" />
          </button>
        </div>
        <span className="text-sm font-medium text-gray-600">
          Página <span className="font-bold text-slate-600">{table.getState().pagination.pageIndex + 1}</span> de{' '}
          <span className="font-bold text-slate-600">{table.getPageCount()}</span>
        </span>
      </div>
    </div>
  )
}

export default DepartamentoDataTable