import { Tile, getColorForTipo } from './tile';
import type { TipoTile } from './tile';
import type { Estacion } from './estaciones';
import { getEstacion, getTempBaseEstacion } from './estaciones';
import { calcularAjustePorHora } from './tiempo';
import { simularAguaEnTiles } from './agua';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

function mapValue(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export class Planeta {
  tiempo = 0;
  temperatura = 15;
  estacion: Estacion = 'primavera';
  horaDelDia = 0;
  nubes = 0;

  tiles: Tile[][];
  mapWidth: number;
  mapHeight: number;

  constructor(mapWidth: number, mapHeight: number) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.tiles = [];



    for (let y = 0; y < mapHeight; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        const cx = x - mapWidth / 2;
        const cy = y - mapHeight / 2;
        const distNorm = Math.sqrt(cx * cx + cy * cy) / (Math.max(mapWidth, mapHeight) / 2);
        let noise = noise2D(x / 48, y / 48);
        noise = mapValue(noise, -1, 1, 0, 1);
        let continentalidad = Math.pow(1 - distNorm, 1.7) * noise;

        let tipo: TipoTile = 'profundo';
        if (continentalidad > 0.16) tipo = 'mediano';
        if (continentalidad > 0.21) tipo = 'bajo';
        if (continentalidad > 0.25) tipo = 'roca';
        if (continentalidad > 0.40) tipo = 'colinas';
        if (continentalidad > 0.55) tipo = 'montañas';

        const borde = 6;
        if (
          x < borde || y < borde ||
          x > mapWidth - borde - 1 ||
          y > mapHeight - borde - 1
        ) {
          tipo = 'profundo';
        }

        this.tiles[y][x] = new Tile(tipo);
      }
    }





  }





  private actualizarCostasSecas() {
    for (let y = 1; y < this.mapHeight - 1; y++) {
      for (let x = 1; x < this.mapWidth - 1; x++) {
        const tile = this.tiles[y][x];

        if (tile.tipo === 'bajo' || tile.tipo === 'costaSeca') {
          if (this.nubes <= 9) {
            tile.setTipo('costaSeca');
          } else {
            tile.setTipo('bajo');
          }
        }
      }
    }
  }


  avanzarTiempo() {
    this.tiempo++;

    const diaDelAño = this.tiempo % 360;
    this.estacion = getEstacion(diaDelAño);
    const tempBase = getTempBaseEstacion(this.estacion);

    this.horaDelDia = this.tiempo % 24;
    const tempOffset = calcularAjustePorHora(this.horaDelDia);
    const temperaturaObjetivo = tempBase + tempOffset;
    const cambio = (temperaturaObjetivo - this.temperatura) * 0.2;
    this.temperatura += cambio;

    const rangosNube: Record<Estacion, { min: number; max: number }> = {
      invierno: { min: 60, max: 80 },
      otoño: { min: 30, max: 40 },
      primavera: { min: 10, max: 25 },
      verano: { min: 0, max: 5 },
    };

    const { min, max } = rangosNube[this.estacion];

    if (this.nubes < min) {
      this.nubes += Math.random() * 1.5;
    } else if (this.nubes > max) {
      this.nubes -= Math.random() * 1.5;
    } else {
      this.nubes += (Math.random() - 0.5) * 2;
    }

    this.nubes = Math.max(0, Math.min(100, this.nubes));

    this.nubes = simularAguaEnTiles(this.tiles, this.temperatura, this.nubes);

    this.actualizarCostasSecas();
  }
}
