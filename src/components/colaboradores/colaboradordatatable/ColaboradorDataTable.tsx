import {
  MagnifyingGlassIcon,
  PlusIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PencilIcon,
  TrashIcon,
  CurrencyCircleDollar,
  BriefcaseIcon,
  EnvelopeIcon,
} from "@phosphor-icons/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type Colaborador from "../../../models/Colaborador";
import CalcularSalarioModal from '../../calcularsalario/modal/CalcularSalarioModal';
import { createColaboradorColumns } from "./ColaboradorColumns";
import { formatarMoeda } from "../../../utils/FormatarMoeda";

interface ColaboradorDataProps {
  colaboradores: Colaborador[];
}

function ColaboradorDataTable({ colaboradores }: Readonly<ColaboradorDataProps>) {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSalario = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    setIsPopupOpen(false);
    setSelectedColaborador(null);
  };

  const columns = createColaboradorColumns({
    onSalario: handleSalario,
    navigate,
  });

  const table = useReactTable({
    data: colaboradores,
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
  });

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
            id="colaborador"
            name="colaborador"
            placeholder="Pesquisar colaboradores..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
              transition-all duration-300 text-sm"
          />
        </div>
        <button
          onClick={() => navigate("/cadastrarcolaborador")}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-slate-600 to-slate-700 
            hover:from-slate-700 hover:to-slate-800 px-6 py-2.5 text-white font-bold rounded-xl
            shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 whitespace-nowrap"
        >
          <PlusIcon size={20} />
          <span className="hidden sm:inline">Novo Colaborador</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          {table.getFlatHeaders().map((header, index) => {
            const colSpan = index === 0 || index === 6 ? 'col-span-1' : 'col-span-2'
            return (
              <div
                key={header.id}
                className={`${colSpan} py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wider
                  cursor-pointer hover:bg-gray-200 transition-colors duration-200
                  ${index === 0 || index === 6 ? 'text-center' : 'text-left'}`}
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
                const colSpan = index === 0 || index === 6 ? 'col-span-1' : 'col-span-2'
                const justifyCenter = index === 0 || index === 6
                return (
                  <div
                    key={cell.id}
                    className={`${colSpan} flex items-center px-4 py-4 text-sm
                      ${justifyCenter ? 'justify-center' : 'justify-start'}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Cards Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {table.getRowModel().rows.map((row) => {
          const colaborador = row.original
          
          return (
            <div
              key={row.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 space-y-4
                hover:shadow-xl transition-all duration-300"
            >
              {/* Header do Card - Foto e Nome */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0">
                  <img
                    src={colaborador.foto || "https://ik.imagekit.io/vzr6ryejm/profile/usuario.svg?updatedAt=1729485119852"}
                    alt={colaborador.nome}
                    className="w-full h-full object-cover rounded-full border-2 border-slate-500 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://ik.imagekit.io/vzr6ryejm/profile/usuario.svg?updatedAt=1729485119852";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg truncate">
                    {colaborador.nome}
                  </h3>
                  <div className="flex items-center gap-2 text-green-600 font-bold mt-1">
                    <span>{formatarMoeda(colaborador.salario)}</span>
                  </div>
                </div>
              </div>

              {/* Informações Principais */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <EnvelopeIcon size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-500">E-mail:</span>
                  <span className="text-gray-700 truncate">{colaborador.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BriefcaseIcon size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-500">Cargo:</span>
                  <span className="text-gray-700">{colaborador.cargo}</span>
                </div>
              </div>

              {/* Departamento */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Departamento
                </p>
                <div className="flex items-center gap-3">
                  {colaborador.departamento?.icone ? (
                    <div className="w-10 h-10 shrink-0">
                      <img
                        src={colaborador.departamento.icone}
                        alt={colaborador.departamento.descricao}
                        className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://ik.imagekit.io/vzr6ryejm/rh/icones/smiley-sad.svg?updatedAt=1730246853172";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs font-semibold">N/A</span>
                    </div>
                  )}
                  <span className="text-gray-700 font-medium">
                    {colaborador.departamento?.descricao || 'Sem departamento'}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/atualizarcolaborador/${colaborador.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600
                    text-white font-semibold py-2.5 rounded-lg transition-colors duration-200
                    active:scale-95"
                >
                  <PencilIcon size={18} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleSalario(colaborador)}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600
                    text-white font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200
                    active:scale-95"
                >
                  <CurrencyCircleDollar size={18} />
                </button>
                <button
                  onClick={() => navigate(`/deletarcolaborador/${colaborador.id}`)}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                    text-white font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200
                    active:scale-95"
                >
                  <TrashIcon size={18} />
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

      {/* Modal de Calcular Salário */}
      {selectedColaborador && (
        <CalcularSalarioModal 
          isOpen={isPopupOpen} 
          onClose={handleCloseModal}
          colaborador={selectedColaborador}
        />
      )}
    </div>
  );
}

export default ColaboradorDataTable;