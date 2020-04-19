import Cursor from "@scripts/Cursor/index";
import MapTileset from "@scripts/MapTileset";

export default class MapRenderer {
  scene: Phaser.Scene;
  mapTileset: MapTileset;

  currentLayer: Phaser.Tilemaps.StaticTilemapLayer;
  cursor: Cursor;

  constructor(scene: Phaser.Scene, arenaTilset: MapTileset) {
    this.scene = scene;
    this.mapTileset = arenaTilset;

    this.currentLayer = this.mapTileset.layers[0];
    this.cursor = new Cursor(this.scene, this, 0, 0);

    // show grid
    this.createMoveableGrid();
  }

  randomTile(checkCollision: boolean = true) {
    let randomRow = Phaser.Utils.Array.GetRandom(this.currentLayer.layer.data);
    let randomTile = Phaser.Utils.Array.GetRandom(randomRow);

    if (checkCollision) {
      while (randomTile.collides) {
        randomRow = Phaser.Utils.Array.GetRandom(this.currentLayer.layer.data);
        randomTile = Phaser.Utils.Array.GetRandom(randomRow);
      }
    }

    return randomTile;
  }

  currentTile(x: number, y: number) {
    return this.currentLayer.getTileAtWorldXY(x, y);
  }

  upTile(currentTile: Phaser.Tilemaps.Tile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX,
      currentTile.pixelY - this.mapTileset.tileHeight
    );
  }

  rightTile(currentTile: Phaser.Tilemaps.Tile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX + this.mapTileset.tileWidth,
      currentTile.pixelY
    );
  }

  downTile(currentTile: Phaser.Tilemaps.Tile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX,
      currentTile.pixelY + this.mapTileset.tileHeight
    );
  }

  leftTile(currentTile: Phaser.Tilemaps.Tile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX - this.mapTileset.tileWidth,
      currentTile.pixelY
    );
  }

  addRectangleOutline(tileX: number, tileY: number, color: number) {
    const rect = this.scene.add.rectangle(
      tileX + this.mapTileset.tileWidth / 2,
      tileY + this.mapTileset.tileHeight / 2,
      this.mapTileset.tileWidth,
      this.mapTileset.tileHeight,
      Phaser.Display.Color.ValueToColor("0x000000").color,
      0
    );
    rect.setStrokeStyle(1, color);
    return rect;
  }

  addGridSquare(tileX: number, tileY: number, color: number) {
    // remember, grid origins are in the center
    // while tile origins are top left
    const gridSquare = this.scene.add.grid(
      tileX + this.mapTileset.tileWidth / 2,
      tileY + this.mapTileset.tileHeight / 2,
      this.mapTileset.tileWidth,
      this.mapTileset.tileHeight,
      this.mapTileset.tileWidth,
      this.mapTileset.tileHeight,
      color,
      0.25
    );

    return gridSquare;
  }

  createMoveableGrid() {
    this.mapTileset.tiles.forEach((tile) => {
      if (tile.collides) return;
      this.addGridSquare(
        tile.pixelX,
        tile.pixelY,
        Phaser.Display.Color.ValueToColor("0x000000").color
      );
    });
  }
}
