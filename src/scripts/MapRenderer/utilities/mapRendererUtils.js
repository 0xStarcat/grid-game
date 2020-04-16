import Phaser from "phaser";

export const randomTile = (tile1, tile2, percentChance) => {
  // Returns tile1 by default, otherwise based on percentChance will return tile2
  const randomNumber = Phaser.Math.Between(1, 100);

  if (randomNumber < percentChance) {
    return tile2;
  } else {
    return tile1;
  }
};
