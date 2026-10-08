import { useState } from "react";

import {
  bstDelete, bstInorder, bstInsert, bstPostorder, bstPreorder, bstSearch,
  linkedListDelete, linkedListInsert, linkedListSearch,
  queueDequeue, queueEnqueue, queuePeek,
  stackPeek, stackPop, stackPush,
} from "../algorithms/datastructures";

function OperationBar({ onRun, placeholder = "Value" }) {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className="input w-28"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {onRun.map(({ label, action, variant }) => (
        <button
          key={label}
          className={variant === "danger" ? "btn-danger" : "btn-secondary"}
          onClick={() => action(value) && setValue("")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Blocks({ items, highlightId, highlightValue, orientation = "row", labelStart, labelEnd }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${orientation === "col" ? "flex-col-reverse" : ""}`}>
      {items.length === 0 && <p className="text-sm text-ink-400">Empty</p>}
      {items.map((item, idx) => {
        const value = typeof item === "object" ? item.value : item;
        const id = typeof item === "object" ? item.id : idx;
        const isHighlighted = id === highlightId || value === highlightValue;
        return (
          <div key={id ?? idx} className="flex items-center gap-2">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold transition-colors ${
                isHighlighted ? "border-amber-500 bg-amber-100 text-amber-700" : "border-ink-200 bg-white text-ink-700"
              }`}
            >
              {value}
            </div>
            {idx < items.length - 1 && orientation === "row" && <span className="text-ink-300">→</span>}
          </div>
        );
      })}
      {items.length > 0 && labelStart && (
        <div className="flex w-full justify-between text-xs text-ink-400">
          <span>{labelStart}</span>
          <span>{labelEnd}</span>
        </div>
      )}
    </div>
  );
}

function TreeNode({ node }) {
  if (!node) return <div className="w-10" />;
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-400 bg-brand-50 font-mono text-sm font-bold text-brand-700">
        {node.value}
      </div>
      {(node.left || node.right) && (
        <div className="mt-2 flex gap-6 border-t border-ink-200 pt-2">
          <TreeNode node={node.left} />
          <TreeNode node={node.right} />
        </div>
      )}
    </div>
  );
}

export default function DataStructureVisualizer({ slug }) {
  const [description, setDescription] = useState("Try an operation below.");

  // Stack / Queue share array state
  const [linear, setLinear] = useState([]);
  // Linked list / doubly linked list
  const [list, setList] = useState([]);
  const [foundId, setFoundId] = useState(null);
  // Binary tree
  const [tree, setTree] = useState(null);
  const [traversalResult, setTraversalResult] = useState(null);

  if (slug === "stack") {
    return (
      <div className="flex flex-col gap-4">
        <Blocks items={[...linear].reverse()} orientation="col" />
        <OperationBar
          onRun={[
            { label: "Push", action: (v) => { if (!v) return false; const r = stackPush(linear, v); setLinear(r.state); setDescription(r.description); return true; } },
            { label: "Pop", variant: "danger", action: () => { const r = stackPop(linear); setLinear(r.state); setDescription(r.description); return true; } },
            { label: "Peek", action: () => { const r = stackPeek(linear); setDescription(r.description); return true; } },
            { label: "Clear", variant: "danger", action: () => { setLinear([]); setDescription("Stack cleared"); return true; } },
          ]}
        />
        <p className="text-sm text-ink-500">{description}</p>
      </div>
    );
  }

  if (slug === "queue") {
    return (
      <div className="flex flex-col gap-4">
        <Blocks items={linear} labelStart="Front" labelEnd="Back" />
        <OperationBar
          onRun={[
            { label: "Enqueue", action: (v) => { if (!v) return false; const r = queueEnqueue(linear, v); setLinear(r.state); setDescription(r.description); return true; } },
            { label: "Dequeue", variant: "danger", action: () => { const r = queueDequeue(linear); setLinear(r.state); setDescription(r.description); return true; } },
            { label: "Peek", action: () => { const r = queuePeek(linear); setDescription(r.description); return true; } },
            { label: "Clear", variant: "danger", action: () => { setLinear([]); setDescription("Queue cleared"); return true; } },
          ]}
        />
        <p className="text-sm text-ink-500">{description}</p>
      </div>
    );
  }

  if (slug === "linked-list" || slug === "doubly-linked-list") {
    const isDouble = slug === "doubly-linked-list";
    return (
      <div className="flex flex-col gap-4">
        <Blocks items={list} highlightId={foundId} />
        <OperationBar
          onRun={[
            { label: "Insert", action: (v) => { if (!v) return false; const r = linkedListInsert(list, v); setList(r.state); setDescription(r.description); setFoundId(null); return true; } },
            { label: "Delete", variant: "danger", action: (v) => { if (!v) return false; const r = linkedListDelete(list, v); setList(r.state); setDescription(r.description); setFoundId(null); return true; } },
            { label: "Search", action: (v) => { if (!v) return false; const r = linkedListSearch(list, v); setDescription(r.description); setFoundId(r.foundIndex >= 0 ? list[r.foundIndex].id : null); return true; } },
            {
              label: isDouble ? "Traverse Forward" : "Traverse",
              action: () => { setDescription(`Traversal: ${list.map((n) => n.value).join(" → ") || "(empty)"}`); return true; },
            },
            ...(isDouble
              ? [{ label: "Traverse Backward", action: () => { setDescription(`Traversal: ${[...list].reverse().map((n) => n.value).join(" → ") || "(empty)"}`); return true; } }]
              : []),
          ]}
        />
        <p className="text-sm text-ink-500">{description}</p>
      </div>
    );
  }

  if (slug === "binary-tree") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex min-h-[140px] justify-center overflow-x-auto py-4">
          <TreeNode node={tree} />
        </div>
        <OperationBar
          onRun={[
            { label: "Insert", action: (v) => { if (!v || isNaN(Number(v))) return false; setTree(bstInsert(tree, Number(v))); setDescription(`Inserted ${v}`); setTraversalResult(null); return true; } },
            { label: "Search", action: (v) => { if (!v || isNaN(Number(v))) return false; const r = bstSearch(tree, Number(v)); setDescription(r.found ? `Found ${v} (path: ${r.path.join(" → ")})` : `${v} not found`); return true; } },
            { label: "Delete", variant: "danger", action: (v) => { if (!v || isNaN(Number(v))) return false; setTree(bstDelete(tree, Number(v))); setDescription(`Deleted ${v}`); setTraversalResult(null); return true; } },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={() => setTraversalResult({ type: "Inorder", values: bstInorder(tree) })}>Inorder</button>
          <button className="btn-secondary" onClick={() => setTraversalResult({ type: "Preorder", values: bstPreorder(tree) })}>Preorder</button>
          <button className="btn-secondary" onClick={() => setTraversalResult({ type: "Postorder", values: bstPostorder(tree) })}>Postorder</button>
        </div>
        {traversalResult && (
          <p className="text-sm text-ink-600">
            <span className="font-semibold">{traversalResult.type}:</span> {traversalResult.values.join(", ") || "(empty)"}
          </p>
        )}
        <p className="text-sm text-ink-500">{description}</p>
      </div>
    );
  }

  return <p className="text-sm text-ink-500">Unknown data structure.</p>;
}
