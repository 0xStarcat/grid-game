import MapRenderer from "@scripts/MapRenderer";
import MapActor from "@scripts/MapActor";

export default class PathMaker {
  scene: Phaser.Scene;
  mapRenderer: MapRenderer;
  mapActor: MapActor;
  origin: Phaser.Tilemaps.Tile;
  path: Phaser.Tilemaps.Tile[];

  constructor(
    scene: Phaser.Scene,
    mapActor: MapActor,
    mapRenderer: MapRenderer
  ) {
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
    this.path.push(tile);
    this.mapRenderer.addPathCircles(this.path, tile);
  }

  clearPath() {
    this.path = [];
    this.mapRenderer.clearPathCircles();
  }
}
