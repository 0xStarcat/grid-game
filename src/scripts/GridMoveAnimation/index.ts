import GameScene from "@scripts/GameScene";
import MapActor from "@scripts/MapActor";
import UpdateSubscriber from "@scripts/UpdateSubscriber";

export default class GridMoveAnimation extends UpdateSubscriber {
  scene: GameScene;
  parent: MapActor;
  startTile: Phaser.Tilemaps.Tile;
  endTile: Phaser.Tilemaps.Tile;
  duration: number;
  callback: Function;
  updateSubscriber: UpdateSubscriber;

  constructor(
    scene: GameScene,
    parent: MapActor,
    startTile: Phaser.Tilemaps.Tile,
    endTile: Phaser.Tilemaps.Tile,
    duration: number,
    callback: Function
  ) {
    super(scene);
    this.parent = parent;
    this.startTile = startTile;
    this.endTile = endTile;
    this.duration = duration;
    this.callback = callback;

    // this.chain
    // this.callback

    this.scene.subscribeToUpdate(this);
  }

  onUpdate() {
    const endX = this.endTile.pixelX + this.parent.spriteWidth / 2;
    const endY = this.endTile.pixelY + this.parent.spriteHeight / 2;

    if (this.parent.sprite.x < endX) {
      // move right
      this.parent.sprite.x++;
    } else if (this.parent.sprite.x > endX) {
      // move left
      this.parent.sprite.x--;
    }

    if (this.parent.sprite.y < endY) {
      // move down
      this.parent.sprite.y++;
    } else if (this.parent.sprite.y > endY) {
      // move up
      this.parent.sprite.y--;
    }

    if (this.parent.sprite.x === endX && this.parent.sprite.y === endY) {
      this.callback();
      this.stop();
    }
  }
}
