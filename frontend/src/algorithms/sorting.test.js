import { describe, expect, it } from "vitest";

import { bubbleSort, insertionSort, mergeSort, quickSort, selectionSort } from "./sorting";
import { binarySearch, linearSearch } from "./searching";
import { bfs, dfs } from "./graph";

const UNSORTED = [5, 3, 8, 1, 9, 2, 7];
const EXPECTED = [1, 2, 3, 5, 7, 8, 9];

describe("sorting engines", () => {
  it.each([
    ["bubbleSort", bubbleSort],
    ["selectionSort", selectionSort],
    ["insertionSort", insertionSort],
    ["mergeSort", mergeSort],
    ["quickSort", quickSort],
  ])("%s produces a correctly sorted array with a full step trace", (_name, fn) => {
    const result = fn(UNSORTED);
    expect(result.output).toEqual(EXPECTED);
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[result.steps.length - 1].type).toBe("done");
  });

  it.each([
    ["bubbleSort", bubbleSort],
    ["selectionSort", selectionSort],
    ["insertionSort", insertionSort],
    ["mergeSort", mergeSort],
    ["quickSort", quickSort],
  ])("%s does not mutate the caller's array", (_name, fn) => {
    const input = [3, 1, 2];
    fn(input);
    expect(input).toEqual([3, 1, 2]);
  });
});

describe("searching engines", () => {
  it("linearSearch finds an existing value", () => {
    expect(linearSearch([12, 5, 9, 21, 3], 21).output).toBe(3);
  });

  it("linearSearch reports -1 for a missing value", () => {
    expect(linearSearch([12, 5, 9], 99).output).toBe(-1);
  });

  it("binarySearch finds a value in a sorted array", () => {
    expect(binarySearch([2, 5, 8, 12, 16, 23], 16).output).toBe(4);
  });

  it("binarySearch reports -1 for a missing value", () => {
    expect(binarySearch([2, 5, 8, 12, 16, 23], 99).output).toBe(-1);
  });
});

describe("graph traversal engines", () => {
  const graph = { A: ["B", "C"], B: ["A", "D"], C: ["A", "D"], D: ["B", "C", "E"], E: ["D"] };

  it("bfs visits every reachable node starting from the source", () => {
    const result = bfs(graph, "A");
    expect(new Set(result.output)).toEqual(new Set(Object.keys(graph)));
    expect(result.output[0]).toBe("A");
  });

  it("dfs visits every reachable node starting from the source", () => {
    const result = dfs(graph, "A");
    expect(new Set(result.output)).toEqual(new Set(Object.keys(graph)));
    expect(result.output[0]).toBe("A");
  });
});
