import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Plus, ArrowLeftRight, Eye } from "lucide-react";
import { getAdjustmentsApi, createAdjustmentApi } from "../../api/inventory.api.js";
import { getProductsApi } from "../../api/product.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import Modal from "../../components/common/Modal.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";

function Adjustments() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product: "", type: "increase", quantity: 1, reason: "" });
  const { data, isLoading } = useQuery({ queryKey: ["adjustments"], queryFn: getAdjustmentsApi });
  const productsQuery = useQuery({ queryKey: ["products-all"], queryFn: function () { return getProductsApi({ limit: 100 }); } });
  const adjustments = data?.data?.data || [];
  const productOptions = [{ value: "", label: "Select product" }].concat(
    (productsQuery.data?.data?.data || []).map(function (p) { return { value: p._id, label: p.name }; })
  );

  const mutation = useMutation({
    mutationFn: createAdjustmentApi,
    onSuccess: function () { toast.success("Adjustment saved"); queryClient.invalidateQueries({ queryKey: ["adjustments"] }); setOpen(false); }
  });

  if (isLoading) return <Loader />;
  return (
    <div>
      <PageHeader title="Inventory Adjustments" subtitle="Increase, decrease, or correct stock levels" action={<Button type="button" icon={Plus} onClick={function () { setOpen(true); }}>New Adjustment</Button>} />
      <div className={tableWrapClass}>
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50"><tr><th className={thClass}>Product</th><th className={thClass}>Type</th><th className={thClass}>Qty</th><th className={thClass}>Before</th><th className={thClass}>After</th><th className={thClass}>Action</th></tr></thead>
          <tbody>{adjustments.map(function (a) {
            return (
              <tr key={a._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className={tdClass}>{a.product?.name}</td>
                <td className={tdClass}><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize">{a.type}</span></td>
                <td className={tdClass}>{a.quantity}</td>
                <td className={tdClass}>{a.previousStock}</td>
                <td className={tdClass}>{a.newStock}</td>
                <td className={tdClass}>
                  <Link to={`/inventory/adjustments/${a._id}`} className="inline-flex items-center gap-1 text-sm text-blue-600"><Eye size={14} /> View</Link>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      <Modal open={open} title="New Adjustment" onClose={function () { setOpen(false); }}>
        <form onSubmit={function (e) { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
          <FormField label="Product" name="product" type="select" icon="product" value={form.product} onChange={function (e) { setForm({ ...form, product: e.target.value }); }} options={productOptions} required />
          <FormField label="Adjustment type" name="type" type="select" icon={ArrowLeftRight} value={form.type} onChange={function (e) { setForm({ ...form, type: e.target.value }); }} options={["increase", "decrease", "correction", "damage", "lost", "expired", "return"]} />
          <FormField label="Quantity" name="quantity" type="number" icon="quantity" value={form.quantity} onChange={function (e) { setForm({ ...form, quantity: Number(e.target.value) }); }} required />
          <FormField label="Reason" name="reason" type="textarea" value={form.reason} onChange={function (e) { setForm({ ...form, reason: e.target.value }); }} />
          <Button type="submit" className="w-full">Save Adjustment</Button>
        </form>
      </Modal>
    </div>
  );
}
export default Adjustments;
