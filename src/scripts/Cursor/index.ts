import "phaser";
import MapRenderer from "@scripts/MapRenderer";

export default class Cursor extends Phaser.GameObjects.GameObject {
  scene: Phaser.Scene;
  mapRenderer: MapRenderer;
  x: number;
  y: number;
  currentTile: Phaser.Tilemaps.Tile;
  color: number;
  rect: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    mapRenderer: MapRenderer,
    x: number,
    y: number
  ) {
    super(scene, "cursor");
    this.mapRenderer = mapRenderer;
    this.x = x;
    this.y = y;
    this.currentTile = mapRenderer.currentTile(x, y);
    this.color = Phaser.Display.Color.ValueToColor("0xffffff").color;
  }

  render(tile: Phaser.Tilemaps.Tile) {
    if (this.rect) {
      this.rect.destroy();
    }

    this.currentTile = tile;
    this.rect = this.mapRenderer.addRectangleOutline(
      tile.pixelX,
      tile.pixelY,
      this.color
    );

    return this.rect;
  }

  destroy() {
    this.rect.destroy();
  }

  move(tile: Phaser.Tilemaps.Tile) {
    if (tile.properties.borderTile) return;
    this.render(tile);
  }

  moveUp() {
    this.move(this.mapRenderer.upTile(this.currentTile));
  }

  moveRight() {
    this.move(this.mapRenderer.rightTile(this.currentTile));
  }

  moveDown() {
    this.move(this.mapRenderer.downTile(this.currentTile));
  }

  moveLeft() {
    this.move(this.mapRenderer.leftTile(this.currentTile));
  }
}
