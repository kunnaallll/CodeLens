/** Lightweight, real (not simulated) data structure implementations backing
 * the interactive visualizers. Each operation returns a fresh state plus a
 * human-readable description of what just happened, so the UI can show it. */

export function stackPush(stack, value) {
  return { state: [...stack, value], description: `Pushed ${value} onto the stack` };
}
export function stackPop(stack) {
  if (!stack.length) return { state: stack, description: "Stack is empty — nothing to pop" };
  const value = stack[stack.length - 1];
  return { state: stack.slice(0, -1), description: `Popped ${value} from the stack` };
}
export function stackPeek(stack) {
  if (!stack.length) return { state: stack, description: "Stack is empty" };
  return { state: stack, description: `Top of stack is ${stack[stack.length - 1]}` };
}

export function queueEnqueue(queue, value) {
  return { state: [...queue, value], description: `Enqueued ${value}` };
}
export function queueDequeue(queue) {
  if (!queue.length) return { state: queue, description: "Queue is empty — nothing to dequeue" };
  const value = queue[0];
  return { state: queue.slice(1), description: `Dequeued ${value}` };
}
export function queuePeek(queue) {
  if (!queue.length) return { state: queue, description: "Queue is empty" };
  return { state: queue, description: `Front of queue is ${queue[0]}` };
}

let nodeIdCounter = 0;
export function makeNode(value) {
  return { id: `n${++nodeIdCounter}`, value };
}

export function linkedListInsert(list, value) {
  return { state: [...list, makeNode(value)], description: `Inserted ${value} at the tail` };
}
export function linkedListDelete(list, value) {
  const idx = list.findIndex((n) => n.value === value);
  if (idx === -1) return { state: list, description: `${value} was not found in the list` };
  const next = [...list];
  next.splice(idx, 1);
  return { state: next, description: `Deleted ${value} from the list` };
}
export function linkedListSearch(list, value) {
  const idx = list.findIndex((n) => n.value === value);
  return {
    state: list,
    foundIndex: idx,
    description: idx === -1 ? `${value} was not found` : `Found ${value} at position ${idx}`,
  };
}

// Binary Search Tree
export function bstInsert(root, value) {
  if (!root) return makeNode(value);
  const node = { ...root };
  if (value < node.value) node.left = bstInsert(node.left, value);
  else if (value > node.value) node.right = bstInsert(node.right, value);
  return node;
}

export function bstSearch(root, value) {
  const path = [];
  let node = root;
  while (node) {
    path.push(node.value);
    if (value === node.value) return { found: true, path };
    node = value < node.value ? node.left : node.right;
  }
  return { found: false, path };
}

function bstMin(node) {
  let current = node;
  while (current.left) current = current.left;
  return current;
}

export function bstDelete(root, value) {
  if (!root) return null;
  if (value < root.value) return { ...root, left: bstDelete(root.left, value) };
  if (value > root.value) return { ...root, right: bstDelete(root.right, value) };
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  const successor = bstMin(root.right);
  return { ...root, value: successor.value, right: bstDelete(root.right, successor.value) };
}

export function bstInorder(root, out = []) {
  if (!root) return out;
  bstInorder(root.left, out);
  out.push(root.value);
  bstInorder(root.right, out);
  return out;
}
export function bstPreorder(root, out = []) {
  if (!root) return out;
  out.push(root.value);
  bstPreorder(root.left, out);
  bstPreorder(root.right, out);
  return out;
}
export function bstPostorder(root, out = []) {
  if (!root) return out;
  bstPostorder(root.left, out);
  bstPostorder(root.right, out);
  out.push(root.value);
  return out;
}
