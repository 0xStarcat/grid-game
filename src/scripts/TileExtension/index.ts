import "phaser";

declare global {
  module Phaser.Tilemaps {
    interface Tile {
      topNeighbor: Phaser.Tilemaps.Tile;
      bottomNeighbor: Phaser.Tilemaps.Tile;
      leftNeighbor: Phaser.Tilemaps.Tile;
      rightNeighbor: Phaser.Tilemaps.Tile;
      topLeftNeighbor: Phaser.Tilemaps.Tile;
      bottomLeftNeighbor: Phaser.Tilemaps.Tile;
      topRightNeighbor: Phaser.Tilemaps.Tile;
      bottomRightNeighbor: Phaser.Tilemaps.Tile;
      neighborsOrthogonal: Object;
      neighborsOrthogonalArray: Phaser.Tilemaps.Tile[];
      neighborsAll: Object;
      neighborsAllArray: Phaser.Tilemaps.Tile[];
      gCost: integer;
      _gCost: integer;
      hCost: integer;
      _hCost: integer;
      fCost: integer;
      pathParent: Phaser.Tilemaps.Tile;
    }
  }
}

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "topNeighbor", {
  get(this: Phaser.Tilemaps.Tile) {
    const x = this.pixelX;
    const y = this.pixelY - this.height;
    return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "bottomNeighbor", {
  get(this: Phaser.Tilemaps.Tile) {
    const x = this.pixelX;
    const y = this.pixelY + this.height;
    return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "leftNeighbor", {
  get(this: Phaser.Tilemaps.Tile) {
    const x = this.pixelX - this.width;
    const y = this.pixelY;
    return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "rightNeighbor", {
  get(this: Phaser.Tilemaps.Tile) {
    const x = this.pixelX + this.width;
    const y = this.pixelY;
    return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "neighborsOrthogonal", {
  get(this: Phaser.Tilemaps.Tile) {
    return {
      top: this.topNeighbor,
      right: this.rightNeighbor,
      bottom: this.bottomNeighbor,
      left: this.leftNeighbor,
    };
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "topLeftNeighbor", {
  get(this: Phaser.Tilemaps.Tile) {
    const x = this.pixelX - this.width;
    const y = this.pixelY - this.height;
    return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "topRightNeighbor", {
  get(this: Phaser.Tilemaps.Tile) {
    const x = this.pixelX + this.width;
    const y = this.pixelY - this.height;
    return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "bottomLeftNeighbor", {
  get(this: Phaser.Tilemaps.Tile) {
    const x = this.pixelX - this.width;
    const y = this.pixelY + this.height;
    return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "bottomRightNeighbor", {
  get(this: Phaser.Tilemaps.Tile) {
    const x = this.pixelX + this.width;
    const y = this.pixelY + this.height;
    return this.layer.tilemapLayer.getTileAtWorldXY(x, y);
  },
});

Object.defineProperty(
  Phaser.Tilemaps.Tile.prototype,
  "neighborsOrthogonalArray",
  {
    get(this: Phaser.Tilemaps.Tile) {
      // rearranging the order of this array will skew the A* pathfinder's choices
      // when evaluating neighbors that score equally in a path
      return [
        this.topNeighbor,
        this.rightNeighbor,
        this.bottomNeighbor,
        this.leftNeighbor,
      ];
    },
  }
);

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "neighborsAll", {
  get(this: Phaser.Tilemaps.Tile) {
    return {
      top: this.topNeighbor,
      topRight: this.topRightNeighbor,
      right: this.rightNeighbor,
      bottomRight: this.bottomRightNeighbor,
      bottom: this.bottomNeighbor,
      bottomLeftNeighbor: this.bottomRightNeighbor,
      left: this.leftNeighbor,
      topLeft: this.topLeftNeighbor,
    };
  },
});

Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "neighborsAllArray", {
  get(this: Phaser.Tilemaps.Tile) {
    // rearranging the order of this array will skew the A* pathfinder's choices
    // when evaluating neighbors that score equally in a path
    return [
      this.topNeighbor,
      this.topRightNeighbor,
      this.rightNeighbor,
      this.bottomRightNeighbor,
      this.bottomNeighbor,
      this.bottomLeftNeighbor,
      this.leftNeighbor,
      this.topLeftNeighbor,
    ];
  },
});

// A* pathfinding contituent
Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "gCost", {
  get(this: Phaser.Tilemaps.Tile) {
    return this._gCost;
  },
  set(this: Phaser.Tilemaps.Tile, value: integer) {
    this._gCost = value;
  },
});

// A* pathfinding contituent
Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "hCost", {
  get(this: Phaser.Tilemaps.Tile) {
    return this._hCost;
  },
  set(this: Phaser.Tilemaps.Tile, value: integer) {
    this._hCost = value;
  },
});

// A* pathfinding contituent
Object.defineProperty(Phaser.Tilemaps.Tile.prototype, "fCost", {
  get(this: Phaser.Tilemaps.Tile) {
    return this.gCost + this.hCost;
  },
});
