import Phaser from "phaser";

export default class Cursor extends Phaser.GameObjects.GameObject {
  constructor(scene, mapRenderer, x, y) {
    super(scene, "cursor");
    this.mapRenderer = mapRenderer;
    this.x = x;
    this.y = y;
    this.currentTile = mapRenderer.currentTile(x, y);
    this.color = "0xffffff";
  }

  render(tile) {
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

  move(tile) {
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
