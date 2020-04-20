import GameScene from "@scripts/GameScene";

interface ActionFunction {
  (callback: Function): void;
}

export default class Action {
  scene: GameScene;
  actionFunction: ActionFunction;
  callback: Function;
  constructor(
    scene: GameScene,
    actionFunction: ActionFunction,
    callback: Function
  ) {
    this.scene = scene;
    this.actionFunction = actionFunction;
    this.callback = callback;
  }

  execute() {
    this.actionFunction(this.callback);
  }
}
