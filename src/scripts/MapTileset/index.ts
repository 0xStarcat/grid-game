import GameScene from "@scripts/GameScene";
import MapActor from "@scripts/MapActor";

export default class MapTileset {
  scene: GameScene;
  tileImageName: string;
  tileWidth: number;
  tileHeight: number;
  levelGenerator: Function;
  map: Phaser.Tilemaps.Tilemap;
  level: number[][];
  tileSet: Phaser.Tilemaps.Tileset;
  layers: Phaser.Tilemaps.StaticTilemapLayer[];
  tiles: Phaser.Tilemaps.Tile[];
  borderTiles: number[];

  constructor(
    scene: GameScene,
    tileImageName: string,
    tileWidth: number,
    tileHeight: number,
    levelGenerator: Function,
    borderTiles: number[]
  ) {
    this.scene = scene;
    this.tileImageName = tileImageName;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.levelGenerator = levelGenerator;
    this.level = this.levelGenerator();
    this.map = this.createMap();
    this.tileSet = this.createTileset(this.map, this.tileImageName);
    this.layers = [this.createLayer(this.map, this.tileSet)];
    this.tiles = this.getTiles(this.layers[0]);

    this.borderTiles = borderTiles;

    this.map.setCollision(this.borderTiles, true);
    this.setTileProperties();
  }

  createMap() {
    const map = this.scene.make.tilemap({
      data: this.level,
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight,
    });

    return map;
  }

  createTileset(map: Phaser.Tilemaps.Tilemap, tileImageName: string) {
    const tileset = map.addTilesetImage(tileImageName);

    return tileset;
  }

  createLayer(map: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) {
    const layer = map.createStaticLayer(0, tileset, 0, 0);
    return layer;
  }

  getTiles(layer: Phaser.Tilemaps.StaticTilemapLayer): Phaser.Tilemaps.Tile[] {
    return [].concat.apply([], layer.layer.data);
  }

  setTileProperties(): void {
    this.tiles.forEach((tile) => {
      if (this.borderTiles.includes(tile.index)) {
        tile.properties.borderTile = true;
      }
    });
  }

  setMovementTile(actor: MapActor, tile: Phaser.Tilemaps.Tile) {
    tile.properties.actor = actor;
    tile.properties.collides = true;
    this.map.setCollisionByProperty({ collides: true }, true);
  }

  unsetMovementTile(actor: MapActor, tile: Phaser.Tilemaps.Tile) {
    tile.properties.actor = actor;
    tile.properties.collides = false;
    this.map.setCollisionByProperty({ collides: false }, false);
  }

  handleActorMovement(
    actor: MapActor,
    oldTile: Phaser.Tilemaps.Tile,
    newTile: Phaser.Tilemaps.Tile
  ) {
    this.unsetMovementTile(actor, oldTile);
    this.setMovementTile(actor, newTile);
  }

  randomTile(
    checkCollision: boolean = true,
    layer: Phaser.Tilemaps.StaticTilemapLayer
  ) {
    let randomRow = Phaser.Utils.Array.GetRandom(layer.layer.data);
    let randomTile = Phaser.Utils.Array.GetRandom(randomRow);

    if (checkCollision) {
      while (randomTile.collides) {
        randomRow = Phaser.Utils.Array.GetRandom(layer.layer.data);
        randomTile = Phaser.Utils.Array.GetRandom(randomRow);
      }
    }

    return randomTile;
  }
}
