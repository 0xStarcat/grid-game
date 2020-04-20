import GameScene from "@scripts/GameScene";

export default class UpdateSubscriber {
  scene: GameScene;
  subscriber: UpdateSubscribable;
  isPaused: boolean;
  isPlaying: boolean;
  constructor(scene: GameScene) {
    this.scene = scene;
    this.isPlaying = false;
    this.isPaused = false;
  }

  update() {
    if (this.isPaused) return;
    if (this.isPlaying) {
      this.onUpdate();
    }
  }

  onUpdate() {
    /* extend this method */
  }

  play() {
    this.isPlaying = true;
    this.isPaused = false;
  }

  pause() {
    console.log("pausing");
    this.isPlaying = false;
    this.isPaused = true;
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.destroy();
  }

  destroy() {
    const index = this.scene.updateSubscribers.indexOf(this);
    this.scene.updateSubscribers = [
      ...this.scene.updateSubscribers.slice(0, index),
      ...this.scene.updateSubscribers.slice(index + 1),
    ];
  }
}
