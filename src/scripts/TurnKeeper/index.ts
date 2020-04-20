import MapRenderer from "@scripts/MapRenderer";
import InputManager from "@scripts/InputManager";
import MapActor from "@scripts/MapActor";

export default class TurnKeeper {
  scene: Phaser.Scene;
  mapRenderer: MapRenderer;
  inputManager: InputManager;
  participants: MapActor[];
  turnOwner: MapActor;
  turnCount: number;

  constructor(
    scene: Phaser.Scene,
    mapRenderer: MapRenderer,
    inputManager: InputManager,
    participants: MapActor[] = []
  ) {
    this.scene = scene;
    this.mapRenderer = mapRenderer;
    this.inputManager = inputManager;
    this.participants = participants;
    this.turnOwner = participants[0]; // who's turn it is
    this.turnCount = 1;
  }

  beforeTurn(): void {
    this.inputManager.enableCursorMoveKeys(this.mapRenderer.cursor);
    this.inputManager.enableActorMoveKeys(this.turnOwner);
    this.turnOwner.pathMaker.resetPath();
    this.mapRenderer.cursor.cursorOwner = this.turnOwner;
    this.mapRenderer.cursor.render(this.turnOwner.currentTile);
    this.turnOwner.addTurnIndicator();
  }

  beginTurn(): void {}

  endTurn(): void {}

  afterTurn(): void {
    this.turnOwner.turnIndicator.destroy();
    this.inputManager.resetActorMoveKeys();
    this.turnOwner.pathMaker.clearPath();
  }

  beginTrackingTurns(): void {
    this.beforeTurn();
    this.beginTurn();
  }

  nextTurn(): void {
    this.afterTurn();
    this.updateTurnOwner();

    this.turnCount += 1;

    this.beforeTurn();
    this.beginTurn();
  }

  updateTurnOwner(): void {
    // shuffle start of line to the end
    this.participants.push(this.participants.shift());
    this.turnOwner = this.participants[0];
  }
}
