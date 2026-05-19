import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getShelvesApi, createShelfApi, updateShelfApi, deleteShelfApi } from "../../api/shelf.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Modal from "../../components/common/Modal.jsx";

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Shelves</h1>
        {canEdit && <button type="button" onClick={function () { setOpen(true); setEditing(null); setForm(emptyForm); }} className="rounded-xl bg-blue-600 px-4 py-2 text-white">Add Shelf</button>}
      </div>
      {!shelves.length ? <div className="mt-6"><EmptyState /></div> : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {shelves.map(function (shelf) {
            const location = [shelf.rackNumber, shelf.rowNumber, shelf.pointName].filter(Boolean).join(" - ");
            return (
              <div key={shelf._id} className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{shelf.shelfName}</h3>
                    <p className="text-sm text-slate-500">{shelf.shelfCode} · {shelf.zone}</p>
                    <p className="mt-1 text-sm">{location}</p>
                  </div>
                  <div className="space-x-2 text-sm">
                    <Link to={`/shelves/${shelf._id}`} className="text-blue-600">View</Link>
                    {canEdit && <>
                      <button type="button" className="text-blue-600" onClick={function () { setEditing(shelf); setForm({ shelfName: shelf.shelfName, shelfCode: shelf.shelfCode, zone: shelf.zone || "", rackNumber: shelf.rackNumber || "", rowNumber: shelf.rowNumber || "", columnNumber: shelf.columnNumber || "", pointName: shelf.pointName || "", description: shelf.description || "" }); setOpen(true); }}>Edit</button>
                      <button type="button" className="text-red-600" onClick={function () { deleteMutation.mutate(shelf._id); }}>Delete</button>
                    </>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal open={open} title={editing ? "Edit Shelf" : "Add Shelf"} onClose={function () { setOpen(false); }}>
        <form onSubmit={function (e) { e.preventDefault(); saveMutation.mutate(); }} className="grid gap-3 md:grid-cols-2">
          {Object.keys(emptyForm).map(function (field) {
            return <input key={field} required={field === "shelfName" || field === "shelfCode"} value={form[field]} onChange={function (e) { setForm({ ...form, [field]: e.target.value }); }} placeholder={field} className="rounded-xl border px-4 py-2 dark:bg-slate-800" />;
          })}
          <button type="submit" className="md:col-span-2 rounded-xl bg-blue-600 py-2 text-white">Save</button>
        </form>
      </Modal>
    </div>
  );
}

export default Shelves;
