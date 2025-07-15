import { findCoordinate, aStar, generateGraph } from "../api/navigation";

it("find A when given A position", () => {
  coords = generateGraph();
  findCoordinate(coords, coords[0])
})