import * as u from "@scripts/MapRenderer/utilities/mapRendererUtils";

export default class MapTileset {
  scene: Phaser.Scene;
  tileImageName: string;
  tileWidth: number;
  tileHeight: number;
  map: Phaser.Tilemaps.Tilemap;
  level: number[][];
  tileSet: Phaser.Tilemaps.Tileset;
  layers: Phaser.Tilemaps.StaticTilemapLayer[];
  tiles: Phaser.Tilemaps.Tile[];
  borderTiles: number[];

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
    this.tiles = this.getTiles(this.layers[0]);

    this.borderTiles = [75, 76, 77, 95, 97, 115, 116, 117];

    // sets stone  borders as collidable
    this.map.setCollision(this.borderTiles, true);
    this.setTileProperties();
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

  getTiles(layer: Phaser.Tilemaps.StaticTilemapLayer): Phaser.Tilemaps.Tile[] {
    return [].concat.apply([], layer);
  }

  setTileProperties(): void {
    this.tiles.forEach((tile) => {
      if (this.borderTiles.includes(tile.index)) {
        tile.properties.borderTile = true;
      }
    });
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
}
