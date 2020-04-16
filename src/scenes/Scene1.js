import Phaser from "phaser";
import logoImg from "Assets/logo.png";
import natureTiles from "Assets/nature-tileset.png";
import characters from "Assets/knights.png";
import MapRenderer from "Scripts/MapRenderer/index";
import MapActor from "Scripts/MapActor/index";

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
    this.mapRenderer = new MapRenderer(this, "nature-tiles", 32, 32);
    this.grid = this.add.grid(
      256 / 2 + 32,
      256 / 2 + 32,
      256,
      256,
      32,
      32,
      "#000",
      0.25
    );

    this.actor1 = new MapActor(
      this,
      32,
      16,
      "characters",
      19,
      this.mapRenderer
    );

    this.spawnActor(this.actor1, this.mapRenderer);

    this.input.keyboard.on("keydown_A", (event) => {
      this.actor1.moveLeft();
    });

    this.input.keyboard.on("keydown_D", (event) => {
      this.actor1.moveRight();
    });

    this.input.keyboard.on("keydown_W", (event) => {
      this.actor1.moveUp();
    });

    this.input.keyboard.on("keydown_S", (event) => {
      this.actor1.moveDown();
    });

    this.actor2 = new MapActor(
      this,
      32,
      16,
      "characters",
      20,
      this.mapRenderer
    );

    this.spawnActor(this.actor2, this.mapRenderer);

    this.input.keyboard.on("keydown_LEFT", (event) => {
      this.actor2.moveLeft();
    });

    this.input.keyboard.on("keydown_RIGHT", (event) => {
      this.actor2.moveRight();
    });

    this.input.keyboard.on("keydown_UP", (event) => {
      this.actor2.moveUp();
    });

    this.input.keyboard.on("keydown_DOWN", (event) => {
      this.actor2.moveDown();
    });
  }

  update() {}

  spawnActor(actor, mapRenderer) {
    // randomly places actor on a tile
    const randomTile = mapRenderer.randomTile(true);

    return actor.spawn(randomTile.pixelX, randomTile.pixelY);
  }
}
