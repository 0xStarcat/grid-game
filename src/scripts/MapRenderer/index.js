import * as u from "./utilities/mapRendererUtils";

export default class MapRenderer {
  constructor(scene, tileImageName, tileWidth, tileHeight) {
    this.scene = scene;
    this.tileImageName = tileImageName;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.map = this.createMap();
    this.level = this.createLevel();
    this.tiles = this.createTileset(this.map, this.tileImageName);
    this.layers = [this.createLayer(this.map, this.tiles)];

    // sets stone  borders as collidable
    this.map.setCollision([75, 76, 77, 95, 97, 115, 116, 117], true);
  }

  createMap() {
    return this.scene.make.tilemap({
      data: this.createLevel(),
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight,
    });
  }

  createLevel() {
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
        ...[...Array(8).keys()].map((k) => u.randomTile(GRASS, DIRT, 5)),
        GRASS_STONE_R,
      ],
      [
        GRASS_STONE_L,
        ...[...Array(8).keys()].map((k) => u.randomTile(GRASS, DIRT, 20)),
        GRASS_STONE_R,
      ],
      [
        GRASS_STONE_L,
        ...[...Array(8).keys()].map((k) => u.randomTile(GRASS, DIRT, 40)),
        GRASS_STONE_R,
      ],
      [
        GRASS_STONE_L,
        ...[...Array(8).keys()].map((k) => u.randomTile(GRASS, DIRT, 50)),
        GRASS_STONE_R,
      ],
      [
        GRASS_STONE_L,
        ...[...Array(8).keys()].map((k) => u.randomTile(GRASS, DIRT, 50)),
        GRASS_STONE_R,
      ],
      [
        GRASS_STONE_L,
        ...[...Array(8).keys()].map((k) => u.randomTile(GRASS, DIRT, 40)),
        GRASS_STONE_R,
      ],
      [
        GRASS_STONE_L,
        ...[...Array(8).keys()].map((k) => u.randomTile(GRASS, DIRT, 20)),
        GRASS_STONE_R,
      ],
      [
        GRASS_STONE_L,
        ...[...Array(8).keys()].map((k) => u.randomTile(GRASS, DIRT, 5)),
        GRASS_STONE_R,
      ],
      [
        GRASS_STONE_BL,
        ...[...Array(8).keys()].map((k) => GRASS_STONE_B),
        GRASS_STONE_BR,
      ],
    ];

    return level;
  }

  createTileset(map, tileImageName) {
    const tileset = map.addTilesetImage(tileImageName);

    return tileset;
  }

  createLayer(map, tileset) {
    const layer = map.createStaticLayer(0, tileset, 0, 0);

    return layer;
  }

  randomTile(checkCollision = true) {
    const layer = this.map.layers[0];

    let randomRow = Phaser.Utils.Array.GetRandom(layer.data);
    let randomTile = Phaser.Utils.Array.GetRandom(randomRow);

    if (checkCollision) {
      while (randomTile.collides) {
        randomRow = Phaser.Utils.Array.GetRandom(layer.data);
        randomTile = Phaser.Utils.Array.GetRandom(randomRow);
      }
    }

    return randomTile;
  }

  currentTile(x, y) {
    return this.layers[0].getTileAtWorldXY(x, y);
  }

  topTile(currentTile) {
    return this.layers[0].getTileAtWorldXY(
      currentTile.pixelX,
      currentTile.pixelY - this.tileHeight
    );
  }

  rightTile(currentTile) {
    return this.layers[0].getTileAtWorldXY(
      currentTile.pixelX + this.tileWidth,
      currentTile.pixelY
    );
  }

  bottomTile(currentTile) {
    return this.layers[0].getTileAtWorldXY(
      currentTile.pixelX,
      currentTile.pixelY + this.tileHeight
    );
  }

  leftTile(currentTile) {
    return this.layers[0].getTileAtWorldXY(
      currentTile.pixelX - this.tileWidth,
      currentTile.pixelY
    );
  }

  setCollisionTile(tile) {
    tile.properties.collides = true;
    this.map.setCollisionByProperty({ collides: true }, true);
  }

  unsetCollisionTile(tile) {
    tile.properties.collides = false;
    this.map.setCollisionByProperty({ collides: false }, false);
  }

  handleMovementCollision(oldTile, newTile) {
    this.unsetCollisionTile(oldTile);
    this.setCollisionTile(newTile);
  }
}
