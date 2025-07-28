// TODO: learn esm vs cjs
// source: https://dev.to/glebirovich/typescript-data-structures-stack-and-queue-hld
interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  remove(index: number): T | undefined;
  size(): number;
}

interface doDuongResponse {
  distance: number;
  direction: "trai" | "phai" | "thang";
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
  coord: coordinate;
  weight: number;
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

  calculateWeight(from: coordinate, to: coordinate) {
    return (
      Math.abs(to.position[0] - from.position[0]) +
      Math.abs(to.position[1] - from.position[1])
    );
  }

  connectTo(coords: Array<coordinate>) {
    let result: Array<connectedNode> = [];

    coords.forEach((coord) => {
      result.push({
        coord: coord,
        weight: this.calculateWeight(this, coord),
      });
    });

    this.connections = this.connections.concat(result);
  }
}

class vector {
  value: Array<number>;

  constructor(value: Array<number> = [0, 0]) {
    this.value = value;
  }

  subtract(a: Array<number>) {
    this.value = [this.value[0] - a[0], this.value[1] - a[1]];
    return this.value;
  }

  normalize() {
    this.value = this.value.map((num) => {
      if (num > 0) {
        return 1;
      } else if (num < 0) {
        return -1
      }
      return 0;
    });
    
  }

  reverse() {
    const temp = this.value[0];
    this.value[0] = this.value[1];
    this.value[1] = temp;
  }
}

export default async function handler(req: any, res: any) {
  /*
		Map:
    0A0B1C00
    0D1E00F0
    0G010HI0
    00010010
    RJ1K11L0
    01010000
    0M0NO1P0
    0000Q000
	*/
  const coordinates: Array<coordinate> = generateGraph();
  // console.log(req.query, " ", req.query);
  const startPosition = [req.query.start0, req.query.start1];
  const endPosition = [req.query.end0, req.query.end1];

  const result = findShortestPath(coordinates, startPosition, endPosition);
  // Check for error
  if (typeof result == "string") {
    return res.status(400).json({ error: result, start: startPosition, end: endPosition});
  }

  const response = convertToObject(result);
  return res.status(200).json(response);
}

/** 
 * convertToObject's helper function
 * NOTE: this code will only work if the road is a straight line.Not on a diagonal road
 */
function getDirection(
  vectorPrev: vector,
  vectorNext: vector
): "trai" | "phai" | "thang" {
  // Will break if the starting point branch off into multiple path
  if (!vectorPrev.value) {
    return "thang";
  }

  vectorPrev.normalize();
  console.log(vectorPrev.value);
  
  vectorPrev.reverse();
  vectorNext.normalize();
  const compareValue: Array<number> = [
    vectorPrev.value[0] > 0 ? vectorPrev.value[0] : vectorPrev.value[1],
    vectorNext.value[0] > 0 ? vectorNext.value[0] : vectorNext.value[1],
  ];

  // console.log(-compareValue[0]);
  if (-compareValue[0] == compareValue[1]) {
    return "trai"
  } else if (compareValue[0] == compareValue[1]) {
    return "phai"
  } else {
    return "thang"
  }
}

/** convert into a response object to send back to client */
function convertToObject(coords: Array<coordinate>): Array<doDuongResponse> {
  const result = new Array<doDuongResponse>();
  let prevVectorDistance = new vector(undefined);
  const canhVuong = 25; // (cm)

  for (let i = 0; i < coords.length - 1; i++) {
    const current = new vector(coords[i + 1].position);
    const vectorDistance = current.subtract(coords[i].position);
    result.push({
      distance:
        canhVuong * vectorDistance[0] > 0
          ? vectorDistance[0]
          : vectorDistance[1],
      direction: getDirection(prevVectorDistance, new vector(vectorDistance)),
    });
    prevVectorDistance = new vector(vectorDistance);
  }

  return result;
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
    // console.log(node.position);

    // if the current node is the goal then terminate
    if (node.position.toString() === end.toString()) {
      const traveled = new Array<coordinate>();

      do {
        traveled.push(node);
        node = node.previous;
      } while (node.previous);
      // to push the start node
      traveled.push(node);

      // if traveled is empty that means that the end node is the start node
      return traveled.reverse();
    }
    // push every connection to queue
    node.connections.forEach((connection) => {
      // FIXME: "includes" might break because coord is an object
      if (!connection.coord.visited) {
        connection.coord.previous = node;
        connection.coord.totalCost =
          connection.coord.distance + node.totalCost + connection.weight;
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
  if (
    !findCoordinate(coordinates, start) ||
    !findCoordinate(coordinates, end)
  ) {
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
  const A = new coordinate([0, 1]);
  const B = new coordinate([0, 3]);
  const C = new coordinate([0, 5]);
  const D = new coordinate([1, 1]);
  const E = new coordinate([1, 3]);
  const F = new coordinate([1, 6]);
  const G = new coordinate([2, 1]);
  const H = new coordinate([2, 5]);
  const I = new coordinate([2, 6]);
  const J = new coordinate([4, 1]);
  const K = new coordinate([4, 3]);
  const L = new coordinate([4, 6]);
  const M = new coordinate([6, 1]);
  const N = new coordinate([6, 3]);
  const O = new coordinate([6, 4]);
  const P = new coordinate([6, 6]);
  const Q = new coordinate([7, 4]);
  const R = new coordinate([4, 0]);

  A.connectTo([D]);
  B.connectTo([E, C]);
  C.connectTo([B]);
  D.connectTo([A, G, E]);
  E.connectTo([B, D, K]);
  F.connectTo([I]);
  G.connectTo([D]);
  H.connectTo([I]);
  I.connectTo([L, H, F]);
  R.connectTo([J]);
  J.connectTo([R, M, K]);
  K.connectTo([J, L, N]);
  L.connectTo([I, K]);
  M.connectTo([J]);
  N.connectTo([K, O]);
  O.connectTo([N, Q, P]);
  P.connectTo([O]);
  Q.connectTo([O]);

  return [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q];
}

export {
  coordinate,
  connectedNode,
  assignDistance,
  smallestCost,
  findShortestPath,
  findCoordinate,
  aStar,
  generateGraph,
  getDirection,
  convertToObject,
  vector,
};
