export default class TurnKeeper {
  constructor(scene, mapRenderer, inputManager, participants = []) {
    this.scene = scene;
    this.mapRenderer = mapRenderer;
    this.inputManager = inputManager;
    this.participants = participants;
    this.turnOwner = participants[0]; // who's turn it is
    this.turnCount = 1;
    this.turnIndicators = []; // UI indicators for sprites
  }

  beforeTurn() {
    this.inputManager.enableCursorMoveKeys(this.mapRenderer.cursor);
    this.mapRenderer.cursor.render(this.turnOwner.currentTile);
    this.turnOwner.addTurnIndicator();
  }

  beginTurn() {}

  endTurn() {}

  afterTurn() {
    this.turnOwner.turnIndicator.destroy();
    this.inputManager.resetActorMoveKeys();
  }

  beginTrackingTurns() {
    this.beforeTurn();
    this.beginTurn();
  }

  nextTurn() {
    this.afterTurn();
    this.updateTurnOwner();

    this.turnCount += 1;

    this.beforeTurn();
    this.beginTurn();
  }

  updateTurnOwner() {
    // shuffle start of line to the end
    this.participants.push(this.participants.shift());
    this.turnOwner = this.participants[0];
  }
}
