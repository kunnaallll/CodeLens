import { useMemo, useState } from "react";
import { bstDelete, bstInsert } from "../algorithms/datastructures";

const STRUCTURES = [
  { id: "stack", name: "Stack", detail: "Last in, first out", operations: "Push · Pop · Peek" },
  { id: "queue", name: "Queue", detail: "First in, first out", operations: "Enqueue · Dequeue · Front" },
  { id: "linked-list", name: "Linked list", detail: "A chain of connected nodes", operations: "Append · Delete value · Traverse" },
  { id: "doubly-linked-list", name: "Doubly linked list", detail: "Nodes connected in both directions", operations: "Append · Delete value · Traverse" },
  { id: "binary-tree", name: "Binary search tree", detail: "Smaller values left, larger values right", operations: "Insert · Find · Traversals" },
];
const INITIAL = [30, 20, 10];

function buildTree(values) {
  let root = null;
  for (const value of values) {
    if (!root) { root = { value, left: null, right: null }; continue; }
    let node = root;
    while (true) {
      const side = value < node.value ? "left" : "right";
      if (!node[side]) { node[side] = { value, left: null, right: null }; break; }
      node = node[side];
    }
  }
  return root;
}

function traverse(node, order, output = []) {
  if (!node) return output;
  if (order === "preorder") output.push(node.value);
  traverse(node.left, order, output);
  if (order === "inorder") output.push(node.value);
  traverse(node.right, order, output);
  if (order === "postorder") output.push(node.value);
  return output;
}

function TreeNode({ node }) {
  if (!node) return <span className="tree-placeholder" aria-hidden="true" />;
  return <div className="tree-node"><span className="tree-value">{node.value}</span>{(node.left || node.right) && <div className="tree-children"><TreeNode key="left" node={node.left} /><TreeNode key="right" node={node.right} /></div>}</div>;
}

export default function DataStructures() {
  const [active, setActive] = useState("stack");
  const [values, setValues] = useState(INITIAL);
  const [treeOverride, setTreeOverride] = useState(undefined);
  const [entry, setEntry] = useState("40");
  const [message, setMessage] = useState("Choose an operation to see how the structure changes.");
  const structure = STRUCTURES.find((item) => item.id === active);
  const tree = useMemo(() => active === "binary-tree" ? (treeOverride === undefined ? buildTree(values) : treeOverride) : null, [active, values, treeOverride]);
  const isTree = active === "binary-tree";
  const isQueue = active === "queue";
  const isList = active.includes("linked-list");

  function choose(id) { setActive(id); setValues(INITIAL); setTreeOverride(undefined); setMessage("Choose an operation to see how the structure changes."); }
  function getEntry() {
    const number = Number(entry);
    if (entry.trim() === "" || !Number.isFinite(number)) { setMessage("Enter a valid number first."); return null; }
    return number;
  }
  function addValue() {
    const number = getEntry();
    if (number === null) return;
    if (isTree && values.includes(number)) { setMessage(`${number} is already in the tree.`); return; }
    setValues((current) => [...current, number]);
    if (isTree) setTreeOverride(bstInsert(tree, number));
    setMessage(isTree ? `Inserted ${number} into the search tree.` : isQueue ? `Enqueued ${number} at the rear.` : isList ? `Appended ${number} to the tail.` : `Pushed ${number} onto the top.`);
  }
  function removeValue() {
    if (!values.length) { setMessage(`The ${structure.name.toLowerCase()} is empty.`); return; }
    if (isList) {
      const number = getEntry();
      if (number === null) return;
      if (!values.includes(number)) { setMessage(`${number} was not found; the list is unchanged.`); return; }
      setValues((current) => { const position = current.indexOf(number); return [...current.slice(0, position), ...current.slice(position + 1)]; });
      setMessage(`Deleted ${number} from the list.`);
      return;
    }
    const removed = isQueue ? values[0] : values[values.length - 1];
    setValues((current) => isQueue ? current.slice(1) : current.slice(0, -1));
    setMessage(`${isQueue ? "Dequeued" : "Popped"} ${removed}.`);
  }
  function inspect() {
    if (!values.length) { setMessage("There are no values to inspect."); return; }
    setMessage(`${isQueue ? "Front" : "Top"} value: ${isQueue ? values[0] : values[values.length - 1]}.`);
  }
  function findValue() {
    const number = getEntry();
    if (number !== null) setMessage(values.includes(number) ? `${number} is in the tree.` : `${number} is not in the tree.`);
  }
  function deleteTreeValue() {
    const number = getEntry();
    if (number === null) return;
    if (!values.includes(number)) { setMessage(`${number} was not found; the tree is unchanged.`); return; }
    setTreeOverride(bstDelete(tree, number));
    setValues((current) => current.filter((value) => value !== number));
    setMessage(`Deleted ${number} from the search tree.`);
  }
  function showTraversal(order) {
    const found = traverse(tree, order);
    setMessage(`${order[0].toUpperCase()}${order.slice(1)} traversal: ${found.join(" → ") || "empty tree"}.`);
  }

  return <div className="page-stack">
    <header className="page-heading"><p className="section-kicker">INTERACTIVE LAB</p><h1>Data structures</h1><p>Choose a structure, add values, and try its core operations. Everything runs in your browser.</p></header>
    <div className="structure-layout">
      <nav className="structure-list" aria-label="Choose a data structure">
        {STRUCTURES.map((item) => <button key={item.id} className={`structure-choice ${active === item.id ? "selected" : ""}`} onClick={() => choose(item.id)} aria-pressed={active === item.id}><strong>{item.name}</strong><span>{item.detail}</span></button>)}
      </nav>
      <section className="structure-lab" aria-labelledby="structure-title">
        <div className="structure-lab-heading"><div><p className="section-kicker">{structure.operations}</p><h2 id="structure-title">{structure.name}</h2><p>{structure.detail}</p></div><button className="btn-secondary" onClick={() => { setValues([]); setTreeOverride(undefined); setMessage("Cleared the structure."); }}>Clear</button></div>
        <div className={`structure-stage ${active}`} aria-live="polite">
          {isTree ? (tree ? <div className="tree-view"><TreeNode node={tree} /></div> : <p className="structure-empty">This tree is empty. Add a value to begin.</p>) : values.length ? <>{isList && <span className="null-node">HEAD</span>}{values.map((value, index) => <div className={`structure-node ${isQueue && index === 0 ? "node-front" : ""}`} key={`${value}-${index}`}><strong>{value}</strong>{isQueue && index === 0 && <small>FRONT</small>}{isQueue && index === values.length - 1 && <small>REAR</small>}{isList && <span className="node-link" aria-hidden="true">{active === "doubly-linked-list" ? "↔" : "→"}</span>}</div>)}{isList && <span className="null-node">NULL · TAIL</span>}</> : <p className="structure-empty">This structure is empty. Add a value to begin.</p>}
        </div>
        <div className="structure-controls"><label htmlFor="structure-value">{isList ? "Value to append / delete" : "Value"}<input id="structure-value" type="number" value={entry} onChange={(event) => setEntry(event.target.value)} /></label><div className="structure-buttons">
          <button className="btn-primary" onClick={addValue}>{isTree ? "Insert" : isQueue ? "Enqueue" : isList ? "Append" : "Push"}</button>
          {!isTree && <button className="btn-secondary" onClick={removeValue}>{isQueue ? "Dequeue" : isList ? "Delete value" : "Pop"}</button>}
          <button className="btn-secondary" onClick={isTree ? findValue : inspect}>{isTree ? "Find value" : isQueue ? "Front" : "Peek top"}</button>
          {isTree && <button className="btn-secondary" onClick={deleteTreeValue}>Delete value</button>}
          {isList && <button className="btn-secondary" onClick={() => setMessage(`List traversal: ${values.join(" → ") || "empty list"}.`)}>Traverse</button>}
          {isTree && ["inorder", "preorder", "postorder"].map((order) => <button className="btn-secondary" key={order} onClick={() => showTraversal(order)}>{order[0].toUpperCase() + order.slice(1)}</button>)}
        </div></div>
        <p className="structure-message" role="status">{message}</p>
      </section>
    </div>
  </div>;
}
