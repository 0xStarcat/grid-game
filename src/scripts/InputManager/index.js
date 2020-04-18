export default class InputManager {
  constructor(scene) {
    this.scene = scene;
  }

  enableActorMoveKeys(mapActor) {
    this.scene.input.keyboard.on("keydown_A", (event) => {
      mapActor.moveLeft();
    });

    this.scene.input.keyboard.on("keydown_D", (event) => {
      mapActor.moveRight();
    });

    this.scene.input.keyboard.on("keydown_W", (event) => {
      mapActor.moveUp();
    });

    this.scene.input.keyboard.on("keydown_S", (event) => {
      mapActor.moveDown();
    });

    this.scene.input.keyboard.off("keydown_S", (event) => {
      mapActor.moveDown();
    });

    this.scene.input.keyboard.on("keydown_LEFT", (event) => {
      mapActor.moveLeft();
    });

    this.scene.input.keyboard.on("keydown_RIGHT", (event) => {
      mapActor.moveRight();
    });

    this.scene.input.keyboard.on("keydown_UP", (event) => {
      mapActor.moveUp();
    });

    this.scene.input.keyboard.on("keydown_DOWN", (event) => {
      mapActor.moveDown();
    });
  }

  resetActorMoveKeys() {
    this.scene.input.keyboard.off("keydown_A");
    this.scene.input.keyboard.off("keydown_S");
    this.scene.input.keyboard.off("keydown_D");
    this.scene.input.keyboard.off("keydown_F");
    this.scene.input.keyboard.off("keydown_UP");
    this.scene.input.keyboard.off("keydown_RIGHT");
    this.scene.input.keyboard.off("keydown_DOWN");
    this.scene.input.keyboard.off("keydown_LEFT");
  }
}
