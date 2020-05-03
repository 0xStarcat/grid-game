import MapRenderer from "@scripts/MapRenderer";
import MapActor from "@scripts/MapActor";
import GameScene from "@scripts/GameScene";
import AStarPathfinder from "@scripts/AStarPathfinder";

export default class PathMaker {
  scene: GameScene;
  mapRenderer: MapRenderer;
  mapActor: MapActor;
  origin: Phaser.Tilemaps.Tile;
  path: Phaser.Tilemaps.Tile[];
  evaluatedSquares: Phaser.GameObjects.Rectangle[];

  constructor(scene: GameScene, mapActor: MapActor, mapRenderer: MapRenderer) {
    this.scene = scene;
    this.mapActor = mapActor;
    this.mapRenderer = mapRenderer;
    this.origin;
    this.path = [];
    this.evaluatedSquares = []; // debugging to view pathfinding sets
  }

  resetPath() {
    this.updatePathOrigin();
    this.path = [this.origin];
    this.mapRenderer.clearPathCircles();
  }

  updatePathOrigin() {
    this.origin = this.mapActor.currentTile;
  }

  completePathStep() {
    this.path.shift();
    this.updatePathOrigin();
    this.scene.mapRenderer.addPathCircles(this.path);
  }

  extendPath(tile: Phaser.Tilemaps.Tile): void {
    // adds a single tile to the path
    if (tile === this.origin) this.resetPath(); // clear path if extended to origin
    if (tile.collides) return;
    if (!this.path.length) this.resetPath(); // add origin if empty path

    if (this.path.indexOf(tile) > -1) {
      // If path extends onto existing square, backtrack the path up to that point
      this.path = this.path.slice(0, this.path.indexOf(tile) + 1);
    } else {
      this.path.push(tile);
    }

    this.mapRenderer.addPathCircles(this.path);
  }

  generatePath(end: Phaser.Tilemaps.Tile) {
    // uses AI pathfinding to find the path
    const pathfinder = new AStarPathfinder(
      this.mapActor.currentTile,
      end,
      this.mapRenderer.mapTileset.tiles
    );

    this.path = pathfinder.findPath();

    // debug open / closed sets
    // this.evaluatedSquares.forEach((rect) => rect.destroy());
    // pathfinder.closedSet.forEach((tile) => {
    //   this.evaluatedSquares.push(
    //     this.mapRenderer.addRectangleOutline(
    //       tile.pixelX,
    //       tile.pixelY,
    //       Phaser.Display.Color.ValueToColor("0xFF0000").color
    //     )
    //   );
    // });

    this.mapRenderer.addPathCircles(this.path);
  }
}
