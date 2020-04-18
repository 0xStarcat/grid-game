import Phaser from "phaser";
import logoImg from "Assets/logo.png";
import natureTiles from "Assets/nature-tileset.png";
import characters from "Assets/knights.png";
import MapRenderer from "Scripts/MapRenderer";
import MapActor from "Scripts/MapActor";
import TurnKeeper from "Scripts/TurnKeeper";
import InputManager from "Scripts/InputManager";

export default class Scene1 extends Phaser.Scene {
  constructor() {
    super("gameMenu");
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
    this.InputManager = new InputManager(this);

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

    this.turnKeeper = new TurnKeeper(this, this.InputManager, [
      this.actor1,
      this.actor2,
    ]);
    this.turnKeeper.beginTrackingTurns();

    this.input.keyboard.on("keydown_SPACE", (event) => {
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
