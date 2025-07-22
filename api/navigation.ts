// TODO: learn esm vs cjs
// source: https://dev.to/glebirovich/typescript-data-structures-stack-and-queue-hld
interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  remove(index: number): T | undefined;
  size(): number;
}

class Queue<T> implements IQueue<T> {
  storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }
  dequeue(): T | undefined {
    return this.storage.shift();
  }
  size(): number {
    return this.storage.length;
  }
  remove(index: number): T | undefined {
    return this.storage.splice(index, 1)[0];
  }
}

interface connectedNode {
  coord : coordinate;
  weight : number;
}

class coordinate {
  connections: Array<connectedNode> = [];
  position: Array<number>;
  previous: coordinate = undefined;
  distance: number = 0;
  visited: boolean = false;
  totalCost: number = 0;

  constructor(position: Array<number>) {
    this.position = position;
  }

  calculateWeight(from : coordinate, to : coordinate) {
    return Math.abs(to.position[0] - from.position[0]) + Math.abs(to.position[1] - from.position[1]);
  }

  connectTo(coords: Array<coordinate>) {
    let result : Array<connectedNode> = []; 

    coords.forEach((coord) => {
      result.push({
        coord: coord,
        weight: this.calculateWeight(this, coord)
      });
    });

    this.connections = this.connections.concat(result);
  }
}

export default async function handler(req: any, res: any) {
  /*
		Map:
    0M0N1O00
    0K1J00C0
    0L010IH0
    00010010
    BA1C11G0
    01010000
    0A0DE1B0
    0000F000
	*/
  const coordinates: Array<coordinate> = generateGraph();
  console.log(req.query.start, " ", req.query.end);
  const startPosition = [3, 2];
  const endPosition = [2, 0];

  // check if start and end is valid if not return error json
  // run a*
}

/** Find the corresponding coordinate with the given position */
function findCoordinate(
  coordinates: Array<coordinate>,
  position: Array<number>
): coordinate | undefined {
  return coordinates.find(
    (coord) => JSON.stringify(coord.position) === JSON.stringify(position)
  );
}

/** Assign the mahattan distance to each coordinate */
function assignDistance(
  coordinates: Array<coordinate>,
  end: Array<number>
): Array<coordinate> | undefined {
  coordinates.forEach((coord) => {
    coord.distance =
      Math.abs(coord.position[0] - end[0]) +
      Math.abs(coord.position[1] - end[1]);
  });

  // To make unit testing easier
  return coordinates;
}

/** find the smallest g(n)(total weight from start to current) + h(n)(the distance from current to end) node */
function smallestCost(queue: Array<coordinate>): number {
  let min = queue[0].totalCost;
  let index = 0;

  queue.forEach((coord, i) => {
    if (coord.totalCost < min && !coord.visited) {
      min = coord.totalCost;
      index = i;
    }
  });

  return index;
}

/** Return an array of coordinate of the shortest path */
function aStar(
  availableConnections: Queue<coordinate>,
  end: Array<number>
): Array<coordinate> | undefined {
  while (true) {
    // if the queue is empty terminate
    if (availableConnections.size() <= 0) {
      return undefined;
    }

    let node = availableConnections.remove(
      smallestCost(availableConnections.storage)
    );
    node.visited = true;

    // if the current node is the goal then terminate
    if (node.position.toString() === end.toString()) {
      const traveled = new Array<coordinate>();

      // backtracking
      do {
        traveled.push(node);
        node = node.previous;
      } while (node.previous);

      // if traveled is empty that means that the end node is the start node
      return traveled.reverse();
    }
    // push every connection to queue
    node.connections.forEach((connection) => {
      // FIXME: "includes" might break because coord is an object
      if (!connection.coord.visited) {
        connection.coord.previous = node;
        connection.coord.totalCost = connection.coord.distance + node.totalCost + connection.weight;
        availableConnections.enqueue(connection.coord);
      }
    });
  }
}

function findShortestPath(
  coordinates: Array<coordinate>,
  start: Array<number>,
  end: Array<number>
): Array<coordinate> | string {
  if (!findCoordinate(coordinates, start) || !findCoordinate(coordinates, end)) {
    return "Start or end is not found";
  }
  // get the coordnate object with the start position
  const startCoordinate = findCoordinate(coordinates, start);
  // assign the distance between each coordinate
  assignDistance(coordinates, end);
  // inititate a queue
  const queue = new Queue<coordinate>();
  queue.enqueue(startCoordinate);
  // implement a separate bfs function
  // FIXME: handle undefined for aStar
  return aStar(queue, end);
}

function generateGraph(): Array<coordinate> {
  const A = new coordinate([6, 1]);
  const B = new coordinate([4, 0]);
  const C = new coordinate([4, 3]);
  const D = new coordinate([6, 2]);
  const E = new coordinate([6, 3]);
  const F = new coordinate([7, 4]);
  const G = new coordinate([4, 6]);
  const H = new coordinate([2, 6]);
  const I = new coordinate([2, 5]);
  const J = new coordinate([1, 3]);
  const K = new coordinate([1, 1]);
  const L = new coordinate([2, 1]);
  const M = new coordinate([0, 1]);
  const N = new coordinate([0, 2]);
  const O = new coordinate([0, 3]);

  

  return [A, B, C, D, E, F, G, H, I, G, J, K, L, M, N, O];
}

export {coordinate, connectedNode, assignDistance, smallestCost, findShortestPath, findCoordinate, aStar, generateGraph };