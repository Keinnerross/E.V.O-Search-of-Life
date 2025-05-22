/**
 * Simulación del ciclo del agua en el planeta.
 *
 * - Evapora agua de los tiles de tipo profundo, mediano y bajo según la temperatura.
 * - Convierte parte de esa agua evaporada en nubes.
 * - Si hay suficientes nubes, simula precipitación (lluvia) y agrega agua a los tiles.
 *
 * Autor: Keinner Ross (Ross)
 */


import { Tile } from './tile';

export function simularAguaEnTiles(
  tiles: Tile[][],
  temperatura: number,
  nubes: number
): number {
  let nuevasNubes = nubes;

  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[0].length; x++) {
      const tile = tiles[y][x];
      if (tile.tipo === 'profundo' || tile.tipo === 'mediano' || tile.tipo === 'bajo') {
        // Evaporación
        if (temperatura > 25 && tile.agua > 0) {
          let evap = 0;
          if (tile.tipo === 'profundo') evap = tile.agua * 0.02;
          else if (tile.tipo === 'mediano') evap = tile.agua * 0.05;
          else evap = tile.agua * 0.1;
          tile.agua = Math.max(tile.agua - evap, 0);
          nuevasNubes += evap;
        }
        // Lluvia: cae si hay muchas nubes
        if (nuevasNubes > 100) {
          const lluvia = Math.random() * 2;
          tile.agua += lluvia;
          nuevasNubes -= lluvia;
        }
      }
    }
  }
  return nuevasNubes;
}
