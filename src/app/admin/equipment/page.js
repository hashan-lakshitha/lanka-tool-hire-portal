'use client';

import { useState, useEffect, useCallback } from 'react';

const emptyForm = {
  categoryId: '', name: '', description: '', imageUrl: '',
  hourlyRate: '', dailyRate: '', weeklyRate: '', totalQuantity: 5,
};

export default function EquipmentPage() {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTool, setNewTool] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file, onDone) {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        onDone(data.url);
      } else {
        alert(data.error);
      }
    } finally {
      setUploading(false);
    }
  }

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [toolsRes, catRes] = await Promise.all([
      fetch('/api/admin/tools'),
      fetch('/api/admin/categories'),
    ]);
    setTools(await toolsRes.json());
    setCategories(await catRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, [fetchAll]);

  async function createTool(e) {
    e.preventDefault();
    await fetch('/api/admin/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTool),
    });
    setNewTool(emptyForm);
    setShowAddForm(false);
    fetchAll();
  }

  function startEdit(tool) {
    setEditingId(tool.id);
    setEditForm({
      name: tool.name,
      description: tool.description,
      imageUrl: tool.imageUrl || '',
      hourlyRate: tool.hourlyRate,
      dailyRate: tool.dailyRate,
      weeklyRate: tool.weeklyRate,
    });
  }

  async function saveEdit(id) {
    await fetch(`/api/admin/tools/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchAll();
  }

  async function toggleStatus(tool) {
    await fetch(`/api/admin/tools/${tool.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: tool.status === 'active' ? 'inactive' : 'active' }),
    });
    fetchAll();
  }

  async function deleteTool(tool) {
    const confirmed = window.confirm(
      `Permanently delete "${tool.name}"? This cannot be undone. If it has reviews or saved quotes, this will be blocked — deactivate it instead.`
    );
    if (!confirmed) return;

    const res = await fetch(`/api/admin/tools/${tool.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
      return;
    }
    fetchAll();
  }

  const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#34495e] tracking-tight">Equipment</h1>
          <p className="mt-1 text-sm text-gray-500">Add, edit, or manage your tool inventory.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`rounded-md px-4 py-2 text-sm font-semibold shadow transition-colors ${
            showAddForm
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-[#3498db] text-white hover:bg-[#2980b9]'
          }`}
        >
          {showAddForm ? 'Cancel' : '+ Add Equipment'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={createTool} className="mb-6 rounded-lg bg-white p-6 shadow-md border border-gray-200">
          <h2 className="text-lg font-bold text-[#34495e] mb-4">New Equipment</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                required
                value={newTool.categoryId}
                onChange={(e) => setNewTool({ ...newTool, categoryId: e.target.value })}
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tool Name</label>
              <input
                required
                placeholder="e.g. Concrete Mixer 140L"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              required
              placeholder="Describe the tool..."
              value={newTool.description}
              onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
              className={inputClass}
              rows={2}
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Image URL (or upload)</label>
            <input
              placeholder="https://..."
              value={newTool.imageUrl}
              onChange={(e) => setNewTool({ ...newTool, imageUrl: e.target.value })}
              className={`${inputClass} mb-2`}
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => uploadImage(e.target.files[0], (url) => setNewTool((prev) => ({ ...prev, imageUrl: url })))}
              className="block text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#3498db] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2980b9]"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading…</p>}
            {newTool.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={newTool.imageUrl} alt="Preview" className="mt-2 h-20 rounded shadow-sm" />
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <RateInput label="Hourly Rate (LKR)" value={newTool.hourlyRate} onChange={(v) => setNewTool({ ...newTool, hourlyRate: v })} />
            <RateInput label="Daily Rate (LKR)" value={newTool.dailyRate} onChange={(v) => setNewTool({ ...newTool, dailyRate: v })} />
            <RateInput label="Weekly Rate (LKR)" value={newTool.weeklyRate} onChange={(v) => setNewTool({ ...newTool, weeklyRate: v })} />
            <RateInput label="Total Stock Quantity" value={newTool.totalQuantity} onChange={(v) => setNewTool({ ...newTool, totalQuantity: v })} />
          </div>

          <button type="submit" className="rounded-md bg-[#3498db] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#2980b9]">
            Create Tool
          </button>
        </form>
      )}

      {/* Tools List */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading equipment...</div>
      ) : tools.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-200">
          No equipment found. Click &quot;+ Add Equipment&quot; to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {tools.map((tool) => (
            <div key={tool.id} className="rounded-lg bg-white p-5 shadow-sm border border-gray-200">
              {editingId === tool.id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={`${inputClass} font-bold`}
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={inputClass}
                    rows={2}
                  />
                  <input
                    placeholder="Image URL"
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => uploadImage(e.target.files[0], (url) => setEditForm((prev) => ({ ...prev, imageUrl: url })))}
                    className="block text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#3498db] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                  />
                  {uploading && <p className="text-xs text-gray-500">Uploading…</p>}
                  {editForm.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={editForm.imageUrl} alt="Preview" className="h-20 rounded shadow-sm" />
                  )}
                  <div className="grid grid-cols-4 gap-4">
                    <RateInput label="Hourly (LKR)" value={editForm.hourlyRate} onChange={(v) => setEditForm({ ...editForm, hourlyRate: v })} />
                    <RateInput label="Daily (LKR)" value={editForm.dailyRate} onChange={(v) => setEditForm({ ...editForm, dailyRate: v })} />
                    <RateInput label="Weekly (LKR)" value={editForm.weeklyRate} onChange={(v) => setEditForm({ ...editForm, weeklyRate: v })} />
                    <RateInput label="Total Stock" value={editForm.totalQuantity} onChange={(v) => setEditForm({ ...editForm, totalQuantity: v })} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => saveEdit(tool.id)} className="rounded-md bg-[#3498db] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2980b9]">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="rounded-md bg-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#34495e]">{tool.name}</h3>
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded font-semibold">
                          Stock: {tool.totalQuantity ?? 5} units
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {tool.category?.name} · LKR {Number(tool.hourlyRate).toFixed(2)}/hr · LKR {Number(tool.dailyRate).toFixed(2)}/day · LKR {Number(tool.weeklyRate).toFixed(2)}/wk
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      tool.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => startEdit(tool)} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">
                      Edit
                    </button>
                    <button onClick={() => toggleStatus(tool)} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">
                      {tool.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    </button>
                    <button onClick={() => deleteTool(tool)} className="rounded-md bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RateInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="number"
        step="0.01"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
      />
    </div>
  );
}