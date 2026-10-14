function step(type, indices, array, description, extra = {}) {
  return { type, indices, array: [...array], description, ...extra };
}

export function linearSearch(input, target) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let foundIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    steps.push(step("compare", [i], arr, `Checking index ${i} (${arr[i]}) against target ${target}`));
    if (arr[i] === target) {
      foundIndex = i;
      steps.push(step("found", [i], arr, `Found ${target} at index ${i}!`));
      break;
    }
  }
  if (foundIndex === -1) steps.push(step("not_found", [], arr, `${target} was not found in the array.`));
  return { steps, output: foundIndex, comparisons, swaps: 0 };
}

export function binarySearch(input, target) {
  const arr = [...input].sort((a, b) => a - b);
  const steps = [];
  let comparisons = 0;
  let lo = 0, hi = arr.length - 1;
  let foundIndex = -1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    comparisons++;
    steps.push(step("compare", [mid], arr, `Checking middle index ${mid} (${arr[mid]}) against target ${target}`, { range: [lo, hi] }));
    if (arr[mid] === target) {
      foundIndex = mid;
      steps.push(step("found", [mid], arr, `Found ${target} at index ${mid}!`));
      break;
    } else if (arr[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  if (foundIndex === -1) steps.push(step("not_found", [], arr, `${target} was not found in the array.`));
  return { steps, output: foundIndex, comparisons, swaps: 0, sortedArray: arr };
}
