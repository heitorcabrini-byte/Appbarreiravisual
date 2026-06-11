/**
 * Utilitário simples para combinar classes condicionais de CSS
 * Substitui o uso de clsx / tailwind-merge para evitar erros de dependências no build
 */
export function cn(...inputs: any[]): string {
  return inputs
    .flat()
    .filter(Boolean)
    .map(x => String(x).trim())
    .filter(Boolean)
    .join(' ');
}
