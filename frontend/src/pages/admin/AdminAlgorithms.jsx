import { useState } from "react";

import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../hooks/useToast";
import {
  createAlgorithm, deleteAlgorithm, listAlgorithms, updateAlgorithm,
} from "../../services/algorithms";
import { extractErrorMessage } from "../../services/api";

const EMPTY_FORM = {
  name: "", slug: "", category: "SORTING", difficulty: "EASY", description: "",
  best_case: "", average_case: "", worst_case: "", space_complexity: "",
};

export default function AdminAlgorithms() {
  const { data, loading, error, refetch } = useFetch(() => listAlgorithms(), []);
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const algorithms = data?.results || data || [];

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
    setModalOpen(true);
  }

  function openEdit(algo) {
    setForm({ ...algo });
    setEditingSlug(algo.slug);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editingSlug) {
        await updateAlgorithm(editingSlug, form);
        toast.success("Algorithm updated.");
      } else {
        await createAlgorithm(form);
        toast.success("Algorithm created.");
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
      await deleteAlgorithm(deleteTarget.slug);
      toast.success("Algorithm deleted.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading algorithms..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Manage Algorithms</h1>
        <Button onClick={openCreate}>+ New Algorithm</Button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {algorithms.map((a) => (
              <tr key={a.slug}>
                <td className="px-4 py-3 font-medium text-ink-800">{a.name}</td>
                <td className="px-4 py-3">{a.category}</td>
                <td className="px-4 py-3">{a.difficulty}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="btn-ghost" onClick={() => openEdit(a)}>Edit</button>
                  <button className="btn-ghost text-rose-600" onClick={() => setDeleteTarget(a)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlug ? "Edit Algorithm" : "New Algorithm"}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="Best case (e.g. O(n))" value={form.best_case} onChange={(e) => setForm({ ...form, best_case: e.target.value })} />
            <input className="input" placeholder="Average case" value={form.average_case} onChange={(e) => setForm({ ...form, average_case: e.target.value })} />
            <input className="input" placeholder="Worst case" value={form.worst_case} onChange={(e) => setForm({ ...form, worst_case: e.target.value })} />
            <input className="input" placeholder="Space complexity" value={form.space_complexity} onChange={(e) => setForm({ ...form, space_complexity: e.target.value })} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete algorithm?"
        description={`"${deleteTarget?.name}" will be permanently removed. This can't be undone.`}
      />
    </div>
  );
}
