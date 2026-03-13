// Função utilitária para extrair mensagem de erro legível
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try {
      return JSON.stringify(error);
    } catch {
      return 'Erro desconhecido';
    }
  }