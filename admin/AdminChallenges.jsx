import { useState } from "react";

import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../hooks/useToast";
import { extractErrorMessage } from "../../services/api";
import { createChallenge, deleteChallenge, getChallenge, listChallenges, updateChallenge } from "../../services/challenges";

const EMPTY_FORM = {
  title: "", slug: "", category: "SORTING", difficulty: "EASY", description: "",
  valuesInput: "5, 3, 8, 1", target: "", allowedInput: "bubble-sort, merge-sort",
  points: 100, time_limit_seconds: 60,
};

export default function AdminChallenges() {
  const { data, loading, error, refetch } = useFetch(() => listChallenges(), []);
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loadingEditSlug, setLoadingEditSlug] = useState(null);

  const challenges = data?.results || data || [];

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
    setModalOpen(true);
  }

  async function openEdit(challengeSummary) {
    // The list endpoint returns a lighter shape without input_data/target/
    // allowed_algorithms, so fetch the full record before populating the form.
    setLoadingEditSlug(challengeSummary.slug);
    try {
      const challenge = await getChallenge(challengeSummary.slug);
      setForm({
        title: challenge.title, slug: challenge.slug, category: challenge.category,
        difficulty: challenge.difficulty, description: challenge.description,
        valuesInput: (challenge.input_data.values || []).join(", "),
        target: challenge.target ?? "",
        allowedInput: challenge.allowed_algorithms.join(", "),
        points: challenge.points, time_limit_seconds: challenge.time_limit_seconds,
      });
      setEditingSlug(challenge.slug);
      setModalOpen(true);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoadingEditSlug(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      title: form.title, slug: form.slug, category: form.category, difficulty: form.difficulty,
      description: form.description,
      input_data: { values: form.valuesInput.split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !Number.isNaN(v)) },
      target: form.target === "" ? null : Number(form.target),
      allowed_algorithms: form.allowedInput.split(",").map((s) => s.trim()).filter(Boolean),
      points: Number(form.points), time_limit_seconds: Number(form.time_limit_seconds),
    };
    try {
      if (editingSlug) {
        await updateChallenge(editingSlug, payload);
        toast.success("Challenge updated.");
      } else {
        await createChallenge(payload);
        toast.success("Challenge created.");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteChallenge(deleteTarget.slug);
      toast.success("Challenge deleted.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading challenges..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Manage Challenges</h1>
        <Button onClick={openCreate}>+ New Challenge</Button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {challenges.map((c) => (
              <tr key={c.slug}>
                <td className="px-4 py-3 font-medium text-ink-800">{c.title}</td>
                <td className="px-4 py-3">{c.category}</td>
                <td className="px-4 py-3">{c.difficulty}</td>
                <td className="px-4 py-3">{c.points}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="btn-ghost" onClick={() => openEdit(c)} disabled={loadingEditSlug === c.slug}>
                    {loadingEditSlug === c.slug ? "Loading..." : "Edit"}
                  </button>
                  <button className="btn-ghost text-rose-600" onClick={() => setDeleteTarget(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlug ? "Edit Challenge" : "New Challenge"}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} disabled={!!editingSlug} />
          <div className="flex gap-2">
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="SORTING">Sorting</option>
              <option value="SEARCHING">Searching</option>
              <option value="GRAPH">Graph</option>
            </select>
            <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="input" placeholder="Values, comma-separated (e.g. 5, 3, 8, 1)" value={form.valuesInput} onChange={(e) => setForm({ ...form, valuesInput: e.target.value })} />
          {form.category === "SEARCHING" && (
            <input className="input" placeholder="Target value" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
          )}
          <input className="input" placeholder="Allowed algorithms, comma-separated (slugs)" value={form.allowedInput} onChange={(e) => setForm({ ...form, allowedInput: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" className="input" placeholder="Points" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
            <input type="number" className="input" placeholder="Time limit (s)" value={form.time_limit_seconds} onChange={(e) => setForm({ ...form, time_limit_seconds: e.target.value })} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete challenge?"
        description={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
      />
    </div>
  );
}
