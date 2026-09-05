'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/categories');
    setCategories(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function createCategory(e) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setNewName('');
    fetchCategories();
  }

  async function saveRename(id) {
    setError(null);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setEditingId(null);
    fetchCategories();
  }

  async function deleteCategory(id, name) {
    const confirmed = window.confirm(`Delete category "${name}"? Tools in this category will become uncategorised.`);
    if (!confirmed) return;
    setError(null);
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    fetchCategories();
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#34495e] tracking-tight">Categories</h1>
        <p className="mt-1 text-sm text-gray-500">Organise your equipment into browsable categories.</p>
      </div>

      {/* Add Form */}
      <form onSubmit={createCategory} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="New category name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-[#3498db] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2980b9] transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-md bg-rose-50 p-3 border border-rose-200">
          <p className="text-sm text-rose-700 font-medium">{error}</p>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-200">
          No categories yet. Add one above to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-lg bg-white px-5 py-3.5 shadow-sm border border-gray-200"
            >
              {editingId === cat.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm mr-3 focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]"
                />
              ) : (
                <div>
                  <span className="text-sm font-medium text-[#34495e]">{cat.name}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    ({cat.toolCount} tool{cat.toolCount === 1 ? '' : 's'})
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {editingId === cat.id ? (
                  <>
                    <button
                      onClick={() => saveRename(cat.id)}
                      className="rounded-md bg-[#3498db] p-1.5 text-white hover:bg-[#2980b9]"
                      title="Save"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-md bg-gray-200 p-1.5 text-gray-600 hover:bg-gray-300"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                      className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
                      title="Rename"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id, cat.name)}
                      className="rounded-md bg-rose-50 p-1.5 text-rose-500 hover:bg-rose-100"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}