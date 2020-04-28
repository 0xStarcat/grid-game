export default class AStarPathfinder {
  start: Phaser.Tilemaps.Tile;
  end: Phaser.Tilemaps.Tile;
  tiles: Phaser.Tilemaps.Tile[];

  openSet: Phaser.Tilemaps.Tile[];
  closedSet: Phaser.Tilemaps.Tile[];

  constructor(
    start: Phaser.Tilemaps.Tile,
    end: Phaser.Tilemaps.Tile,
    tiles: Phaser.Tilemaps.Tile[]
  ) {
    this.start = start;
    this.end = end;
    this.tiles = tiles;

    this.openSet = [];
    this.closedSet = [];
  }

  findPath() {
    let openSet: Phaser.Tilemaps.Tile[] = []; // nodes being evaluated
    let closedSet: Phaser.Tilemaps.Tile[] = []; // nodes already evaluated

    openSet.push(this.start);

    while (openSet.length > 0) {
      let currentNode = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        // if iteration's fCost < currentNode's fCost
        // or iteration's fCost and current's are equal, yet iteration's hCost is lower
        if (
          openSet[i].fCost < currentNode.fCost ||
          openSet[i].fCost == currentNode.fCost
        ) {
          if (openSet[i].hCost < currentNode.hCost) {
            currentNode = openSet[i];
          }
        }
      }

      // remove from openSet
      openSet = openSet.filter((node: Phaser.Tilemaps.Tile): boolean => {
        return node !== currentNode;
      });

      // add to closed set: Evaluated.
      closedSet.push(currentNode);

      // found the path -- return the parent trace
      if (currentNode === this.end) {
        return this.tracePath(this.start, this.end);
      }

      // evaluate all the node's neighbors now
      currentNode.neighborsArray.forEach((neighborNode) => {
        // skips neighbor if collides or already evaluated
        if (neighborNode.collides || closedSet.includes(neighborNode)) {
          return;
        }

        const movementCostToNeighbor =
          currentNode.gCost + this.getGridDistance(currentNode, neighborNode);

        if (
          movementCostToNeighbor < neighborNode.gCost ||
          !openSet.includes(neighborNode)
        ) {
          // calculates fCost for later evaluation via gCost + hCost
          neighborNode.gCost = movementCostToNeighbor;
          neighborNode.hCost = this.getGridDistance(neighborNode, this.end);

          // sets the pathParent so the path can be retraced once found
          neighborNode.pathParent = currentNode;

          // adds a fully fCosted neighbor to openSet for further evaluation next loop
          if (!openSet.includes(neighborNode)) {
            openSet.push(neighborNode);
          }
        }
      });
    }
  }

  // non-diagonal distance between 2 nodes along x and y axis
  getGridDistance(node1: Phaser.Tilemaps.Tile, node2: Phaser.Tilemaps.Tile) {
    const distanceX = Math.abs(node1.x - node2.x);
    const distanceY = Math.abs(node1.y - node2.y);

    return distanceX + distanceY;
  }

  tracePath(start: Phaser.Tilemaps.Tile, end: Phaser.Tilemaps.Tile) {
    const path = [end];

    let currentNode = end;

    while (currentNode != start) {
      path.unshift(currentNode.pathParent);
      currentNode = currentNode.pathParent;
    }

    return path;
  }
}
