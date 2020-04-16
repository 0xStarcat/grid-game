import Phaser from "phaser";

/*
 * @classdesc
 * The base class for characters rendered on a tilemap
 *
 * @param {Phaser.Scene} scene
 * @param {number} spriteWidth
 * @param {number} spriteHeight
 * @param {string} spritesheetName
 * @param {number} spritesheetIndex
 * @param {MapRenderer} mapRenderer
 */
export default class MapActor {
  constructor(
    scene,
    spriteWidth,
    spriteHeight,
    spritesheetName,
    spritesheetIndex,
    mapRenderer
  ) {
    this.scene = scene;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.spritesheetName = spritesheetName;
    this.spritesheetIndex = spritesheetIndex;
    this.mapRenderer = mapRenderer;
  }

  spawn(x, y) {
    this.sprite = this.scene.add.sprite(
      x + this.spriteWidth / 2,
      y + this.spriteHeight / 2,
      this.spritesheetName,
      this.spritesheetIndex
    );
  }

  moveUp() {
    const moveY = this.sprite.y - this.mapRenderer.tileHeight;
    const oldTile = this.currentTile();
    const newTile = this.mapRenderer.currentTile(this.sprite.x, moveY);
    if (newTile.collides) return;
    this.mapRenderer.handleMovementCollision(oldTile, newTile);
    this.sprite.y = moveY;
  }

  moveRight() {
    this.sprite.flipX = false;

    const moveX = this.sprite.x + this.mapRenderer.tileWidth;
    const oldTile = this.currentTile();
    const newTile = this.mapRenderer.currentTile(moveX, this.sprite.y);
    if (newTile.collides) return;

    this.mapRenderer.handleMovementCollision(oldTile, newTile);
    this.sprite.x = moveX;
  }

  moveDown() {
    const moveY = this.sprite.y + this.mapRenderer.tileHeight;
    const oldTile = this.currentTile();
    const newTile = this.mapRenderer.currentTile(this.sprite.x, moveY);
    if (newTile.collides) return;

    this.mapRenderer.handleMovementCollision(oldTile, newTile);
    this.sprite.y = moveY;
  }

  moveLeft() {
    this.sprite.flipX = true;

    const moveX = this.sprite.x - this.mapRenderer.tileWidth;
    const oldTile = this.currentTile();
    const newTile = this.mapRenderer.currentTile(moveX, this.sprite.y);
    if (newTile.collides) return;

    this.mapRenderer.handleMovementCollision(oldTile, newTile);
    this.sprite.x = moveX;
  }

  currentTile() {
    return this.mapRenderer.currentTile(this.sprite.x, this.sprite.y);
  }
}
