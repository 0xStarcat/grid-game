import Phaser from "phaser";

import Scene1 from "Scenes/Scene1";

const body = document.querySelector("body");

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  scale: {
    width: 400,
    height: 400,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#DFA",
  scene: [Scene1],
};

const game = new Phaser.Game(config);
