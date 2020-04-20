import MapActor from "@scripts/MapActor";
import Cursor from "@scripts/Cursor";

export default class InputManager {
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
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
      mapActor.moveUp();
    });

    this.scene.input.keyboard.on("keydown_RIGHT", (event: KeyboardEvent) => {
      mapActor.moveRight();
    });

    this.scene.input.keyboard.on("keydown_DOWN", (event: KeyboardEvent) => {
      mapActor.moveDown();
    });

    this.scene.input.keyboard.on("keydown_LEFT", (event: KeyboardEvent) => {
      mapActor.moveLeft();
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
