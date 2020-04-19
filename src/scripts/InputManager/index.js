export default class InputManager {
  constructor(scene) {
    this.scene = scene;
  }

  enableActorMoveKeys(mapActor) {
    this.scene.input.keyboard.on("keydown_W", (event) => {
      mapActor.moveUp();
    });

    this.scene.input.keyboard.on("keydown_D", (event) => {
      mapActor.moveRight();
    });

    this.scene.input.keyboard.on("keydown_S", (event) => {
      mapActor.moveDown();
    });

    this.scene.input.keyboard.on("keydown_A", (event) => {
      mapActor.moveLeft();
    });

    this.scene.input.keyboard.on("keydown_UP", (event) => {
      mapActor.moveUp();
    });

    this.scene.input.keyboard.on("keydown_RIGHT", (event) => {
      mapActor.moveRight();
    });

    this.scene.input.keyboard.on("keydown_DOWN", (event) => {
      mapActor.moveDown();
    });

    this.scene.input.keyboard.on("keydown_LEFT", (event) => {
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

  enableCursorMoveKeys(cursor) {
    this.scene.input.keyboard.on("keydown_W", (event) => {
      cursor.moveUp();
    });

    this.scene.input.keyboard.on("keydown_D", (event) => {
      cursor.moveRight();
    });

    this.scene.input.keyboard.on("keydown_S", (event) => {
      cursor.moveDown();
    });

    this.scene.input.keyboard.on("keydown_A", (event) => {
      cursor.moveLeft();
    });

    this.scene.input.keyboard.on("keydown_UP", (event) => {
      cursor.moveUp();
    });

    this.scene.input.keyboard.on("keydown_RIGHT", (event) => {
      cursor.moveRight();
    });

    this.scene.input.keyboard.on("keydown_DOWN", (event) => {
      cursor.moveDown();
    });

    this.scene.input.keyboard.on("keydown_LEFT", (event) => {
      cursor.moveLeft();
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
