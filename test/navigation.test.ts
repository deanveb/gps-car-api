import { describe, expect, test } from "@jest/globals";
import * as navigation from "../api/navigation";

describe("findCoordinate module", () => {
  const coords = navigation.generateGraph();

  test("given A' coordinate", () => {
    expect(navigation.findCoordinate(coords, [0, 1])).toEqual(coords[0]);
  });
  test("given B' coordinate", () => {
    expect(navigation.findCoordinate(coords, [0, 3])).toEqual(coords[1]);
  });
  test("given unknown location", () => {
    expect(navigation.findCoordinate(coords, [0, 0])).toBeUndefined();
  });
});

describe("assignDistance module", () => {
  const coords = navigation.generateGraph();

  test("A has the correct distance to B", () => {
    expect(navigation.assignDistance(coords, [0, 3])[0].distance).toBe(2);
  });
  test("D has the correct distance to B", () => {
    expect(navigation.assignDistance(coords, [0, 3])[3].distance).toBe(3);
  });
  test("E has the correct distance to B", () => {
    expect(navigation.assignDistance(coords, [0, 3])[4].distance).toBe(1);
  });
  test("E has the correct distance to A", () => {
    expect(navigation.assignDistance(coords, [0, 1])[4].distance).toBe(3);
  });
  test("B has the correct distance to C", () => {
    expect(navigation.assignDistance(coords, [0, 5])[1].distance).toBe(2);
  });
});

describe("smallestCost module", () => {
  test("normal case", () => {
    expect(
      navigation.smallestCost([
        { totalCost: 11 },
        { totalCost: 30 },
      ] as navigation.coordinate[])
    ).toBe(0);
  });
  test("2 smallest path", () => {
    expect(
      navigation.smallestCost([
        { totalCost: 11 },
        { totalCost: 11 },
      ] as navigation.coordinate[])
    ).toBe(0);
  });
});

describe("shortestPath module", () => {
  test("correct shortest path from M to P", () => {
    const coords = navigation.generateGraph();
    expect(
      (
        navigation.findShortestPath(
          coords,
          [6, 1],
          [6, 6]
        ) as navigation.coordinate[]
      ).map((pos) => pos.position)
    ).toEqual([
      [6, 1],
      [4, 1],
      [4, 3],
      [6, 3],
      [6, 4],
      [6, 6],
    ]);
  });
  test("correct shortest path from P to F", () => {
    const coords = navigation.generateGraph();
    expect(
      (
        navigation.findShortestPath(
          coords,
          [6, 6],
          [1, 6]
        ) as navigation.coordinate[]
      ).map((pos) => pos.position)
    ).toEqual([
      [6, 6],
      [6, 4],
      [6, 3],
      [4, 3],
      [4, 6],
      [2, 6],
      [1, 6],
    ]);
  });
});

describe("getDirection module", () => {
  test("given vectors when starting out at M", () => {
    expect(
      navigation.getDirection(
        new navigation.vector(undefined),
        new navigation.vector([2, 0])
      )
    ).toBe("thang");
  });
  test("give correct direction when starting out at M and the car is at J then go to K", () => {
    expect(
      navigation.getDirection(
        new navigation.vector([-2, 0]),
        new navigation.vector([0, 2])
      )
    ).toBe("phai");
  });
  test("give correct direction when starting out at M and the car is at J then go to R", () => {
    expect(
      navigation.getDirection(
        new navigation.vector([-2, 0]),
        new navigation.vector([0, -1])
      )
    ).toBe("trai");
  });
});

describe("convertToObject module", () => {
  test("given correct output when start at M, end at J", () => {
    const coords = navigation.generateGraph();
    expect(
      JSON.stringify(
        navigation.convertToObject(
          navigation.findShortestPath(
            coords,
            [6, 1],
            [4, 1]
          ) as Array<navigation.coordinate>
        )
      )
    ).toBe(
      JSON.stringify([
        {
          distance: 50,
          direction: "thang",
        },
      ] as Array<navigation.doDuongResponse>)
    );
  });

  test("given correct output when start at M, end at P", () => {
    const coords = navigation.generateGraph();
    expect(
      JSON.stringify(
        navigation.convertToObject(
          navigation.findShortestPath(
            coords,
            [6, 1],
            [6, 6]
          ) as Array<navigation.coordinate>
        )
      )
    ).toBe(
      JSON.stringify([
        {
          distance: 50,
          direction: "thang",
        },
        {
          distance: 50,
          direction: "phai",
        },
        {
          distance: 50,
          direction: "phai",
        },
        {
          distance: 25,
          direction: "trai",
        },
        {
          distance: 50,
          direction: "thang",
        },
      ] as Array<navigation.doDuongResponse>)
    );
  });

  test("given correct output when start at P, end at F", () => {
    const coords = navigation.generateGraph();
    expect(
      JSON.stringify(
        navigation.convertToObject(
          navigation.findShortestPath(
            coords,
            [6, 6],
            [1, 6]
          ) as Array<navigation.coordinate>
        )
      )
    ).toBe(
      JSON.stringify([
        {
          distance: 50,
          direction: "thang",
        },
        {
          distance: 25,
          direction: "thang",
        },
        {
          distance: 50,
          direction: "phai",
        },
        {
          distance: 75,
          direction: "phai",
        },
        {
          distance: 50,
          direction: "trai",
        },
        {
          distance: 25,
          direction: "thang",
        },
      ] as Array<navigation.doDuongResponse>)
    );
  });
});
