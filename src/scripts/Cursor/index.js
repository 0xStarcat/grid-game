import Phaser from "phaser";

export default class Cursor extends Phaser.GameObjects.GameObject {
  constructor(mapRenderer, x, y) {
    super(mapRenderer.scene, "cursor");
    this.mapRenderer = mapRenderer;
    this.x = x;
    this.y = y;

    this.rect;

    this.render(this.x, this.y);
  }

  render(x, y) {
    if (this.rect) {
      const oldRect = this.rect;
      oldRect.destroy();
    }
    this.rect = this.mapRenderer.addRectangleOutline(
      this.mapRenderer.currentTile(x, y).pixelX,
      this.mapRenderer.currentTile(x, y).pixelY,
      "0xffffff"
    );

    return this.rect;
  }
}
