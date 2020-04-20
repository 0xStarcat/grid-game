import "phaser";
import natureTiles from "@assets/images/nature-tileset.png";
import characters from "@assets/images/knights.png";
import MapRenderer from "@scripts/MapRenderer";
import MapActor from "@scripts/MapActor";
import TurnKeeper from "@scripts/TurnKeeper";
import InputManager from "@scripts/InputManager";
import MapTileset from "@scripts/MapTileset";

import { generateNatureTilesetLevel } from "@utilities/levelGenerators";

export default class GameScene extends Phaser.Scene {
  graphics: Phaser.GameObjects.Graphics;
  camera: Phaser.Cameras.Scene2D.Camera;
  mapRenderer: MapRenderer;
  mapTileset: MapTileset;
  inputManager: InputManager;
  turnKeeper: TurnKeeper;
  updateSubscribers: UpdateSubscribable[];
  actor1: MapActor;
  actor2: MapActor;

  constructor(name: string) {
    super(name);
  }

  preload() {
    this.load.image("nature-tiles", natureTiles);
    this.load.spritesheet("characters", characters, {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    this.updateSubscribers = [];
    this.graphics = this.add.graphics();
    this.camera = this.cameras.main;

    this.mapTileset = new MapTileset(
      this,
      "nature-tiles",
      32,
      32,
      generateNatureTilesetLevel,
      [75, 76, 77, 95, 97, 115, 116, 117]
    );

    this.mapRenderer = new MapRenderer(this, this.mapTileset);
    this.inputManager = new InputManager(this);

    this.actor1 = new MapActor(this, 32, 16, "characters", 19);

    this.spawnActor(this.actor1, this.mapRenderer);

    this.actor2 = new MapActor(this, 32, 16, "characters", 20);

    this.spawnActor(this.actor2, this.mapRenderer);

    this.turnKeeper = new TurnKeeper(
      this,
      this.mapRenderer,
      this.inputManager,
      [this.actor1, this.actor2]
    );
    this.turnKeeper.beginTrackingTurns();

    this.input.keyboard.on("keydown_ENTER", (event: KeyboardEvent) => {
      this.turnKeeper.nextTurn();
    });
  }

  update(): void {
    this.updateSubscribers.forEach((subscriber) => {
      subscriber.update();
    });
  }

  subscribeToUpdate(subscriber: UpdateSubscribable) {
    this.updateSubscribers.push(subscriber);
  }

  spawnActor(actor: MapActor, mapRenderer: MapRenderer): void {
    // randomly places actor on a tile
    const randomTile = mapRenderer.mapTileset.randomTile(
      true,
      mapRenderer.currentLayer
    );
    return actor.spawn(randomTile.pixelX, randomTile.pixelY);
  }
}
