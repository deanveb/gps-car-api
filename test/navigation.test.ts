import {describe, expect, test} from '@jest/globals';
import * as navigation from "../api/navigation";


describe('findCoordinate module', () => {
  const coords = navigation.generateGraph();

  test('given A\' coordinate', () => {
    expect(navigation.findCoordinate(coords, [3, 2])).toEqual(coords[0]);
  });
  test('given B\' coordinate', () => {
    expect(navigation.findCoordinate(coords, [2, 2])).toEqual(coords[1]);
  });
  test('given unknown location', () => {
    expect(navigation.findCoordinate(coords, [0, 1])).toBeUndefined();
  });
});

describe('assignDistance module', () => {
  const coords = navigation.generateGraph();

  test('A has the correct distance to B', () => {
    expect(navigation.assignDistance(coords, [2, 2])[0].distance).toBe(1);
  })
  test('D has the correct distance to B', () => {
    expect(navigation.assignDistance(coords, [2, 2])[3].distance).toBe(2);
  })
  test('E has the correct distance to B', () => {
    expect(navigation.assignDistance(coords, [2, 2])[4].distance).toBe(4);
  })
  test('E has the correct distance to A', () => {
    expect(navigation.assignDistance(coords, [3, 2])[4].distance).toBe(5);
  })
  test('B has the correct distance to C', () => {
    expect(navigation.assignDistance(coords, [2, 0])[1].distance).toBe(2);
  })
});

describe('smallestCost module', () => {
  test('normal case', () => {
    expect(navigation.smallestCost([{totalCost : 11}, {totalCost : 30}] as navigation.coordinate[])).toBe(0);
  });
  test('2 smallest path', () => {
    expect(navigation.smallestCost([{totalCost : 11}, {totalCost : 11}] as navigation.coordinate[])).toBe(0);
  });
});

describe('shortestPath module', () => {
  test('correct shortest path from A to B', () => {
    const coords = navigation.generateGraph();
    expect((navigation.findShortestPath(coords, [3, 2], [2, 2]) as navigation.coordinate[]).map(pos => pos.position)).toEqual([[2, 2]]);
  });

  test('correct shortest path from A to C', () => {
    const coords = navigation.generateGraph();
    expect((navigation.findShortestPath(coords, [3, 2], [2, 0]) as navigation.coordinate[]).map(pos => pos.position)).toEqual([[2, 2], [2, 0]]);
  });

  test('correct shortest path from B to E', () => {
    const coords = navigation.generateGraph();
    expect((navigation.findShortestPath(coords, [2, 2], [0, 0]) as navigation.coordinate[]).map(pos => pos.position)).toEqual([[0, 2], [0, 0]]);
  });

  test('correct shortest path from B to E', () => {
    const coords = navigation.generateGraph();
    expect((navigation.findShortestPath(coords, [2, 3], [0, 0]) as navigation.coordinate[])).toBe("Start or end is not found");
  });
});