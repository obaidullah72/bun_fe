import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAdjustmentsApi, createAdjustmentApi } from "../../api/inventory.api.js";
import { getProductsApi } from "../../api/product.api.js";
import Loader from "../../components/common/Loader.jsx";
import Modal from "../../components/common/Modal.jsx";

function Adjustments() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product: "", type: "increase", quantity: 1, reason: "" });
  const { data, isLoading } = useQuery({ queryKey: ["adjustments"], queryFn: getAdjustmentsApi });
  const productsQuery = useQuery({ queryKey: ["products-all"], queryFn: function () { return getProductsApi({ limit: 100 }); } });
  const adjustments = data?.data?.data || [];
  const products = productsQuery.data?.data?.data || [];

  const mutation = useMutation({
    mutationFn: createAdjustmentApi,
    onSuccess: function () { toast.success("Adjustment saved"); queryClient.invalidateQueries({ queryKey: ["adjustments"] }); setOpen(false); }
  });

  if (isLoading) return <Loader />;
  return (
    <div>
      <div className="flex justify-between"><h1 className="text-2xl font-bold dark:text-white">Inventory Adjustments</h1>
        <button type="button" onClick={function () { setOpen(true); }} className="rounded-xl bg-blue-600 px-4 py-2 text-white">New Adjustment</button></div>
      <div className="mt-6 rounded-2xl bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-4 text-left">Product</th><th className="p-4 text-left">Type</th><th className="p-4 text-left">Qty</th><th className="p-4 text-left">Before</th><th className="p-4 text-left">After</th></tr></thead>
        <tbody>{adjustments.map(function (a) {
          return <tr key={a._id} className="border-t dark:border-slate-800"><td className="p-4">{a.product?.name}</td><td className="p-4">{a.type}</td><td className="p-4">{a.quantity}</td><td className="p-4">{a.previousStock}</td><td className="p-4">{a.newStock}</td></tr>;
        })}</tbody></table>
      </div>
      <Modal open={open} title="New Adjustment" onClose={function () { setOpen(false); }}>
        <form onSubmit={function (e) { e.preventDefault(); mutation.mutate(form); }} className="space-y-3">
          <select required value={form.product} onChange={function (e) { setForm({ ...form, product: e.target.value }); }} className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800">
            <option value="">Select product</option>
            {products.map(function (p) { return <option key={p._id} value={p._id}>{p.name}</option>; })}
          </select>
          <select value={form.type} onChange={function (e) { setForm({ ...form, type: e.target.value }); }} className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800">
            {["increase", "decrease", "correction", "damage", "lost", "expired", "return"].map(function (t) { return <option key={t}>{t}</option>; })}
          </select>
          <input type="number" required value={form.quantity} onChange={function (e) { setForm({ ...form, quantity: Number(e.target.value) }); }} className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <input value={form.reason} onChange={function (e) { setForm({ ...form, reason: e.target.value }); }} placeholder="Reason" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-2 text-white">Save</button>
        </form>
      </Modal>
    </div>
  );
}
export default Adjustments;
