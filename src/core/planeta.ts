import { Tile } from './tile';
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
  humedad = 50;
  nubes = 0;

  tiles: Tile[][];
  mapWidth: number;
  mapHeight: number;

  constructor(mapWidth: number, mapHeight: number) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.tiles = [];

    // Parche para el shape de UN solo continente central
    for (let y = 0; y < mapHeight; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        const cx = x - mapWidth / 2;
        const cy = y - mapHeight / 2;

        // Normalizamos distancia al centro (para shape circular)
        const distNorm = Math.sqrt(cx * cx + cy * cy) / (Math.max(mapWidth, mapHeight) / 2);

        // Simplex noise, hazlo más “redondeado” usando Math.pow para dar centro dominante
        let noise = noise2D(x / 48, y / 48); // Filtro más suave, baja la frecuencia
        noise = mapValue(noise, -1, 1, 0, 1);

        // Influencia brutal del centro: 
        // Sube el exponente para aplanar (tipo “isla continente”)
        let continentalidad = Math.pow(1 - distNorm, 1.7) * noise;

        // Ahora define los umbrales
        let tipo: TipoTile = 'profundo';
        if (continentalidad > 0.19) tipo = 'mediano';      // lago
        if (continentalidad > 0.23) tipo = 'bajo';         // tierra baja
        if (continentalidad > 0.27) tipo = 'playa';        // playa
        if (continentalidad > 0.25) tipo = 'roca';         // montaña baja
        if (continentalidad > 0.40) tipo = 'colinas';      // colinas

        if (continentalidad > 0.55) tipo = 'montañas';     // montaña alta

        // Opcional: bordes duros de mar
        const borde = 6;
        if (
          x < borde ||
          y < borde ||
          x > mapWidth - borde - 1 ||
          y > mapHeight - borde - 1
        ) {
          tipo = 'profundo';
        }

        this.tiles[y][x] = new Tile(tipo);
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

    this.nubes = simularAguaEnTiles(this.tiles, this.temperatura, this.nubes);

    this.humedad += Math.sin(this.tiempo / 100) * 2;
  }


}
