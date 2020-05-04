export default class AStarPathfinder {
  start: Phaser.Tilemaps.Tile;
  end: Phaser.Tilemaps.Tile;
  tiles: Phaser.Tilemaps.Tile[];

  openSet: Phaser.Tilemaps.Tile[];
  closedSet: Phaser.Tilemaps.Tile[];

  diagonalCost: integer;
  orthogonalCost: integer;
  manhattanD: number;

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

    this.diagonalCost = 14; // 14
    this.orthogonalCost = 10; // 10
    this.manhattanD = 0.0001; // higher numbers means tighter zig zags, lower (like 0.0001) mean bigger then tighter zigzags as approaching goal.
  }

  findPath(diagonals = false) {
    const allowedNeighbors = diagonals
      ? "neighborsAllArray"
      : "neighborsOrthogonalArray";

    this.openSet.push(this.start);

    while (this.openSet.length > 0) {
      let currentNode = this.openSet[0];
      for (let i = 1; i < this.openSet.length; i++) {
        // if iteration's fCost < currentNode's fCost
        // or iteration's fCost and current's are equal, yet iteration's hCost is lower
        if (
          this.openSet[i].fCost < currentNode.fCost ||
          this.openSet[i].fCost == currentNode.fCost
        ) {
          if (this.openSet[i].hCost < currentNode.hCost) {
            currentNode = this.openSet[i];
          }
        }
      }

      // remove from this.openSet
      const index = this.openSet.indexOf(currentNode);
      this.openSet = [
        ...this.openSet.slice(0, index),
        ...this.openSet.slice(index + 1),
      ];

      // add to closed set: Evaluated.
      this.closedSet.push(currentNode);

      // found the path -- return the parent trace
      if (currentNode === this.end) {
        return this.tracePath(this.start, this.end);
      }

      // evaluate all the node's neighbors now
      currentNode[allowedNeighbors].forEach((neighborNode) => {
        // skips neighbor if collides or already evaluated
        if (neighborNode.collides || this.closedSet.includes(neighborNode)) {
          return;
        }

        const movementCostToNeighbor =
          currentNode.gCost + this.getGridDistance(currentNode, neighborNode) ||
          0; // TODO - override Tile prototype constructor and set gCost default value

        if (
          movementCostToNeighbor < neighborNode.gCost ||
          !this.openSet.includes(neighborNode)
        ) {
          // calculates fCost for later evaluation via gCost + hCost

          if (diagonals) {
            // Diagonal heuristic
            neighborNode.gCost = movementCostToNeighbor;
            neighborNode.hCost = this.getGridDistance(neighborNode, this.end);
          } else {
            // Manhattan Heuristic (non-diagonal)
            neighborNode.gCost = this.getGridDistance(this.start, neighborNode);
            neighborNode.hCost = this.getManhattanDistance(
              neighborNode,
              this.end
            );
          }

          // sets the pathParent so the path can be retraced once found
          neighborNode.pathParent = currentNode;

          // adds a fully fCosted neighbor to this.openSet for further evaluation next loop
          if (!this.openSet.includes(neighborNode)) {
            this.openSet.push(neighborNode);
          } else if (
            movementCostToNeighbor < neighborNode.gCost &&
            this.openSet.includes(neighborNode)
          ) {
            // updates existing node if already in open set
            const index = this.openSet.indexOf(neighborNode);
            this.openSet[index] = neighborNode;
          }
        } else {
          // updates existing node if already in open set
          this.closedSet.push(neighborNode);
        }
      });
    }

    // no path found
    return [this.start];
  }

  getManhattanDistance(
    node: Phaser.Tilemaps.Tile,
    endNode: Phaser.Tilemaps.Tile
  ) {
    const D = this.manhattanD;
    const dx = Math.abs(node.x - endNode.x);
    const dy = Math.abs(node.y - endNode.y);
    return D * (dx + dy);
  }

  // distance between 2 nodes along x and y axis w/ weighted diagonal vs orthogonal movement
  getGridDistance(node1: Phaser.Tilemaps.Tile, endNode: Phaser.Tilemaps.Tile) {
    const distanceX = Math.abs(node1.x - endNode.x);
    const distanceY = Math.abs(node1.y - endNode.y);
    let distance;

    if (distanceX > distanceY)
      distance =
        this.diagonalCost * distanceY +
        this.orthogonalCost * (distanceX - distanceY);
    else {
      distance =
        this.diagonalCost * distanceX +
        this.orthogonalCost * (distanceY - distanceX);
    }
    // console.log(distance, distanceX + distanceY);
    return distance;
    // return distanceX + distanceY;
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
