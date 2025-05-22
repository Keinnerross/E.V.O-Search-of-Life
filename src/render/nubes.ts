// nubes.ts
import { Graphics, Application } from 'pixi.js';

export class NubeSprite extends Graphics {
  velocidad: number;
  constructor(x: number, y: number, escala = 1) { // escala razonable
    super();
    this.velocidad = 0.3 + Math.random() * 0.5;
    this.x = x;
    this.y = y;
    this.drawCloud(escala);
    this.alpha = 0.6 + Math.random() * 0.3;
  }
  drawCloud(escala: number) {
    this.clear();
    this.beginFill(0xffffff, 1);
    // Radios grandes: ¡ahora sí son nubes!
    this.drawEllipse(0, 0, 80 * escala, 32 * escala);
    this.drawEllipse(35 * escala, -12 * escala, 55 * escala, 20 * escala);
    this.drawEllipse(-33 * escala, 16 * escala, 36 * escala, 16 * escala);
    this.endFill();
  }
  mover(width: number, height: number) {
    this.x += this.velocidad;
    if (this.x > width + 100) {
      this.x = -100;
      this.y = Math.random() * (height * 0.4);
    }
  }
}

export const nubesVisuales: NubeSprite[] = [];

export function poblarNubesVisuales(app: Application, cantidad: number) {
  for (let i = 0; i < cantidad; i++) {
    const x = Math.random() * app.screen.width;
    const y = Math.random() * (app.screen.height * 0.4);
    const nube = new NubeSprite(x, y, 2 + Math.random() * 1.1);
    app.stage.addChild(nube);
    nubesVisuales.push(nube);
  }
}

export function actualizarNubesVisuales(app: Application) {
  for (const nube of nubesVisuales) {
    nube.mover(app.screen.width, app.screen.height);
  }
}

export function sincronizarNubesVisuales(app: Application, nubesLogicas: number) {
  const target = Math.floor(nubesLogicas / 10);
  // Crea más nubes si faltan
  while (nubesVisuales.length < target) {
    poblarNubesVisuales(app, 1);
  }
  // Elimina si sobran
  while (nubesVisuales.length > target) {
    const nube = nubesVisuales.pop();
    if (nube) app.stage.removeChild(nube);
  }
}
