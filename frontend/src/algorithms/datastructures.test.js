import { describe, expect, it } from "vitest";

import {
  bstDelete, bstInorder, bstInsert, bstPostorder, bstPreorder, bstSearch,
  linkedListDelete, linkedListInsert, linkedListSearch,
  queueDequeue, queueEnqueue,
  stackPop, stackPush,
} from "./datastructures";

describe("stack", () => {
  it("push/pop follows last-in-first-out order", () => {
    let stack = [];
    stack = stackPush(stack, 1).state;
    stack = stackPush(stack, 2).state;
    stack = stackPush(stack, 3).state;
    expect(stack).toEqual([1, 2, 3]);

    const popped = stackPop(stack);
    expect(popped.state).toEqual([1, 2]);
    expect(popped.description).toContain("3");
  });

  it("popping an empty stack is a no-op with a clear message", () => {
    const result = stackPop([]);
    expect(result.state).toEqual([]);
    expect(result.description).toMatch(/empty/i);
  });
});

describe("queue", () => {
  it("enqueue/dequeue follows first-in-first-out order", () => {
    let queue = [];
    queue = queueEnqueue(queue, "a").state;
    queue = queueEnqueue(queue, "b").state;
    const dequeued = queueDequeue(queue);
    expect(dequeued.state).toEqual(["b"]);
    expect(dequeued.description).toContain("a");
  });
});

describe("linked list", () => {
  it("insert appends to the tail, search finds by value, delete removes it", () => {
    let list = [];
    list = linkedListInsert(list, 10).state;
    list = linkedListInsert(list, 20).state;
    expect(list.map((n) => n.value)).toEqual([10, 20]);

    const found = linkedListSearch(list, 20);
    expect(found.foundIndex).toBe(1);

    const afterDelete = linkedListDelete(list, 10).state;
    expect(afterDelete.map((n) => n.value)).toEqual([20]);
  });

  it("search reports -1 for a missing value", () => {
    const result = linkedListSearch([], 99);
    expect(result.foundIndex).toBe(-1);
  });
});

describe("binary search tree", () => {
  function buildTree() {
    let root = null;
    for (const v of [50, 30, 70, 20, 40]) root = bstInsert(root, v);
    return root;
  }

  it("inorder traversal yields sorted order", () => {
    expect(bstInorder(buildTree())).toEqual([20, 30, 40, 50, 70]);
  });

  it("preorder visits root before children", () => {
    expect(bstPreorder(buildTree())[0]).toBe(50);
  });

  it("postorder visits root last", () => {
    const post = bstPostorder(buildTree());
    expect(post[post.length - 1]).toBe(50);
  });

  it("search finds an existing value and reports the traversal path", () => {
    const result = bstSearch(buildTree(), 40);
    expect(result.found).toBe(true);
    expect(result.path).toEqual([50, 30, 40]);
  });

  it("search reports not-found for a missing value", () => {
    expect(bstSearch(buildTree(), 999).found).toBe(false);
  });

  it("delete removes a leaf node without disturbing the rest of the tree", () => {
    const pruned = bstDelete(buildTree(), 20);
    expect(bstInorder(pruned)).toEqual([30, 40, 50, 70]);
  });

  it("delete of a node with two children preserves BST ordering", () => {
    const pruned = bstDelete(buildTree(), 30);
    expect(bstInorder(pruned)).toEqual([20, 40, 50, 70]);
  });
});
