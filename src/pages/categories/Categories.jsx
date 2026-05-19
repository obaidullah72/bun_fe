import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from "../../api/category.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Modal from "../../components/common/Modal.jsx";

function Categories() {
  const user = useAuthStore(function (s) { return s.user; });
  const canEdit = canManageInventory(user);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: function () { return getCategoriesApi(); }
  });

  const categories = data?.data?.data || [];

  const saveMutation = useMutation({
    mutationFn: function () {
      return editing ? updateCategoryApi(editing._id, form) : createCategoryApi(form);
    },
    onSuccess: function () {
      toast.success(editing ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      setEditing(null);
      setForm({ name: "", description: "" });
    },
    onError: function () { toast.error("Failed to save category"); }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: function () {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
        {canEdit && (
          <button type="button" onClick={function () { setOpen(true); setEditing(null); setForm({ name: "", description: "" }); }}
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Add Category</button>
        )}
      </div>
      {!categories.length ? <div className="mt-6"><EmptyState title="No categories" /></div> : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-4">Name</th><th className="p-4">Description</th>{canEdit && <th className="p-4">Actions</th>}</tr></thead>
            <tbody>
              {categories.map(function (cat) {
                return (
                  <tr key={cat._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-slate-500">{cat.description}</td>
                    {canEdit && (
                      <td className="p-4 space-x-2">
                        <button type="button" className="text-blue-600" onClick={function () { setEditing(cat); setForm({ name: cat.name, description: cat.description || "" }); setOpen(true); }}>Edit</button>
                        <button type="button" className="text-red-600" onClick={function () { deleteMutation.mutate(cat._id); }}>Delete</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={open} title={editing ? "Edit Category" : "Add Category"} onClose={function () { setOpen(false); }}>
        <form onSubmit={function (e) { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
          <input required value={form.name} onChange={function (e) { setForm({ ...form, name: e.target.value }); }} placeholder="Name" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <textarea value={form.description} onChange={function (e) { setForm({ ...form, description: e.target.value }); }} placeholder="Description" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-2 text-white">Save</button>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;
