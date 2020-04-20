import GameScene from "@scripts/GameScene";
import PathMaker from "@scripts/PathMaker";
import GridMoveAnimation from "@scripts/GridMoveAnimation";
import ActionManager from "@scripts/ActionManager";
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
  scene: GameScene;
  pathMaker: PathMaker;
  spriteWidth: number;
  spriteHeight: number;
  spritesheetName: string;
  spritesheetIndex: number;
  actionManager: ActionManager;
  turnIndicator: Phaser.GameObjects.Rectangle;
  sprite: Phaser.GameObjects.Sprite;
  moveAnimation: GridMoveAnimation;

  constructor(
    scene: GameScene,
    spriteWidth: number,
    spriteHeight: number,
    spritesheetName: string,
    spritesheetIndex: number
  ) {
    this.scene = scene;
    this.pathMaker = new PathMaker(this.scene, this, this.scene.mapRenderer);
    this.actionManager = new ActionManager(this.scene, this);
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.spritesheetName = spritesheetName;
    this.spritesheetIndex = spritesheetIndex;
    this.turnIndicator; // UI indicator for indicating it's this actor's turn
    this.moveAnimation;
  }

  get currentTile(): Phaser.Tilemaps.Tile {
    return this.scene.mapRenderer.tileAt(this.sprite.x, this.sprite.y);
  }

  update() {}

  spawn(x: number, y: number): void {
    const centerX = x + this.spriteWidth / 2;
    const centerY = y + this.spriteHeight / 2;
    this.sprite = this.scene.add.sprite(
      centerX,
      centerY,
      this.spritesheetName,
      this.spritesheetIndex
    );

    this.move(centerX, centerY);
  }

  move(x: number, y: number): void {
    const oldTile = this.currentTile;
    const newTile = this.scene.mapRenderer.tileAt(x, y);
    if (newTile.collides) return;
    this.scene.mapRenderer.mapTileset.handleMovementCollision(oldTile, newTile);

    this.sprite.x = x;
    this.sprite.y = y;
    this.pathMaker.resetPath();
    this.updateTurnIndicator();
  }

  animatedMove(x: number, y: number, callBack: Function = () => {}): void {
    const oldTile = this.currentTile;
    const newTile = this.scene.mapRenderer.tileAt(x, y);
    if (newTile.collides) return;

    this.scene.inputManager.resetActorMoveKeys();
    this.moveAnimation = new GridMoveAnimation(
      this.scene,
      this,
      oldTile,
      newTile,
      1000,
      () => {
        this.scene.mapRenderer.mapTileset.handleMovementCollision(
          oldTile,
          newTile
        );
        this.pathMaker.resetPath();
        this.updateTurnIndicator();
        callBack();
      }
    );

    this.moveAnimation.play();
  }

  moveUp(): void {
    const moveY = this.sprite.y - this.scene.mapRenderer.mapTileset.tileHeight;

    this.animatedMove(this.sprite.x, moveY);

    this.move(this.sprite.x, moveY);
  }

  moveRight(): void {
    this.sprite.flipX = false;

    const moveX = this.sprite.x + this.scene.mapRenderer.mapTileset.tileWidth;

    this.animatedMove(moveX, this.sprite.y);

    this.move(moveX, this.sprite.y);
  }

  moveDown(): void {
    const moveY = this.sprite.y + this.scene.mapRenderer.mapTileset.tileHeight;

    this.animatedMove(this.sprite.x, moveY);

    this.move(this.sprite.x, moveY);
  }

  moveLeft(): void {
    this.sprite.flipX = true;

    const moveX = this.sprite.x - this.scene.mapRenderer.mapTileset.tileWidth;

    this.animatedMove(moveX, this.sprite.y);

    this.move(moveX, this.sprite.y);
  }

  animatedMoveUp(callback: Function = () => {}): void {
    const moveY = this.sprite.y - this.scene.mapRenderer.mapTileset.tileHeight;

    this.animatedMove(this.sprite.x, moveY, callback);
  }

  animatedMoveRight(callback: Function = () => {}): void {
    console.log(this);
    this.sprite.flipX = false;

    const moveX = this.sprite.x + this.scene.mapRenderer.mapTileset.tileWidth;

    this.animatedMove(moveX, this.sprite.y, callback);
  }

  animatedMoveDown(callback: Function = () => {}): void {
    const moveY = this.sprite.y + this.scene.mapRenderer.mapTileset.tileHeight;

    this.animatedMove(this.sprite.x, moveY, callback);
  }

  animatedMoveLeft(callback: Function = () => {}): void {
    this.sprite.flipX = true;

    const moveX = this.sprite.x - this.scene.mapRenderer.mapTileset.tileWidth;

    this.animatedMove(moveX, this.sprite.y, callback);
  }

  moveToTile(tile: Phaser.Tilemaps.Tile) {
    this.move(
      tile.pixelX + this.spriteWidth / 2,
      tile.pixelY + this.spriteHeight / 2
    );
  }

  addTurnIndicator(): void {
    // Class CurrentActorIndicator
    const rect = this.scene.mapRenderer.addRectangleOutline(
      this.currentTile.pixelX,
      this.currentTile.pixelY,
      Phaser.Display.Color.ValueToColor("0xefc53f").color
    );

    this.turnIndicator = rect;
  }

  updateTurnIndicator(): void {
    if (!this.turnIndicator) return;
    this.turnIndicator.destroy();
    this.addTurnIndicator();
  }
}
