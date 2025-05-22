export function calcularAjustePorHora(hora: number): number {
  if (hora >= 13 && hora < 15) return 6;
  if (hora >= 10 && hora < 13) return 4.5;
  if (hora >= 8 && hora < 10) return 3;
  if (hora >= 6 && hora < 8) return 2;
  if (hora >= 15 && hora < 17) return 3.5;
  if (hora >= 17 && hora < 19) return 2.5;
  if (hora >= 19 && hora < 21) return 1;
  if (hora >= 21 || hora < 4) return -3.5;
  if (hora >= 4 && hora < 6) return -4.5;
  return -3.5;
}
