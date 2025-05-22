import { Application, Container, Sprite, Graphics } from 'pixi.js';
import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE } from '../../config';
import { Tile } from '../core/tile'; // Ajusta el path según tu proyecto












export let app: Application;
export const planeta = new Container();
export const luz = new Sprite();

// ---- Tilemap ----
const tileSize = TILE_SIZE;
const mapWidth = MAP_WIDTH;
const mapHeight = MAP_HEIGHT;

// Tipo auxiliar para guardar el color anterior de cada tile
type TileCell = {
  gfx: Graphics;
  color: number;
};

export class Tilemap {
  tiles: TileCell[][];
  container: Container;

  constructor() {
    this.container = new Container();
    this.tiles = [];

    for (let y = 0; y < mapHeight; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        const tile = new Graphics();
        const defaultColor = 0x00000f; // Color por defecto (puedes poner 0x000000 si prefieres)
        tile.rect(0, 0, tileSize, tileSize);
        tile.fill(defaultColor);
        tile.x = x * tileSize;
        tile.y = y * tileSize;
        this.container.addChild(tile);
        this.tiles[y][x] = { gfx: tile, color: defaultColor };
      }
    }
  }

  // Nuevo método: actualiza visualmente el mapa según el array lógico de tiles
  actualizarDesdePlaneta(tilesData: Tile[][]) {
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const tileLogico = tilesData[y][x];
        const tileVisual = this.tiles[y][x];
        if (tileVisual.color !== tileLogico.color) {
          tileVisual.gfx.clear();
          tileVisual.gfx.rect(0, 0, tileSize, tileSize);
          tileVisual.gfx.fill(tileLogico.color);
          tileVisual.color = tileLogico.color;
        }
      }
    }
  }

  // (Opcional) Mantén este método si quieres cambiar solo un tile específico
  setTileColor(x: number, y: number, color: number) {
    const tileCell = this.tiles[y][x];
    if (tileCell.color === color) return;

    tileCell.gfx.clear();
    tileCell.gfx.rect(0, 0, tileSize, tileSize);
    tileCell.gfx.fill(color);
    tileCell.color = color;
  }
}

export let tilemap: Tilemap;

export const initApp = async (): Promise<void> => {
  app = new Application();
  await app.init({
    width: mapWidth * tileSize,
    height: mapHeight * tileSize,
    backgroundColor: 0x0b0c10,
    antialias: true,
  });

  document.body.appendChild(app.canvas);

  tilemap = new Tilemap();
  app.stage.addChild(tilemap.container);

  app.stage.addChild(planeta);
  app.stage.addChild(luz);
};



export function wrapPosition(sprite: any) {
  const { width, height } = app.screen;
  if (sprite.x < 0) sprite.x = width;
  else if (sprite.x > width) sprite.x = 0;
  if (sprite.y < 0) sprite.y = height;
  else if (sprite.y > height) sprite.y = 0;
}
