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
    this.turnIndicator; // UI indicator for indicating it's this actor's turn
  }

  get currentTile() {
    return this.mapRenderer.currentTile(this.sprite.x, this.sprite.y);
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
    const oldTile = this.currentTile;
    const newTile = this.mapRenderer.currentTile(this.sprite.x, moveY);
    if (newTile.collides) return;
    this.mapRenderer.handleMovementCollision(oldTile, newTile);
    this.sprite.y = moveY;
    this.updateTurnIndicator();
  }

  moveRight() {
    this.sprite.flipX = false;

    const moveX = this.sprite.x + this.mapRenderer.tileWidth;
    const oldTile = this.currentTile;
    const newTile = this.mapRenderer.currentTile(moveX, this.sprite.y);
    if (newTile.collides) return;

    this.mapRenderer.handleMovementCollision(oldTile, newTile);
    this.sprite.x = moveX;
    this.updateTurnIndicator();
  }

  moveDown() {
    const moveY = this.sprite.y + this.mapRenderer.tileHeight;
    const oldTile = this.currentTile;
    const newTile = this.mapRenderer.currentTile(this.sprite.x, moveY);
    if (newTile.collides) return;

    this.mapRenderer.handleMovementCollision(oldTile, newTile);
    this.sprite.y = moveY;
    this.updateTurnIndicator();
  }

  moveLeft() {
    this.sprite.flipX = true;

    const moveX = this.sprite.x - this.mapRenderer.tileWidth;
    const oldTile = this.currentTile;
    const newTile = this.mapRenderer.currentTile(moveX, this.sprite.y);
    if (newTile.collides) return;

    this.mapRenderer.handleMovementCollision(oldTile, newTile);
    this.sprite.x = moveX;
    this.updateTurnIndicator();
  }

  addTurnIndicator() {
    // Class CurrentActorIndicator
    const rect = this.scene.mapRenderer.addRectangleOutline(
      this.currentTile.pixelX,
      this.currentTile.pixelY,
      "0xefc53f"
    );

    this.scene.tweens.add({
      targets: rect,
      scaleX: 0.8,
      scaleY: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      repeatDelay: 4000,
    });

    this.turnIndicator = rect;
  }

  updateTurnIndicator() {
    if (!this.turnIndicator) return;
    this.turnIndicator.destroy();
    this.addTurnIndicator();
  }
}
