import MapActor from "@scripts/MapActor";
import Cursor from "@scripts/Cursor";
import GameScene from "@scripts/GameScene";

export default class InputManager {
  scene: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  moveEndCallback() {
    this.scene.turnKeeper.nextTurn();
  }

  enableActorMoveKeys(mapActor: MapActor) {
    // this.scene.input.keyboard.on("keydown_W", (event: KeyboardEvent) => {
    //   mapActor.moveUp();
    // });

    // this.scene.input.keyboard.on("keydown_D", (event: KeyboardEvent) => {
    //   mapActor.moveRight();
    // });

    // this.scene.input.keyboard.on("keydown_S", (event: KeyboardEvent) => {
    //   mapActor.moveDown();
    // });

    // this.scene.input.keyboard.on("keydown_A", (event: KeyboardEvent) => {
    //   mapActor.moveLeft();
    // });

    this.scene.input.keyboard.on("keydown_UP", (event: KeyboardEvent) => {
      mapActor.animatedMoveUp(this.moveEndCallback.bind(this));
    });

    this.scene.input.keyboard.on("keydown_RIGHT", (event: KeyboardEvent) => {
      mapActor.animatedMoveRight(this.moveEndCallback.bind(this));
    });

    this.scene.input.keyboard.on("keydown_DOWN", (event: KeyboardEvent) => {
      mapActor.animatedMoveDown(this.moveEndCallback.bind(this));
    });

    this.scene.input.keyboard.on("keydown_LEFT", (event: KeyboardEvent) => {
      mapActor.animatedMoveLeft(this.moveEndCallback.bind(this));
    });
  }

  resetActorMoveKeys() {
    this.scene.input.keyboard.off("keydown_W");
    this.scene.input.keyboard.off("keydown_D");
    this.scene.input.keyboard.off("keydown_S");
    this.scene.input.keyboard.off("keydown_A");
    this.scene.input.keyboard.off("keydown_UP");
    this.scene.input.keyboard.off("keydown_RIGHT");
    this.scene.input.keyboard.off("keydown_DOWN");
    this.scene.input.keyboard.off("keydown_LEFT");
  }

  enableCursorMoveKeys(cursor: Cursor) {
    this.scene.input.keyboard.on("keydown_W", (event: KeyboardEvent) => {
      cursor.moveUp();
    });

    this.scene.input.keyboard.on("keydown_D", (event: KeyboardEvent) => {
      cursor.moveRight();
    });

    this.scene.input.keyboard.on("keydown_S", (event: KeyboardEvent) => {
      cursor.moveDown();
    });

    this.scene.input.keyboard.on("keydown_A", (event: KeyboardEvent) => {
      cursor.moveLeft();
    });

    // this.scene.input.keyboard.on("keydown_UP", (event: KeyboardEvent) => {
    //   cursor.moveUp();
    // });

    // this.scene.input.keyboard.on("keydown_RIGHT", (event: KeyboardEvent) => {
    //   cursor.moveRight();
    // });

    // this.scene.input.keyboard.on("keydown_DOWN", (event: KeyboardEvent) => {
    //   cursor.moveDown();
    // });

    // this.scene.input.keyboard.on("keydown_LEFT", (event: KeyboardEvent) => {
    //   cursor.moveLeft();
    // });

    this.scene.input.keyboard.on("keydown_SPACE", (event: KeyboardEvent) => {
      cursor.cursorOwner.moveToTile(cursor.currentTile);
    });
  }

  resetCursorMoveKeys() {
    this.scene.input.keyboard.off("keydown_W");
    this.scene.input.keyboard.off("keydown_D");
    this.scene.input.keyboard.off("keydown_S");
    this.scene.input.keyboard.off("keydown_A");
    this.scene.input.keyboard.off("keydown_UP");
    this.scene.input.keyboard.off("keydown_RIGHT");
    this.scene.input.keyboard.off("keydown_DOWN");
    this.scene.input.keyboard.off("keydown_LEFT");
  }
}
