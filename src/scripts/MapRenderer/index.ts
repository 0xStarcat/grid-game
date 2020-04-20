import MapTileset from "@scripts/MapTileset";
import GameScene from "@scripts/GameScene";

export default class MapRenderer {
  scene: GameScene;
  mapTileset: MapTileset;

  currentLayer: Phaser.Tilemaps.StaticTilemapLayer;
  pathCircles: Phaser.GameObjects.Arc[];

  constructor(scene: GameScene, mapTileset: MapTileset) {
    this.scene = scene;
    this.mapTileset = mapTileset;
    this.currentLayer = this.mapTileset.layers[0];
    this.pathCircles = [];

    // show grid
    this.createMoveableGrid();
  }

  tileAt(x: number, y: number) {
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

  addPathCircles(path: Phaser.Tilemaps.Tile[]): void {
    this.clearPathCircles();
    path.forEach((tile) => {
      const tileIndex = path.indexOf(tile);
      const prevTile = path[tileIndex - 1];

      // adds path circle to prev / current tile connecting face
      if (prevTile === this.upTile(tile)) {
        this.addPathCircle(tile, "up");
      } else if (prevTile === this.rightTile(tile)) {
        this.addPathCircle(tile, "right");
      } else if (prevTile === this.downTile(tile)) {
        this.addPathCircle(tile, "down");
      } else if (prevTile === this.leftTile(tile)) {
        this.addPathCircle(tile, "left");
      }

      this.addPathCircle(tile, "center");
    });
  }

  addPathCircle(
    tile: Phaser.Tilemaps.Tile,
    face: "up" | "right" | "down" | "left" | "center"
  ) {
    const centerX = this.mapTileset.tileWidth / 2;
    const centerY = this.mapTileset.tileHeight / 2;

    let circleX;
    let circleY;

    if (face === "up") {
      circleX = tile.pixelX + centerX;
      circleY = tile.pixelY;
    } else if (face === "right") {
      circleX = tile.pixelX + this.mapTileset.tileWidth;
      circleY = tile.pixelY + centerY;
    } else if (face === "down") {
      circleX = tile.pixelX + centerX;
      circleY = tile.pixelY + this.mapTileset.tileHeight;
    } else if (face === "left") {
      circleX = tile.pixelX;
      circleY = tile.pixelY + centerY;
    } else {
      // center
      circleX = tile.pixelX + centerX;
      circleY = tile.pixelY + centerY;
    }

    const circle1 = this.scene.add.circle(
      circleX,
      circleY,
      2,
      Phaser.Display.Color.ValueToColor("0xffffff").color,
      0.9
    );

    this.pathCircles.push(circle1);
  }

  clearPathCircles(): void {
    this.pathCircles.forEach((circle) => {
      circle.destroy();
    });

    this.pathCircles = [];
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
