import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Truck } from "lucide-react";
import {
  getSuppliersApi,
  createSupplierApi,
  updateSupplierApi,
  deleteSupplierApi
} from "../../api/supplier.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Modal from "../../components/common/Modal.jsx";
import { tableWrapClass, thClass, tdClass, btnIcon } from "../../components/ui/uiClasses.js";

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
      <PageHeader title="Suppliers" subtitle="Manage product suppliers and contacts" action={canEdit ? <Button type="button" icon={Plus} onClick={function () { setOpen(true); setEditing(null); setForm(emptyForm); }}>Add Supplier</Button> : null} />
      {!suppliers.length ? <EmptyState title="No suppliers" icon={Truck} /> : (
        <div className={tableWrapClass}>
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50"><tr><th className={thClass}>Name</th><th className={thClass}>Contact</th><th className={thClass}>Phone</th><th className={thClass}>Email</th>{canEdit && <th className={thClass}>Actions</th>}</tr></thead>
            <tbody>{suppliers.map(function (s) {
              return (
                <tr key={s._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className={`${tdClass} font-medium text-slate-900`}>{s.name}</td>
                  <td className={tdClass}>{s.contactPerson || "—"}</td>
                  <td className={tdClass}>{s.phone || "—"}</td>
                  <td className={tdClass}>{s.email || "—"}</td>
                  {canEdit && <td className={tdClass}><div className="flex gap-1">
                    <button type="button" className={btnIcon} onClick={function () { setEditing(s); setForm({ name: s.name, contactPerson: s.contactPerson || "", email: s.email || "", phone: s.phone || "", address: s.address || "", notes: s.notes || "" }); setOpen(true); }}><Pencil size={16} /></button>
                    <button type="button" className={`${btnIcon} hover:bg-red-50 hover:text-red-600`} onClick={function () { deleteMutation.mutate(s._id); }}><Trash2 size={16} /></button>
                  </div></td>}
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
      <Modal open={open} title={editing ? "Edit Supplier" : "Add Supplier"} onClose={function () { setOpen(false); }} size="lg">
        <form onSubmit={function (e) { e.preventDefault(); saveMutation.mutate(); }} className="grid gap-4 sm:grid-cols-2">
          <FormField label="Company name" name="name" icon={Truck} value={form.name} onChange={function (e) { setForm({ ...form, name: e.target.value }); }} required />
          <FormField label="Contact person" name="contactPerson" value={form.contactPerson} onChange={function (e) { setForm({ ...form, contactPerson: e.target.value }); }} />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={function (e) { setForm({ ...form, email: e.target.value }); }} />
          <FormField label="Phone" name="phone" value={form.phone} onChange={function (e) { setForm({ ...form, phone: e.target.value }); }} />
          <FormField label="Address" name="address" value={form.address} onChange={function (e) { setForm({ ...form, address: e.target.value }); }} className="sm:col-span-2" />
          <FormField label="Notes" name="notes" type="textarea" value={form.notes} onChange={function (e) { setForm({ ...form, notes: e.target.value }); }} className="sm:col-span-2" />
          <Button type="submit" className="sm:col-span-2 w-full">Save Supplier</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Suppliers;
