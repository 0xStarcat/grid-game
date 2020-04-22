import "phaser";
import MapRenderer from "@scripts/MapRenderer";
import MapActor from "@scripts/MapActor";
import GameScene from "@scripts/GameScene";

export default class Cursor extends Phaser.GameObjects.GameObject {
  scene: GameScene;
  mapRenderer: MapRenderer;
  cursorOwner: MapActor;
  currentTile: Phaser.Tilemaps.Tile;
  color: number;
  _rect: Phaser.GameObjects.Rectangle;

  constructor(
    scene: GameScene,
    mapRenderer: MapRenderer,
    cursorOwner: MapActor,
    currentTile: Phaser.Tilemaps.Tile
  ) {
    super(scene, "cursor");
    this.mapRenderer = mapRenderer;
    this.cursorOwner = cursorOwner;
    this.currentTile = currentTile;
    this.color = Phaser.Display.Color.ValueToColor("0xffffff").color;

    this.renderAt(this.currentTile);
  }

  get rect() {
    return this._rect;
  }

  set rect(rect: Phaser.GameObjects.Rectangle) {
    if (this._rect) {
      this._rect.destroy();
    }

    this._rect = rect;
  }

  renderAt(tile: Phaser.Tilemaps.Tile) {
    this.currentTile = tile;
    this.rect = this.mapRenderer.addRectangleOutline(
      tile.pixelX,
      tile.pixelY,
      this.color
    );

    this.scene.tweens.add({
      targets: this.rect,
      scaleX: 0.8,
      scaleY: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      repeatDelay: 100,
    });

    return this.rect;
  }

  destroy() {
    this.rect.destroy();
  }

  move(tile: Phaser.Tilemaps.Tile) {
    if (tile.properties.actor !== this.cursorOwner && tile.collides) return;
    this.renderAt(tile);
  }

  moveUp() {
    const nextTile = this.mapRenderer.upTile(this.currentTile);

    this.move(nextTile);
    this.cursorOwner.pathMaker.extendPath(nextTile);
  }

  moveRight() {
    const nextTile = this.mapRenderer.rightTile(this.currentTile);

    this.move(nextTile);
    this.cursorOwner.pathMaker.extendPath(nextTile);
  }

  moveDown() {
    const nextTile = this.mapRenderer.downTile(this.currentTile);

    this.move(nextTile);
    this.cursorOwner.pathMaker.extendPath(nextTile);
  }

  moveLeft() {
    const nextTile = this.mapRenderer.leftTile(this.currentTile);

    this.move(nextTile);
    this.cursorOwner.pathMaker.extendPath(nextTile);
  }
}
