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

  addPathCircles(path: Phaser.Tilemaps.Tile[]): void {
    this.clearPathCircles();
    path.forEach((tile) => {
      // UI elements for 2 dots showing a path through a tile
      // start from prev tile's face then adds middle
      const tileIndex = path.indexOf(tile);
      const prevTile = path[tileIndex - 1];

      // adds path circle to prev / current tile connecting face
      if (prevTile === tile.topNeighbor) {
        this.addPathCircle(tile, "up");
      } else if (prevTile === tile.rightNeighbor) {
        this.addPathCircle(tile, "right");
      } else if (prevTile === tile.bottomNeighbor) {
        this.addPathCircle(tile, "down");
      } else if (prevTile === tile.leftNeighbor) {
        this.addPathCircle(tile, "left");
      } else if (prevTile === tile.topLeftNeighbor) {
        this.addPathCircle(tile, "upLeft");
      } else if (prevTile === tile.topRightNeighbor) {
        this.addPathCircle(tile, "upRight");
      } else if (prevTile === tile.bottomLeftNeighbor) {
        this.addPathCircle(tile, "downLeft");
      } else if (prevTile === tile.bottomRightNeighbor) {
        this.addPathCircle(tile, "downRight");
      }

      this.addPathCircle(tile, "center");
    });
  }

  addPathCircle(
    tile: Phaser.Tilemaps.Tile,
    face:
      | "up"
      | "right"
      | "down"
      | "left"
      | "center"
      | "upRight"
      | "upLeft"
      | "downLeft"
      | "downRight"
  ) {
    // single UI path dot at point
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
    } else if (face === "upRight") {
      circleX = tile.pixelX + this.mapTileset.tileWidth;
      circleY = tile.pixelY;
    } else if (face === "upLeft") {
      circleX = tile.pixelX;
      circleY = tile.pixelY;
    } else if (face === "downRight") {
      circleX = tile.pixelX + this.mapTileset.tileWidth;
      circleY = tile.pixelY + this.mapTileset.tileHeight;
    } else if (face === "downLeft") {
      circleX = tile.pixelX;
      circleY = tile.pixelY + this.mapTileset.tileHeight;
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
    // UI display rectangle around tile
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
    // Adds Grid UI element
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
