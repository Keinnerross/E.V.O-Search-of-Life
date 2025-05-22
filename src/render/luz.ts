import { luz, app } from './render';
import * as PIXI from 'pixi.js';

export function actualizarLuz(hora: number, estacion: string) {
    const intensidad = calcularOscuridad(hora); // 0 = día, 1 = noche

    const width = app.screen.width;
    const height = app.screen.height;

    if (luz.texture) {
        luz.texture.destroy(true);
    }

    const texture = intensidad === 0
        ? crearFiltroEstacional(width, height, estacion) // Día
        : crearLuzNocturna(width, height, intensidad);   // Noche

    luz.texture = texture;
    luz.width = width;
    luz.height = height;
}

function calcularOscuridad(hora: number): number {
    if (hora >= 7 && hora < 17) return 0; // día
    if (hora >= 5 && hora < 7) return 0.8 - ((hora - 5) / 2) * 0.8; // amanecer
    if (hora >= 17 && hora < 19) return ((hora - 17) / 2) * 0.8; // atardecer
    return 0.8; // noche cerrada
}

function getColorPorEstacion(estacion: string): string {
    switch (estacion) {
        case 'invierno': return 'rgba(10, 30, 80, 0.35)';        // frío sutil
        case 'primavera': return 'rgba(255, 255, 200, 0.07)'; // suave cálido
        case 'verano': return 'rgba(255, 180, 30, 0.2)' // dorado cálido
        case 'otoño': return 'rgba(255, 200, 100, 0.08)'; // naranja suave
        default: return 'rgba(0, 0, 0, 0)';
    }
}

function crearFiltroEstacional(width: number, height: number, estacion: string): PIXI.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = getColorPorEstacion(estacion);
    ctx.fillRect(0, 0, width, height);

    return PIXI.Texture.from(canvas);
}

function crearLuzNocturna(width: number, height: number, alpha: number): PIXI.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(
        width / 2, height / 2, width / 5,
        width / 2, height / 2, width / 1.1
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${alpha.toFixed(2)})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return PIXI.Texture.from(canvas);
}
