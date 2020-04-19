import MapRenderer from "scripts/MapRenderer";

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
  scene: Phaser.Scene;
  mapRenderer: MapRenderer;
  spriteWidth: number;
  spriteHeight: number;
  spritesheetName: string;
  spritesheetIndex: number;
  turnIndicator: Phaser.GameObjects.Rectangle;
  sprite: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    mapRenderer: MapRenderer,
    spriteWidth: number,
    spriteHeight: number,
    spritesheetName: string,
    spritesheetIndex: number
  ) {
    this.scene = scene;
    this.mapRenderer = mapRenderer;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.spritesheetName = spritesheetName;
    this.spritesheetIndex = spritesheetIndex;
    this.turnIndicator; // UI indicator for indicating it's this actor's turn
  }

  get currentTile(): Phaser.Tilemaps.Tile {
    return this.mapRenderer.currentTile(this.sprite.x, this.sprite.y);
  }

  spawn(x: number, y: number): void {
    this.sprite = this.scene.add.sprite(
      x + this.spriteWidth / 2,
      y + this.spriteHeight / 2,
      this.spritesheetName,
      this.spritesheetIndex
    );
  }

  move(x: number, y: number): void {
    const oldTile = this.currentTile;
    const newTile = this.mapRenderer.currentTile(x, y);
    if (newTile.collides) return;
    this.mapRenderer.mapTileset.handleMovementCollision(oldTile, newTile);
    this.sprite.x = x;
    this.sprite.y = y;
    this.updateTurnIndicator();
  }

  moveUp(): void {
    const moveY = this.sprite.y - this.mapRenderer.mapTileset.tileHeight;
    this.move(this.sprite.x, moveY);
  }

  moveRight(): void {
    this.sprite.flipX = false;

    const moveX = this.sprite.x + this.mapRenderer.mapTileset.tileWidth;
    this.move(moveX, this.sprite.y);
  }

  moveDown(): void {
    const moveY = this.sprite.y + this.mapRenderer.mapTileset.tileHeight;
    this.move(this.sprite.x, moveY);
  }

  moveLeft(): void {
    this.sprite.flipX = true;

    const moveX = this.sprite.x - this.mapRenderer.mapTileset.tileWidth;
    this.move(moveX, this.sprite.y);
  }

  addTurnIndicator(): void {
    // Class CurrentActorIndicator
    const rect = this.mapRenderer.addRectangleOutline(
      this.currentTile.pixelX,
      this.currentTile.pixelY,
      Phaser.Display.Color.ValueToColor("0xefc53f").color
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

  updateTurnIndicator(): void {
    if (!this.turnIndicator) return;
    this.turnIndicator.destroy();
    this.addTurnIndicator();
  }
}
