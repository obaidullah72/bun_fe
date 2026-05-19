import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Warehouse, Eye, MapPin } from "lucide-react";
import { getShelvesApi, createShelfApi, updateShelfApi, deleteShelfApi } from "../../api/shelf.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Modal from "../../components/common/Modal.jsx";
import { cardClass, btnIcon } from "../../components/ui/uiClasses.js";

const emptyForm = { shelfName: "", shelfCode: "", zone: "", rackNumber: "", rowNumber: "", columnNumber: "", pointName: "", description: "" };

function Shelves() {
  const user = useAuthStore(function (s) { return s.user; });
  const canEdit = canManageInventory(user);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({ queryKey: ["shelves"], queryFn: getShelvesApi });
  const shelves = data?.data?.data || [];

  const saveMutation = useMutation({
    mutationFn: function () { return editing ? updateShelfApi(editing._id, form) : createShelfApi(form); },
    onSuccess: function () {
      toast.success("Shelf saved");
      queryClient.invalidateQueries({ queryKey: ["shelves"] });
      setOpen(false); setEditing(null); setForm(emptyForm);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShelfApi,
    onSuccess: function () { toast.success("Deleted"); queryClient.invalidateQueries({ queryKey: ["shelves"] }); }
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Shelves" subtitle="Warehouse shelf locations and zones" action={canEdit ? <Button type="button" icon={Plus} onClick={function () { setOpen(true); setEditing(null); setForm(emptyForm); }}>Add Shelf</Button> : null} />
      {!shelves.length ? <EmptyState title="No shelves" icon={Warehouse} /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shelves.map(function (shelf) {
            const location = [shelf.rackNumber, shelf.rowNumber, shelf.pointName].filter(Boolean).join(" · ");
            return (
              <div key={shelf._id} className={`${cardClass} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Warehouse size={18} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{shelf.shelfName}</h3>
                      <p className="text-sm text-slate-500">{shelf.shelfCode} · {shelf.zone || "No zone"}</p>
                      {location && <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin size={12} />{location}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Link to={`/shelves/${shelf._id}`} className={btnIcon} title="View"><Eye size={16} /></Link>
                    {canEdit && <>
                      <button type="button" className={btnIcon} onClick={function () { setEditing(shelf); setForm({ shelfName: shelf.shelfName, shelfCode: shelf.shelfCode, zone: shelf.zone || "", rackNumber: shelf.rackNumber || "", rowNumber: shelf.rowNumber || "", columnNumber: shelf.columnNumber || "", pointName: shelf.pointName || "", description: shelf.description || "" }); setOpen(true); }}><Pencil size={16} /></button>
                      <button type="button" className={`${btnIcon} hover:bg-red-50 hover:text-red-600`} onClick={function () { deleteMutation.mutate(shelf._id); }}><Trash2 size={16} /></button>
                    </>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal open={open} title={editing ? "Edit Shelf" : "Add Shelf"} onClose={function () { setOpen(false); }} size="lg">
        <form onSubmit={function (e) { e.preventDefault(); saveMutation.mutate(); }} className="grid gap-4 sm:grid-cols-2">
          <FormField label="Shelf name" name="shelfName" icon="shelf" value={form.shelfName} onChange={function (e) { setForm({ ...form, shelfName: e.target.value }); }} required />
          <FormField label="Shelf code" name="sku" value={form.shelfCode} onChange={function (e) { setForm({ ...form, shelfCode: e.target.value }); }} required />
          <FormField label="Zone" name="text" value={form.zone} onChange={function (e) { setForm({ ...form, zone: e.target.value }); }} placeholder="e.g. Front, Back" />
          <FormField label="Rack number" name="text" value={form.rackNumber} onChange={function (e) { setForm({ ...form, rackNumber: e.target.value }); }} />
          <FormField label="Row number" name="text" value={form.rowNumber} onChange={function (e) { setForm({ ...form, rowNumber: e.target.value }); }} />
          <FormField label="Point name" name="text" value={form.pointName} onChange={function (e) { setForm({ ...form, pointName: e.target.value }); }} />
          <FormField label="Description" name="description" type="textarea" value={form.description} onChange={function (e) { setForm({ ...form, description: e.target.value }); }} className="sm:col-span-2" />
          <Button type="submit" className="sm:col-span-2 w-full">Save Shelf</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Shelves;
