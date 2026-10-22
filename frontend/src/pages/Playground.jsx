import { useMemo, useState } from "react";
import { bubbleSort } from "../algorithms/sorting";

const TEMPLATES = {
  Python: `def bubble_sort(values):\n    items = values.copy()\n    for end in range(len(items) - 1, 0, -1):\n        changed = False\n        for index in range(end):\n            if items[index] > items[index + 1]:\n                items[index], items[index + 1] = items[index + 1], items[index]\n                changed = True\n        if not changed:\n            break\n    return items\n\nprint(bubble_sort([5, 2, 8, 1, 3]))`,
  Java: `import java.util.Arrays;\n\nclass Main {\n  static int[] bubbleSort(int[] values) {\n    int[] items = values.clone();\n    for (int end = items.length - 1; end > 0; end--) {\n      boolean changed = false;\n      for (int i = 0; i < end; i++) {\n        if (items[i] > items[i + 1]) {\n          int temp = items[i];\n          items[i] = items[i + 1];\n          items[i + 1] = temp;\n          changed = true;\n        }\n      }\n      if (!changed) break;\n    }\n    return items;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(Arrays.toString(bubbleSort(new int[]{5, 2, 8, 1, 3})));\n  }\n}`,
};

const CASES = [
  { name: "Mixed values", input: [5, 2, 8, 1, 3], expected: [1, 2, 3, 5, 8] },
  { name: "Already sorted", input: [1, 2, 3, 4], expected: [1, 2, 3, 4] },
  { name: "Repeated values", input: [4, 2, 4, 1], expected: [1, 2, 4, 4] },
];

export default function Playground() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(TEMPLATES.Python);
  const [input, setInput] = useState("5, 2, 8, 1, 3");
  const [result, setResult] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState("");
  const tests = useMemo(() => testResults || [], [testResults]);

  function selectLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setCode(TEMPLATES[nextLanguage]);
  }

  function runInput(event) {
    event.preventDefault();
    const values = input.split(",").map((part) => part.trim());
    if (!values.length || values.some((part) => !part || !Number.isFinite(Number(part)))) {
      setError("Enter numbers separated by commas.");
      setResult(null);
      return;
    }
    setError("");
    setTestResults(null);
    setResult(bubbleSort(values.map(Number)));
  }

  function runTests() {
    setError("");
    setTestResults(CASES.map((test) => {
      const actual = bubbleSort(test.input).output;
      return { ...test, actual, passed: JSON.stringify(actual) === JSON.stringify(test.expected) };
    }));
  }

  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="section-kicker">CODE PLAYGROUND</p>
        <h1>Try a sorting algorithm</h1>
        <p>Explore starter code and run the built-in Bubble Sort visualizer on your own values.</p>
      </header>
      <div className="playground-note">The code panel contains a starter template. Run uses CodeLens’s built-in, safe algorithm implementation rather than executing arbitrary source code.</div>
      <section className="playground-panel">
        <div className="playground-toolbar"><label htmlFor="playground-language">Language</label><select id="playground-language" value={language} onChange={(event) => selectLanguage(event.target.value)}><option>Python</option><option>Java</option></select><span>Bubble Sort · O(n²) average time</span></div>
        <textarea className="playground-editor" aria-label={`${language} Bubble Sort starter template`} spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} />
        <form className="playground-run" onSubmit={runInput}><label htmlFor="playground-input">Input values</label><input id="playground-input" value={input} onChange={(event) => setInput(event.target.value)} /><button className="primary-button" type="submit">Run algorithm</button><button className="btn-secondary" type="button" onClick={runTests}>Run test cases</button></form>
        {error && <p className="error-message" role="alert">{error}</p>}
        {result && <section className="playground-output" aria-live="polite"><h2>Output</h2><pre>{JSON.stringify(result.output)}</pre><p>Comparisons: {result.comparisons} · Swaps: {result.swaps} · Steps: {result.steps.length}</p></section>}
        {testResults && <section className="playground-output"><h2>Test case results</h2><ul>{tests.map((test) => <li key={test.name}><strong>{test.passed ? "Passed" : "Failed"}</strong> · {test.name} · expected {JSON.stringify(test.expected)}, got {JSON.stringify(test.actual)}</li>)}</ul></section>}
      </section>
    </div>
  );
}
