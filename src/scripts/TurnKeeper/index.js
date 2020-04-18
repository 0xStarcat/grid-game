export default class TurnKeeper {
  constructor(scene, participants = []) {
    this.scene = scene;
    this.participants = participants;
    this.turnOwner = participants[0]; // who's turn it is
    this.turnCount = 1;
    this.turnIndicators = []; // UI indicators for sprites
  }

  beforeTurn() {
    console.log(`Beginning turn ${this.turnCount}`);
  }

  beginTurn() {
    this.turnOwner.addTurnIndicator();
  }

  endTurn() {}

  afterTurn() {
    this.turnOwner.turnIndicator.destroy();
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
