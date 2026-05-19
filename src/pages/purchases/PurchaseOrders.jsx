import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getPurchaseOrdersApi, receivePurchaseOrderApi } from "../../api/purchaseOrder.api.js";
import Loader from "../../components/common/Loader.jsx";

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
      <h1 className="text-2xl font-bold dark:text-white">Purchase Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.map(function (o) {
          return (
            <div key={o._id} className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{o.supplier?.name}</p>
                  <p className="text-sm text-slate-500">{o.items?.length} items · Total: {o.total}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">{o.status}</span>
                  {o.status !== "received" && o.status !== "cancelled" && (
                    <button type="button" onClick={function () { receiveMutation.mutate(o._id); }} className="rounded-xl bg-green-600 px-3 py-1 text-sm text-white">Receive</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default PurchaseOrders;
