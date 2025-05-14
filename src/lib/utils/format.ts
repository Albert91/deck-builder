import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

/**
 * Formatuje datę do czytelnego formatu.
 * @param dateString - String daty ISO lub obiekt Date
 * @param formatStr - Format daty (domyślnie: 'd MMMM yyyy')
 * @returns Sformatowana data
 */
export function formatDate(dateString: string | Date, formatStr = 'd MMMM yyyy'): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return 'Nieprawidłowa data';
  }

  return format(date, formatStr, { locale: pl });
}

/**
 * Formatuje liczbę dodając separator tysięczny.
 * @param num - Liczba do sformatowania
 * @returns Sformatowana liczba jako string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pl-PL').format(num);
}
