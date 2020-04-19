import * as u from "./utilities/mapRendererUtils";
import Cursor from "@scripts/Cursor/index";

export default class MapRenderer {
  constructor(scene, tileImageName, tileWidth, tileHeight) {
    this.scene = scene;
    this.tileImageName = tileImageName;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.map = this.createMap();
    this.level = this.createLevel();
    this.tileSet = this.createTileset(this.map, this.tileImageName);
    this.layers = [this.createLayer(this.map, this.tileSet)];
    this.currentLayer = this.layers[0];
    this.tiles = this.getTiles();
    this.cursor = new Cursor(
      this.scene,
      this,
      this.tiles[0].pixelX,
      this.tiles[0].pixelY
    );

    this.borderTiles = [75, 76, 77, 95, 97, 115, 116, 117];
    // sets stone  borders as collidable
    this.map.setCollision(this.borderTiles, true);
    this.setTileProperties();

    // show grid
    this.moveableGrid = this.createMoveableGrid();
  }

  createMap() {
    const map = this.scene.make.tilemap({
      data: this.createLevel(),
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight,
    });

    return map;
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
    return this.currentLayer.getTileAtWorldXY(x, y);
  }

  upTile(currentTile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX,
      currentTile.pixelY - this.tileHeight
    );
  }

  rightTile(currentTile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX + this.tileWidth,
      currentTile.pixelY
    );
  }

  downTile(currentTile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX,
      currentTile.pixelY + this.tileHeight
    );
  }

  leftTile(currentTile) {
    return this.currentLayer.getTileAtWorldXY(
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

  getTiles() {
    return [].concat.apply([], this.currentLayer.layer.data);
  }

  setTileProperties() {
    this.tiles.forEach((tile) => {
      if (this.borderTiles.includes(tile.index)) {
        tile.properties.borderTile = true;
      }
    });
  }

  addRectangleOutline(tileX, tileY, color) {
    const rect = this.scene.add.rectangle(
      tileX + this.tileWidth / 2,
      tileY + this.tileHeight / 2,
      this.tileWidth,
      this.tileHeight,
      "0x000000",
      0
    );
    rect.setStrokeStyle(1, color);
    return rect;
  }

  addGridSquare(tileX, tileY, color) {
    // remember, grid origins are in the center
    // while tile origins are top left
    const gridSquare = this.scene.add.grid(
      tileX + this.tileWidth / 2,
      tileY + this.tileHeight / 2,
      this.tileWidth,
      this.tileHeight,
      this.tileWidth,
      this.tileHeight,
      color,
      0.25
    );

    return gridSquare;
  }

  createMoveableGrid() {
    this.tiles.forEach((tile) => {
      if (tile.collides) return;
      this.addGridSquare(tile.pixelX, tile.pixelY, "0x000000");
    });
  }
}
