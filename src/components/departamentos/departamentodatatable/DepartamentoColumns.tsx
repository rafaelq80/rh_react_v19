import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import type Departamento from "../../../models/Departamento";

const columnHelper = createColumnHelper<Departamento>();

export function createDepartamentoColumns() {
  const navigate = useNavigate();

  return [
    columnHelper.accessor("icone", {
      header: "Ícone",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <div className="w-16 h-16 p-1 relative">
            <img
              src={url}
              alt="Ícone do departamento"
              className="w-full h-full object-cover rounded-full shadow-sm"
              onError={(e) => {
                e.currentTarget.src =
                  "https://ik.imagekit.io/vzr6ryejm/rh/icones/smiley-sad.svg?updatedAt=1730246853172";
              }}
            />
          </div>
        ) : (
          <div className="w-12 h-12 bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-gray-500 text-xs font-semibold">N/A</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("descricao", {
      header: "Descrição",
      cell: (info) => (
        <span className="font-medium text-gray-800">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Ações",
      cell: (info) => {
        const id = info.row.original.id;
        return (
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={() => navigate(`/atualizardepartamento/${id}`)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
              aria-label="Editar departamento"
            >
              <PencilIcon 
                size={20} 
                className="text-blue-500 group-hover:text-blue-700 transition-colors" 
              />
            </button>

            <button 
              onClick={() => navigate(`/deletardepartamento/${id}`)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
              aria-label="Excluir departamento"
            >
              <TrashIcon 
                size={20} 
                className="text-red-500 group-hover:text-red-700 transition-colors" 
              />
            </button>
          </div>
        );
      },
    }),
  ];
}