import type Departamento from "../models/Departamento";

export function validarCampoDepartamento(campo: string, valor: string): string {
  switch (campo) {
    case "descricao":
      if (!valor || valor.trim() === "") {
        return "A descrição é obrigatória";
      }
      if (valor.length < 3) {
        return "A descrição deve ter pelo menos 3 caracteres";
      }
      if (valor.length > 100) {
        return "A descrição deve ter no máximo 100 caracteres";
      }
      break;

    case "icone":
      if (valor && valor.trim() !== "") {
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(valor)) {
          return "O ícone deve ser uma URL válida (http:// ou https://)";
        }
      }
      break;
  }

  return "";
}

export function validarFormularioDepartamento(
  departamento: Departamento
): Record<string, string> {
  const erros: Record<string, string> = {};

  const erroDescricao = validarCampoDepartamento(
    "descricao",
    departamento.descricao || ""
  );
  if (erroDescricao) erros.descricao = erroDescricao;

  const erroIcone = validarCampoDepartamento(
    "icone",
    departamento.icone || ""
  );
  if (erroIcone) erros.icone = erroIcone;

  return erros;
}

export function formularioValido(erros: Record<string, string>): boolean {
  return Object.values(erros).every((erro) => erro === "");
}