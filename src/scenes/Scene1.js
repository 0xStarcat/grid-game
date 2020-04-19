import Phaser from "phaser";
import logoImg from "@assets/logo.png";
import natureTiles from "@assets/nature-tileset.png";
import characters from "@assets/knights.png";
import MapRenderer from "@scripts/MapRenderer";
import MapActor from "@scripts/MapActor";
import TurnKeeper from "@scripts/TurnKeeper";
import InputManager from "@scripts/InputManager";

export default class Scene1 extends Phaser.Scene {
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
    this.load.image("nature-tiles", natureTiles, 32, 32);
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
      32,
      16,
      "characters",
      19,
      this.mapRenderer
    );

    this.spawnActor(this.actor1, this.mapRenderer);

    this.actor2 = new MapActor(
      this,
      32,
      16,
      "characters",
      20,
      this.mapRenderer
    );

    this.spawnActor(this.actor2, this.mapRenderer);

    this.turnKeeper = new TurnKeeper(
      this,
      this.mapRenderer,
      this.inputManager,
      [this.actor1, this.actor2]
    );
    this.turnKeeper.beginTrackingTurns();

    this.input.keyboard.on("keydown_ENTER", (event) => {
      this.turnKeeper.nextTurn();
    });
  }

  update() {}

  spawnActor(actor, mapRenderer) {
    // randomly places actor on a tile
    const randomTile = mapRenderer.randomTile(true);
    this.mapRenderer.setCollisionTile(randomTile);
    return actor.spawn(randomTile.pixelX, randomTile.pixelY);
  }
}
