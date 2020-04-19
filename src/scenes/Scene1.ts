import "phaser";
import natureTiles from "@assets/nature-tileset.png";
import characters from "@assets/knights.png";
import MapRenderer from "@scripts/MapRenderer";
import MapActor from "@scripts/MapActor";
import TurnKeeper from "@scripts/TurnKeeper";
import InputManager from "@scripts/InputManager";

export default class Scene1 extends Phaser.Scene {
  graphics: Phaser.GameObjects.Graphics;
  camera: Phaser.Cameras.Scene2D.Camera;
  mapRenderer: MapRenderer;
  inputManager: InputManager;
  turnKeeper: TurnKeeper;
  actor1: MapActor;
  actor2: MapActor;

  constructor() {
    super("gameMenu");

    this.graphics;
    this.camera;
    this.mapRenderer;
    this.inputManager;
    this.actor1;
    this.actor2;
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

    this.mapRenderer = new MapRenderer(this, "nature-tiles", 32, 32);
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
    this.mapRenderer.setCollisionTile(randomTile);
    return actor.spawn(randomTile.pixelX, randomTile.pixelY);
  }
}
