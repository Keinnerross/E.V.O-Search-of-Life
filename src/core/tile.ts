export type TipoTile = 'profundo' | 'mediano' | 'bajo' | 'playa' | 'aguaDulce' | 'roca' | 'colinas' | 'montañas' | 'otro';

export class Tile {
  tipo: TipoTile;
  agua: number;
  color: number; // puedes calcularlo según el estado

  constructor(tipo: TipoTile) {
    this.tipo = tipo;
    this.agua = 0;
    this.color = getColorForTipo(tipo);
  }
}

// Función auxiliar para color (puedes mejorarla)
export function getColorForTipo(tipo: TipoTile): number {
  switch (tipo) {
    case 'profundo': return 0x0a457d;
    case 'mediano': return 0x1d6cb6;
    case 'bajo': return 0x2897ff;
    case 'playa': return 0x23c0ff;
    case 'aguaDulce': return 0x64dff7;
    case 'roca': return 0xaaaaaa;
    case 'colinas': return 0x777777;
    case 'montañas': return 0x515151;

    default: return 0x000; // Otro
  }
}
