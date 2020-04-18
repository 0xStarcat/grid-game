export default class TurnKeeper {
  constructor(scene, participants = []) {
    this.scene = scene;
    this.participants = participants;
    this.turnOwner = participants[0]; // who's turn it is
    this.turnCount = 0;
    this.turnIndicators = []; // UI indicators for sprites
  }

  beforeTurn() {
    console.log(`Beginning turn ${this.turnCount}`);
  }

  beginTurn() {
    // Class CurrentActorIndicator
    const rect = this.scene.mapRenderer.addRectangleOutline(
      this.turnOwner.currentTile.pixelX,
      this.turnOwner.currentTile.pixelY,
      "0xefc53f"
    );

    this.scene.tweens.add({
      targets: rect,
      scaleX: 0.8,
      scaleY: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      repeatDelay: 4000,
    });

    this.turnIndicators.push(rect);
  }

  endTurn() {}

  afterTurn() {
    this.turnIndicators.forEach((indicator) => {
      indicator.destroy();
    });
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
