import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Tags, Eye } from "lucide-react";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
} from "../../api/category.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Modal from "../../components/common/Modal.jsx";
import { tableWrapClass, thClass, tdClass, btnIcon } from "../../components/ui/uiClasses.js";

function Categories() {
  const user = useAuthStore(function (s) { return s.user; });
  const canEdit = canManageInventory(user);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi
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

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "" });
    setOpen(true);
  }

  function openEdit(cat) {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setOpen(true);
  }

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize products into categories"
        action={
          canEdit ? (
            <Button type="button" icon={Plus} onClick={openCreate}>
              Add Category
            </Button>
          ) : null
        }
      />

      {!categories.length ? (
        <EmptyState title="No categories yet" description="Create your first product category." icon={Tags} />
      ) : (
        <div className={tableWrapClass}>
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className={thClass}>Name</th>
                <th className={thClass}>Description</th>
                <th className={thClass}>View</th>
                {canEdit && <th className={thClass}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {categories.map(function (cat) {
                return (
                  <tr key={cat._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className={`${tdClass} font-medium text-slate-900`}>{cat.name}</td>
                    <td className={tdClass}>{cat.description || "—"}</td>
                    <td className={tdClass}>
                      <Link to={`/categories/${cat._id}`} className="inline-flex items-center gap-1 text-sm text-blue-600">
                        <Eye size={14} /> Details
                      </Link>
                    </td>
                    {canEdit && (
                      <td className={tdClass}>
                        <div className="flex gap-1">
                          <button type="button" className={btnIcon} onClick={function () { openEdit(cat); }} title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button type="button" className={`${btnIcon} hover:bg-red-50 hover:text-red-600`} onClick={function () { deleteMutation.mutate(cat._id); }} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
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
          <FormField label="Category name" name="name" icon={Tags} value={form.name} onChange={function (e) { setForm({ ...form, name: e.target.value }); }} placeholder="e.g. Beverages" required />
          <FormField label="Description" name="description" type="textarea" value={form.description} onChange={function (e) { setForm({ ...form, description: e.target.value }); }} placeholder="Optional description" />
          <Button type="submit" className="w-full">Save Category</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;
