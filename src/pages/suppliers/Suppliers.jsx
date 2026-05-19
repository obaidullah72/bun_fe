import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getSuppliersApi, createSupplierApi, updateSupplierApi, deleteSupplierApi } from "../../api/supplier.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Modal from "../../components/common/Modal.jsx";

const emptyForm = { name: "", contactPerson: "", email: "", phone: "", address: "", notes: "" };

function Suppliers() {
  const user = useAuthStore(function (s) { return s.user; });
  const canEdit = canManageInventory(user);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({ queryKey: ["suppliers"], queryFn: getSuppliersApi });
  const suppliers = data?.data?.data || [];

  const saveMutation = useMutation({
    mutationFn: function () { return editing ? updateSupplierApi(editing._id, form) : createSupplierApi(form); },
    onSuccess: function () {
      toast.success("Supplier saved");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setOpen(false); setEditing(null); setForm(emptyForm);
    },
    onError: function () { toast.error("Failed to save"); }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSupplierApi,
    onSuccess: function () { toast.success("Deleted"); queryClient.invalidateQueries({ queryKey: ["suppliers"] }); }
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Suppliers</h1>
        {canEdit && <button type="button" onClick={function () { setOpen(true); setEditing(null); setForm(emptyForm); }} className="rounded-xl bg-blue-600 px-4 py-2 text-white">Add Supplier</button>}
      </div>
      {!suppliers.length ? <div className="mt-6"><EmptyState /></div> : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Contact</th><th className="p-4 text-left">Phone</th>{canEdit && <th className="p-4">Actions</th>}</tr></thead>
            <tbody>{suppliers.map(function (s) {
              return (
                <tr key={s._id} className="border-t dark:border-slate-800">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4">{s.contactPerson}</td>
                  <td className="p-4">{s.phone}</td>
                  {canEdit && <td className="p-4 space-x-2">
                    <button type="button" className="text-blue-600" onClick={function () { setEditing(s); setForm({ name: s.name, contactPerson: s.contactPerson || "", email: s.email || "", phone: s.phone || "", address: s.address || "", notes: s.notes || "" }); setOpen(true); }}>Edit</button>
                    <button type="button" className="text-red-600" onClick={function () { deleteMutation.mutate(s._id); }}>Delete</button>
                  </td>}
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
      <Modal open={open} title={editing ? "Edit Supplier" : "Add Supplier"} onClose={function () { setOpen(false); }}>
        <form onSubmit={function (e) { e.preventDefault(); saveMutation.mutate(); }} className="space-y-3">
          {["name", "contactPerson", "email", "phone", "address", "notes"].map(function (field) {
            return <input key={field} required={field === "name"} value={form[field]} onChange={function (e) { setForm({ ...form, [field]: e.target.value }); }} placeholder={field} className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />;
          })}
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-2 text-white">Save</button>
        </form>
      </Modal>
    </div>
  );
}

export default Suppliers;
