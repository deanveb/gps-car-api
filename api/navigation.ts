class coordinate {
  connection: Array<coordinate>;
  position: Array<number>;

  constructor(position: Array<number>) {
    this.connection = [];
    this.position = position;
  }

  connectTo(coords: Array<coordinate>) {
    this.connection.concat(coords);
  }
}

export default async function handler(req: any, res: any) {
  /*
		Map:
		E0D0
		0000
		C0B0
		00A0
	*/
  const coordinates: Array<coordinate> = generateGraph();
  console.log(req.query.start, " ", req.query.end);
  const startPosition = [3, 2];
  const endPosition = [2, 0];

  // check if start and end is valid if not return error json
  // run a*
}

function findCoordinate(
  coordinates: Array<coordinate>,
  position: Array<number>
): coordinate {
  coordinates.forEach((coord) => {
    // compare position of each coord
    if (coord.position.toString() === position.toString()) {
      return coord;
    }
  });
  return null;
}

function aStar(
  coordinates: Array<coordinate>,
  start: Array<number>,
  end: Array<number>
) {
  return;
}

function generateGraph(): Array<coordinate> {
  const A = new coordinate([3, 2]);
  const B = new coordinate([2, 2]);
  const C = new coordinate([2, 0]);
  const D = new coordinate([0, 2]);
  const E = new coordinate([0, 0]);

  A.connectTo([B]);
  B.connectTo([A, C, D]);
  C.connectTo([B]);
  D.connectTo([B, E]);
  E.connectTo([D]);

  return [A, B, C, D, E];
}

export { findCoordinate, aStar, generateGraph };
