import "phaser";

declare global {
  module Phaser.Tilemaps {
    interface Tile {
      topNeighbor: Function;
      bottomNeighbor: Function;
      leftNeighbor: Function;
      rightNeighbor: Function;
      neighbors: Function;
    }
  }
}
Phaser.Tilemaps.Tile.prototype.topNeighbor = function () {
  console.log(this);
  const x = this.pixelX;
  const y = this.pixelY - this.height;
  return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
};

Phaser.Tilemaps.Tile.prototype.bottomNeighbor = function () {
  const x = this.pixelX;
  const y = this.pixelY + this.height;
  return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
};

Phaser.Tilemaps.Tile.prototype.leftNeighbor = function () {
  const x = this.pixelX - this.width;
  const y = this.pixelY;
  return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
};

Phaser.Tilemaps.Tile.prototype.rightNeighbor = function () {
  const x = this.pixelX + this.width;
  const y = this.pixelY;
  return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
};

Phaser.Tilemaps.Tile.prototype.neighbors = function () {
  return {
    top: this.topNeighbor(),
    right: this.rightNeighbor(),
    bottom: this.bottomNeighbor(),
    left: this.leftNeighbor(),
  };
};
