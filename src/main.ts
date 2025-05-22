/**
 * Entrypoint principal de la simulación planetaria.
 *
 * - Inicializa el motor Pixi.js y el canvas.
 * - Crea la instancia del mundo (Planeta) y la interfaz (UI).
 * - Añade partículas y objetos animados al escenario.
 * - Maneja el ciclo de tiempo, lógica y render en cada frame.
 *
 * Autor: Keinner Ross (Ross)
 */



import { Graphics } from 'pixi.js';
import { initApp, app, planeta, wrapPosition } from './render/render';
import { Planeta } from './core/planeta';
import { crearUI, actualizarUI } from './ui/ui';
import { actualizarLuz } from './render/luz';
import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE } from '../config';
import { tilemap } from './render/render';
import {
  poblarNubesVisuales,
  actualizarNubesVisuales,
  sincronizarNubesVisuales,
} from './render/nubes';





interface PuntoConVel extends Graphics {
  vel: {
    x: number;
    y: number;
  };
}


const mundo = new Planeta(MAP_WIDTH, MAP_HEIGHT);
const compuestos: Graphics[] = [];

await initApp();

tilemap.actualizarDesdePlaneta(mundo.tiles);

poblarNubesVisuales(app, 0);

crearUI();



// Crear partículas iniciales
for (let i = 0; i < 50; i++) {
  const punto = new Graphics() as PuntoConVel;
  punto.circle(0, 0, 5).fill({ color: 0x154260 });

  punto.x = Math.random() * app.screen.width;
  punto.y = Math.random() * app.screen.height;
  punto.vel = {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
  };

  planeta.addChild(punto);
  compuestos.push(punto);
}

// Ajustes del tiempo:
let frameCounter = 0;
const ticksPorDia = 10;

app.ticker.add(() => {
  frameCounter++;

  if (frameCounter >= ticksPorDia) {
    mundo.avanzarTiempo();

    sincronizarNubesVisuales(app, mundo.nubes);

    tilemap.actualizarDesdePlaneta(mundo.tiles);

    actualizarUI(mundo);
    frameCounter = 0;
  }

  actualizarLuz(mundo.horaDelDia, mundo.estacion);

  actualizarNubesVisuales(app);

  for (const p of compuestos as PuntoConVel[]) {
    p.x += p.vel.x;
    p.y += p.vel.y;
    wrapPosition(p);
  }
});