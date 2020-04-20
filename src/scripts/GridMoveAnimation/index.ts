import GameScene from "@scripts/GameScene";
import MapActor from "@scripts/MapActor";

export default class GridMoveAnimation {
  scene: GameScene;
  parent: MapActor;
  startTile: Phaser.Tilemaps.Tile;
  endTile: Phaser.Tilemaps.Tile;
  duration: number;
  callback: Function;

  constructor(
    scene: GameScene,
    parent: MapActor,
    startTile: Phaser.Tilemaps.Tile,
    endTile: Phaser.Tilemaps.Tile,
    duration: number,
    callback: Function
  ) {
    this.scene = scene;
    this.parent = parent;
    this.callback = callback;
    this.startTile = startTile;
    this.endTile = endTile;
    this.duration = duration;

    this.scene.updateSubscribers.push(this);
  }

  update() {
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
      this.destroy();
    }
  }

  destroy() {
    const index = this.scene.updateSubscribers.indexOf(this);
    this.scene.updateSubscribers = [
      ...this.scene.updateSubscribers.slice(0, index),
      ...this.scene.updateSubscribers.slice(index + 1),
    ];
  }
}
