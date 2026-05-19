import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClipboardList, PackageCheck } from "lucide-react";
import { getPurchaseOrdersApi, receivePurchaseOrderApi } from "../../api/purchaseOrder.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { cardClass } from "../../components/ui/uiClasses.js";

function PurchaseOrders() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["purchase-orders"], queryFn: getPurchaseOrdersApi });
  const orders = data?.data?.data || [];

  const receiveMutation = useMutation({
    mutationFn: receivePurchaseOrderApi,
    onSuccess: function () { toast.success("Order received"); queryClient.invalidateQueries({ queryKey: ["purchase-orders"] }); }
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Purchase Orders" subtitle="Receive stock from suppliers" />
      {!orders.length ? <EmptyState title="No purchase orders" icon={ClipboardList} /> : (
        <div className="space-y-4">
          {orders.map(function (o) {
            return (
              <div key={o._id} className={`${cardClass} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><ClipboardList size={20} /></span>
                  <div>
                    <p className="font-semibold text-slate-900">{o.supplier?.name}</p>
                    <p className="text-sm text-slate-500">{o.items?.length} items · Total: {o.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${o.status === "received" ? "bg-emerald-50 text-emerald-700" : o.status === "ordered" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{o.status}</span>
                  {o.status !== "received" && o.status !== "cancelled" && (
                    <Button type="button" variant="secondary" icon={PackageCheck} onClick={function () { receiveMutation.mutate(o._id); }}>Receive</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default PurchaseOrders;
