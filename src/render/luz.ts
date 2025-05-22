import { luz, app } from './render';
import * as PIXI from 'pixi.js';

export function actualizarLuz(hora: number) {
    const intensidad = calcularOscuridad(hora); // 0 = día, 1 = noche

    const width = app.screen.width;
    const height = app.screen.height;

    if (luz.texture) {
        luz.texture.destroy(true); // previene que se acumulen texturas en la GPU
    }

    const texture = crearGradienteRadial(width, height, intensidad);
    luz.texture = texture;
    luz.width = width;
    luz.height = height;
}

function calcularOscuridad(hora: number): number {
    if (hora >= 7 && hora < 17) return 0; // pleno día
    if (hora >= 5 && hora < 7) return 0.8 - ((hora - 5) / 2) * 0.8; // amanecer
    if (hora >= 17 && hora < 19) return ((hora - 17) / 2) * 0.8; // atardecer
    return 0.8; // noche cerrada
}

function crearGradienteRadial(width: number, height: number, alpha: number): PIXI.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(
        width / 2, height / 2, width / 5, // centro claro
        width / 2, height / 2, width / 1.1 // bordes oscuros
    );

    gradient.addColorStop(0, `rgba(0,0,0,0)`);
    gradient.addColorStop(1, `rgba(0,0,0,${alpha})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return PIXI.Texture.from(canvas);
}
