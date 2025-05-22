export type Estacion = 'primavera' | 'verano' | 'otoño' | 'invierno';

export function getEstacion(diaDelAño: number): Estacion {
  if (diaDelAño < 90) return 'primavera';
  else if (diaDelAño < 180) return 'verano';
  else if (diaDelAño < 270) return 'otoño';
  else return 'invierno';
}

export function getTempBaseEstacion(estacion: Estacion): number {
  return {
    verano: 78,
    primavera: 70,
    otoño: 62,
    invierno: 54,
  }[estacion];
}
