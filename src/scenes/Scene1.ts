import "phaser";
import natureTiles from "@assets/nature-tileset.png";
import characters from "@assets/knights.png";
import MapRenderer from "@scripts/MapRenderer";
import MapActor from "@scripts/MapActor";
import TurnKeeper from "@scripts/TurnKeeper";
import InputManager from "@scripts/InputManager";
import MapTileset from "@scripts/MapTileset";

export default class Scene1 extends Phaser.Scene {
  graphics: Phaser.GameObjects.Graphics;
  camera: Phaser.Cameras.Scene2D.Camera;
  mapRenderer: MapRenderer;
  mapTileset: MapTileset;
  inputManager: InputManager;
  turnKeeper: TurnKeeper;
  actor1: MapActor;
  actor2: MapActor;

  constructor() {
    super("gameMenu");
  }

  preload() {
    this.load.image("nature-tiles", natureTiles);
    this.load.spritesheet("characters", characters, {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    this.graphics = this.add.graphics();
    this.camera = this.cameras.main;

    this.mapTileset = new MapTileset(this, "nature-tiles", 32, 32);
    this.mapRenderer = new MapRenderer(this, this.mapTileset);
    this.inputManager = new InputManager(this);

    this.actor1 = new MapActor(
      this,
      this.mapRenderer,
      32,
      16,
      "characters",
      19
    );

    this.spawnActor(this.actor1, this.mapRenderer);

    this.actor2 = new MapActor(
      this,
      this.mapRenderer,
      32,
      16,
      "characters",
      20
    );

    this.spawnActor(this.actor2, this.mapRenderer);

    this.turnKeeper = new TurnKeeper(
      this,
      this.mapRenderer,
      this.inputManager,
      [this.actor1, this.actor2]
    );
    this.turnKeeper.beginTrackingTurns();

    this.input.keyboard.on("keydown_ENTER", (event: KeyboardEvent) => {
      console.log(event);
      this.turnKeeper.nextTurn();
    });
  }

  update() {}

  spawnActor(actor: MapActor, mapRenderer: MapRenderer): void {
    // randomly places actor on a tile
    const randomTile = mapRenderer.randomTile(true);
    this.mapTileset.setCollisionTile(randomTile);
    return actor.spawn(randomTile.pixelX, randomTile.pixelY);
  }
}
