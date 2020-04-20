const randomTile = (
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

export const generateNatureTilesetLevel = (): number[][] => {
  const DIRT = 42;
  const GRASS = 40;
  const GRASS_STONE_TL = 75;
  const GRASS_STONE_T = 76;
  const GRASS_STONE_TR = 77;
  const GRASS_STONE_L = 95;
  const GRASS_STONE_R = 97;
  const GRASS_STONE_BL = 115;
  const GRASS_STONE_B = 116;
  const GRASS_STONE_BR = 117;

  const level = [
    [
      GRASS_STONE_TL,
      ...[...Array(8).keys()].map((k) => GRASS_STONE_T),
      GRASS_STONE_TR,
    ],
    [
      GRASS_STONE_L,
      ...[...Array(8).keys()].map((k) => randomTile(GRASS, DIRT, 5)),
      GRASS_STONE_R,
    ],
    [
      GRASS_STONE_L,
      ...[...Array(8).keys()].map((k) => randomTile(GRASS, DIRT, 20)),
      GRASS_STONE_R,
    ],
    [
      GRASS_STONE_L,
      ...[...Array(8).keys()].map((k) => randomTile(GRASS, DIRT, 40)),
      GRASS_STONE_R,
    ],
    [
      GRASS_STONE_L,
      ...[...Array(8).keys()].map((k) => randomTile(GRASS, DIRT, 50)),
      GRASS_STONE_R,
    ],
    [
      GRASS_STONE_L,
      ...[...Array(8).keys()].map((k) => randomTile(GRASS, DIRT, 50)),
      GRASS_STONE_R,
    ],
    [
      GRASS_STONE_L,
      ...[...Array(8).keys()].map((k) => randomTile(GRASS, DIRT, 40)),
      GRASS_STONE_R,
    ],
    [
      GRASS_STONE_L,
      ...[...Array(8).keys()].map((k) => randomTile(GRASS, DIRT, 20)),
      GRASS_STONE_R,
    ],
    [
      GRASS_STONE_L,
      ...[...Array(8).keys()].map((k) => randomTile(GRASS, DIRT, 5)),
      GRASS_STONE_R,
    ],
    [
      GRASS_STONE_BL,
      ...[...Array(8).keys()].map((k) => GRASS_STONE_B),
      GRASS_STONE_BR,
    ],
  ];

  return level;
};
