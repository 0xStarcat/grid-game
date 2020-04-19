import "phaser";

export const randomTile = (
  tile1Index: number,
  tile2Index: number,
  percentChance: number
) => {
  // Returns tile1Index by default, otherwise based on percentChance will return tile2Index
  const randomNumber = Phaser.Math.Between(1, 100);

  if (randomNumber < percentChance) {
    return tile2Index;
  } else {
    return tile1Index;
  }
};
