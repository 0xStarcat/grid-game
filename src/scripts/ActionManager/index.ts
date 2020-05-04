import GameScene from "@scripts/GameScene";
import MapActor from "@scripts/MapActor";
import Action from "@scripts/Action";

export default class ActionManager {
  scene: GameScene;
  mapActor: MapActor;
  actionQueue: Action[];
  currentAction: Action;
  onQueueComplete: Function;
  actionMode: "move" | "attack";

  constructor(scene: GameScene, mapActor: MapActor) {
    this.scene = scene;
    this.mapActor = mapActor;
    this.actionQueue = [];
    this.currentAction;
    this.onQueueComplete;
    this.actionMode = "move"; // the actionMode for the actor (move | attack)
  }

  beginActionQueue() {
    this.scene.inputManager.disableKeys();
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

  toggleActionMode() {
    if (this.actionMode === "move") {
      this.setAttackMode();
    } else if (this.actionMode === "attack") {
      this.setMoveMode();
    }
  }

  setAttackMode() {
    this.actionMode = "attack";
    this.scene.mapRenderer.clearPathCircles();
  }

  setMoveMode() {
    this.actionMode = "move";
    this.mapActor.pathMaker.generatePath(this.mapActor.cursor.currentTile);
    this.scene.mapRenderer.addPathCircles(this.mapActor.pathMaker.path);
  }

  pathMove(path: Phaser.Tilemaps.Tile[], callback: Function) {
    this.onQueueComplete = callback;
    path.forEach((tile, index) => {
      const prevTile = path[index - 1];
      if (!prevTile) return;
      // determine the direction of each tile from the previous to determine which move animation to run
      if (prevTile === tile.topNeighbor) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveDown.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === tile.rightNeighbor) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveLeft.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === tile.bottomNeighbor) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveUp.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === tile.leftNeighbor) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveRight.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === tile.topLeftNeighbor) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveDownRight.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === tile.topRightNeighbor) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveDownLeft.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === tile.bottomLeftNeighbor) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveUpRight.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      } else if (prevTile === tile.bottomRightNeighbor) {
        this.actionQueue.push(
          new Action(
            this.scene,
            this.mapActor.animatedMoveUpLeft.bind(this.mapActor),
            this.nextAction.bind(this)
          )
        );
      }
    });

    this.beginActionQueue();
  }
}
