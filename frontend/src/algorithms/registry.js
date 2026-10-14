import { bfs, dfs } from "./graph";
import { binarySearch, linearSearch } from "./searching";
import { bubbleSort, insertionSort, mergeSort, quickSort, selectionSort } from "./sorting";

export const SORT_ALGORITHMS = {
  "bubble-sort": bubbleSort,
  "selection-sort": selectionSort,
  "insertion-sort": insertionSort,
  "merge-sort": mergeSort,
  "quick-sort": quickSort,
};

export const SEARCH_ALGORITHMS = {
  "linear-search": (values, target) => linearSearch(values, target),
  "binary-search": (values, target) => binarySearch(values, target),
};

export const GRAPH_ALGORITHMS = {
  bfs: (graph, start) => bfs(graph, start),
  dfs: (graph, start) => dfs(graph, start),
};

export function algorithmKind(slug) {
  if (SORT_ALGORITHMS[slug]) return "sort";
  if (SEARCH_ALGORITHMS[slug]) return "search";
  if (GRAPH_ALGORITHMS[slug]) return "graph";
  return null;
}

export function runAlgorithm(slug, input) {
  const kind = algorithmKind(slug);
  if (kind === "sort") return SORT_ALGORITHMS[slug](input.values);
  if (kind === "search") return SEARCH_ALGORITHMS[slug](input.values, input.target);
  if (kind === "graph") return GRAPH_ALGORITHMS[slug](input.graph, input.start);
  throw new Error(`Unknown algorithm: ${slug}`);
}

export function randomArray(size = 8, min = 1, max = 99) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export const DEMO_GRAPH = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F", "G"],
  F: ["C", "E"],
  G: ["E"],
};
