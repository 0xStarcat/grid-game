import GameScene from "@scripts/GameScene";
import MapActor from "@scripts/MapActor";
import Action from "@scripts/Action";

export default class ActionManager {
  scene: GameScene;
  mapActor: MapActor;
  actionQueue: Action[];
  currentAction: Action;
  onQueueComplete: Function;

  constructor(scene: GameScene, mapActor: MapActor) {
    this.scene = scene;
    this.mapActor = mapActor;
    this.actionQueue = [];
    this.currentAction;
    this.onQueueComplete;
  }

  beginActionQueue() {
    this.currentAction = this.actionQueue[0];
    this.beforeAction();
    this.executeAction();
  }

  beforeAction() {}
  executeAction() {
    this.currentAction.execute();
  }
  afterAction() {}
  nextAction() {
    this.afterAction();
    this.updateCurrentAction();

    if (!this.currentAction) {
      // no more actions
      this.onQueueComplete();
    } else {
      this.beforeAction();
      this.executeAction();
    }
  }

  updateCurrentAction() {
    this.actionQueue.shift();
    this.currentAction = this.actionQueue[0];
  }

  pathMove(path: Phaser.Tilemaps.Tile[], callback: Function) {
    this.onQueueComplete = callback;
    path.forEach((tile, index) => {
      const prevTile = path[index - 1];
      if (!prevTile) return;
      // determine the direction of each tile from the previous to determine which move animation to run
      if (prevTile === this.scene.mapRenderer.upTile(tile)) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveDown.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === this.scene.mapRenderer.rightTile(tile)) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveLeft.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === this.scene.mapRenderer.downTile(tile)) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveUp.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === this.scene.mapRenderer.leftTile(tile)) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveRight.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      }
    });

    this.beginActionQueue();
  }
}
