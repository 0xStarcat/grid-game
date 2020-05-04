import GameScene from "@scripts/GameScene";
import PathMaker from "@scripts/PathMaker";
import GridMoveAnimation from "@scripts/GridMoveAnimation";
import ActionManager from "@scripts/ActionManager";
import Cursor from "@scripts/Cursor";
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
  sprite: Phaser.GameObjects.Sprite;
  moveAnimation: GridMoveAnimation;
  _turnIndicator: Phaser.GameObjects.Rectangle;
  _cursor: Cursor;

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
    this.moveAnimation; // the current movement from oldTile to newTile
    this._turnIndicator; // UI indicator for indicating it's this actor's turn
  }

  get currentTile(): Phaser.Tilemaps.Tile {
    return this.scene.mapRenderer.tileAt(this.sprite.x, this.sprite.y);
  }

  get cursor() {
    return this._cursor;
  }

  set cursor(cursor: Cursor) {
    if (this._cursor) {
      this._cursor.destroy();
    }

    this._cursor = cursor;
  }

  get turnIndicator() {
    return this._turnIndicator;
  }

  set turnIndicator(rect: Phaser.GameObjects.Rectangle) {
    if (this._turnIndicator) {
      this._turnIndicator.destroy();
    }

    this._turnIndicator = rect;
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

  select(): void {
    this.cursor = new Cursor(
      this.scene,
      this.scene.mapRenderer,
      this,
      this.currentTile
    );

    this.scene.inputManager.enableCursorMoveKeys(this);
    this.scene.inputManager.enableActorMoveKeys(this);

    this.addTurnIndicator(this.currentTile.pixelX, this.currentTile.pixelY);
  }

  deselect(): void {
    this.cursor = null;

    this.scene.inputManager.resetCursorMoveKeys();
    this.scene.inputManager.resetActorMoveKeys();

    this.turnIndicator = null;
    this.scene.mapRenderer.clearPathCircles();
  }

  move(x: number, y: number): void {
    const oldTile = this.currentTile;
    const newTile = this.scene.mapRenderer.tileAt(x, y);
    if (newTile.collides) return;
    this.scene.mapRenderer.mapTileset.handleActorMovement(
      this,
      oldTile,
      newTile
    );

    this.sprite.x = x;
    this.sprite.y = y;
    this.pathMaker.updatePathOrigin();
  }

  animatedMove(x: number, y: number, callBack: Function = () => {}): void {
    const oldTile = this.currentTile;
    const newTile = this.scene.mapRenderer.tileAt(x, y);
    if (newTile.collides) return;
    this.addTurnIndicator(newTile.pixelX, newTile.pixelY);

    this.scene.inputManager.resetActorMoveKeys();
    this.moveAnimation = new GridMoveAnimation(
      this.scene,
      this,
      oldTile,
      newTile,
      1000,
      () => {
        this.scene.mapRenderer.mapTileset.handleActorMovement(
          this,
          oldTile,
          newTile
        );
        this.pathMaker.completePathStep();
        callBack();
      }
    );

    this.moveAnimation.play();
  }

  moveUp(): void {
    const moveY = this.sprite.y - this.scene.mapRenderer.mapTileset.tileHeight;

    this.move(this.sprite.x, moveY);
  }

  moveRight(): void {
    this.sprite.flipX = false;

    const moveX = this.sprite.x + this.scene.mapRenderer.mapTileset.tileWidth;

    this.move(moveX, this.sprite.y);
  }

  moveDown(): void {
    const moveY = this.sprite.y + this.scene.mapRenderer.mapTileset.tileHeight;

    this.move(this.sprite.x, moveY);
  }

  moveLeft(): void {
    this.sprite.flipX = true;

    const moveX = this.sprite.x - this.scene.mapRenderer.mapTileset.tileWidth;

    this.move(moveX, this.sprite.y);
  }

  animatedMoveUp(callback: Function = () => {}): void {
    const moveY = this.sprite.y - this.scene.mapRenderer.mapTileset.tileHeight;

    this.animatedMove(this.sprite.x, moveY, callback);
  }

  animatedMoveRight(callback: Function = () => {}): void {
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

  animatedMoveUpLeft(callback: Function = () => {}): void {
    this.sprite.flipX = true;

    const moveY = this.sprite.y - this.scene.mapRenderer.mapTileset.tileHeight;
    const moveX = this.sprite.x - this.scene.mapRenderer.mapTileset.tileWidth;

    this.animatedMove(moveX, moveY, callback);
  }

  animatedMoveUpRight(callback: Function = () => {}): void {
    this.sprite.flipX = false;

    const moveY = this.sprite.y - this.scene.mapRenderer.mapTileset.tileHeight;
    const moveX = this.sprite.x + this.scene.mapRenderer.mapTileset.tileWidth;

    this.animatedMove(moveX, moveY, callback);
  }

  animatedMoveDownLeft(callback: Function = () => {}): void {
    this.sprite.flipX = true;

    const moveY = this.sprite.y + this.scene.mapRenderer.mapTileset.tileHeight;
    const moveX = this.sprite.x - this.scene.mapRenderer.mapTileset.tileWidth;

    this.animatedMove(moveX, moveY, callback);
  }

  animatedMoveDownRight(callback: Function = () => {}): void {
    this.sprite.flipX = false;

    const moveY = this.sprite.y + this.scene.mapRenderer.mapTileset.tileHeight;
    const moveX = this.sprite.x + this.scene.mapRenderer.mapTileset.tileWidth;

    this.animatedMove(moveX, moveY, callback);
  }

  moveToTile(tile: Phaser.Tilemaps.Tile) {
    this.move(
      tile.pixelX + this.spriteWidth / 2,
      tile.pixelY + this.spriteHeight / 2
    );
  }

  addTurnIndicator(x: number, y: number): void {
    // Class CurrentActorIndicator
    const rect = this.scene.mapRenderer.addRectangleOutline(
      x,
      y,
      Phaser.Display.Color.ValueToColor("0xefc53f").color
    );

    this.turnIndicator = rect;
  }
}
