import * as u from "./utilities/mapRendererUtils";
import Cursor from "@scripts/Cursor/index";

export default class MapRenderer {
  scene: Phaser.Scene;
  tileImageName: string;
  tileWidth: number;
  tileHeight: number;
  map: Phaser.Tilemaps.Tilemap;
  level: number[][];
  tileSet: Phaser.Tilemaps.Tileset;
  layers: Phaser.Tilemaps.StaticTilemapLayer[];
  currentLayer: Phaser.Tilemaps.StaticTilemapLayer;
  tiles: Phaser.Tilemaps.Tile[];
  borderTiles: number[];
  cursor: Cursor;

  constructor(
    scene: Phaser.Scene,
    tileImageName: string,
    tileWidth: number,
    tileHeight: number
  ) {
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
    this.createMoveableGrid();
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

  createTileset(map: Phaser.Tilemaps.Tilemap, tileImageName: string) {
    const tileset = map.addTilesetImage(tileImageName);
    console.log(tileset);

    return tileset;
  }

  createLayer(map: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) {
    const layer = map.createStaticLayer(0, tileset, 0, 0);

    return layer;
  }

  randomTile(checkCollision: boolean = true) {
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

  currentTile(x: number, y: number) {
    return this.currentLayer.getTileAtWorldXY(x, y);
  }

  upTile(currentTile: Phaser.Tilemaps.Tile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX,
      currentTile.pixelY - this.tileHeight
    );
  }

  rightTile(currentTile: Phaser.Tilemaps.Tile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX + this.tileWidth,
      currentTile.pixelY
    );
  }

  downTile(currentTile: Phaser.Tilemaps.Tile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX,
      currentTile.pixelY + this.tileHeight
    );
  }

  leftTile(currentTile: Phaser.Tilemaps.Tile) {
    return this.currentLayer.getTileAtWorldXY(
      currentTile.pixelX - this.tileWidth,
      currentTile.pixelY
    );
  }

  setCollisionTile(tile: Phaser.Tilemaps.Tile) {
    tile.properties.collides = true;
    this.map.setCollisionByProperty({ collides: true }, true);
  }

  unsetCollisionTile(tile: Phaser.Tilemaps.Tile) {
    tile.properties.collides = false;
    this.map.setCollisionByProperty({ collides: false }, false);
  }

  handleMovementCollision(
    oldTile: Phaser.Tilemaps.Tile,
    newTile: Phaser.Tilemaps.Tile
  ) {
    this.unsetCollisionTile(oldTile);
    this.setCollisionTile(newTile);
  }

  getTiles(): Phaser.Tilemaps.Tile[] {
    return [].concat.apply([], this.currentLayer.layer.data);
  }

  setTileProperties(): void {
    this.tiles.forEach((tile) => {
      if (this.borderTiles.includes(tile.index)) {
        tile.properties.borderTile = true;
      }
    });
  }

  addRectangleOutline(tileX: number, tileY: number, color: number) {
    const rect = this.scene.add.rectangle(
      tileX + this.tileWidth / 2,
      tileY + this.tileHeight / 2,
      this.tileWidth,
      this.tileHeight,
      Phaser.Display.Color.ValueToColor("0x000000").color,
      0
    );
    rect.setStrokeStyle(1, color);
    return rect;
  }

  addGridSquare(tileX: number, tileY: number, color: number) {
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
      this.addGridSquare(
        tile.pixelX,
        tile.pixelY,
        Phaser.Display.Color.ValueToColor("0x000000").color
      );
    });
  }
}
