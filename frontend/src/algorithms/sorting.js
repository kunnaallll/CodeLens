/** Client-side sorting engines. These generate the full step trace used to
 * drive the visualizer (Play/Pause/Next/Previous). The backend re-runs the
 * same algorithms independently when a challenge is submitted, so nothing
 * here is trusted for scoring — only for what the student sees animate. */

function step(type, indices, array, description, extra = {}) {
  return { type, indices, array: [...array], description, ...extra };
}

export function bubbleSort(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let swappedThisPass = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push(step("compare", [j, j + 1], arr, `Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`));
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swappedThisPass = true;
        steps.push(step("swap", [j, j + 1], arr, `Swapping because ${arr[j + 1]} > ${arr[j]}`));
      }
    }
    if (!swappedThisPass) break;
  }
  steps.push(step("done", [], arr, "Array is sorted!"));
  return { steps, output: arr, comparisons, swaps };
}

export function selectionSort(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push(step("compare", [minIdx, j], arr, `Comparing current minimum (${arr[minIdx]}) with index ${j} (${arr[j]})`));
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      steps.push(step("swap", [i, minIdx], arr, `Placing ${arr[i]} at position ${i}`));
    }
  }
  steps.push(step("done", [], arr, "Array is sorted!"));
  return { steps, output: arr, comparisons, swaps };
}

export function insertionSort(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0) {
      comparisons++;
      steps.push(step("compare", [j, j + 1], arr, `Comparing index ${j} (${arr[j]}) with key ${key}`));
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        swaps++;
        j--;
        steps.push(step("swap", [j + 1, j + 2], arr, `Shifting ${arr[j + 1]} right`));
      } else break;
    }
    arr[j + 1] = key;
  }
  steps.push(step("done", [], arr, "Array is sorted!"));
  return { steps, output: arr, comparisons, swaps };
}

export function mergeSort(input) {
  const arr = [...input];
  const steps = [];
  const counters = { comparisons: 0, swaps: 0 };

  function merge(lo, mid, hi) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      counters.comparisons++;
      steps.push(step("compare", [lo + i, mid + 1 + j], arr, `Comparing ${left[i]} and ${right[j]}`));
      if (left[i] <= right[j]) {
        arr[k] = left[i++];
      } else {
        arr[k] = right[j++];
        counters.swaps++;
      }
      steps.push(step("overwrite", [k], arr, `Placing ${arr[k]} at position ${k}`));
      k++;
    }
    while (i < left.length) {
      arr[k] = left[i++];
      steps.push(step("overwrite", [k], arr, `Placing ${arr[k]} at position ${k}`));
      k++;
    }
    while (j < right.length) {
      arr[k] = right[j++];
      steps.push(step("overwrite", [k], arr, `Placing ${arr[k]} at position ${k}`));
      k++;
    }
  }

  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  sort(0, arr.length - 1);
  steps.push(step("done", [], arr, "Array is sorted!"));
  return { steps, output: arr, comparisons: counters.comparisons, swaps: counters.swaps };
}

export function quickSort(input) {
  const arr = [...input];
  const steps = [];
  const counters = { comparisons: 0, swaps: 0 };

  function partition(lo, hi) {
    const pivot = arr[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      counters.comparisons++;
      steps.push(step("compare", [j, hi], arr, `Comparing ${arr[j]} with pivot ${pivot}`));
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        counters.swaps++;
        steps.push(step("swap", [i, j], arr, `Swapping ${arr[j]} and ${arr[i]}`));
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    counters.swaps++;
    steps.push(step("swap", [i + 1, hi], arr, `Placing pivot ${arr[i + 1]} in its sorted position`));
    return i + 1;
  }

  function sort(lo, hi) {
    if (lo < hi) {
      const p = partition(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    }
  }

  sort(0, arr.length - 1);
  steps.push(step("done", [], arr, "Array is sorted!"));
  return { steps, output: arr, comparisons: counters.comparisons, swaps: counters.swaps };
}
