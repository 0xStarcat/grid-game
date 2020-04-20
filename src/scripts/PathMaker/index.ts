import MapRenderer from "@scripts/MapRenderer";
import MapActor from "@scripts/MapActor";
import GameScene from "@scripts/GameScene";

export default class PathMaker {
  scene: GameScene;
  mapRenderer: MapRenderer;
  mapActor: MapActor;
  origin: Phaser.Tilemaps.Tile;
  path: Phaser.Tilemaps.Tile[];

  constructor(scene: GameScene, mapActor: MapActor, mapRenderer: MapRenderer) {
    this.scene = scene;
    this.mapActor = mapActor;
    this.mapRenderer = mapRenderer;
    this.origin;
    this.path = [];
  }

  resetPath() {
    this.origin = this.mapActor.currentTile;
    this.path = [this.origin];
  }

  extendPath(tile: Phaser.Tilemaps.Tile): void {
    if (tile.collides) return;
    // add origin if empty path
    if (!this.path.length) this.resetPath();
    if (this.path.indexOf(tile) > -1) {
      // If path extends onto existing square, backtrack the path up to that point
      this.path = this.path.slice(0, this.path.indexOf(tile) + 1);
    } else {
      this.path.push(tile);
    }

    this.mapRenderer.addPathCircles(this.path);
  }

  clearPath() {
    this.path = [];
    this.mapRenderer.clearPathCircles();
  }
}
