import { useState } from "react";
import toast from "react-hot-toast";
import { scanProductApi } from "../../api/product.api.js";

function POS() {
  const [code, setCode] = useState("");
  const [cart, setCart] = useState([]);

  async function handleScan(event) {
    event.preventDefault();

    try {
      const response = await scanProductApi(code);
      const product = response.data.data;

      setCart((current) => {
        const existing = current.find((item) => item._id === product._id);

        if (existing) {
          return current.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...current, { ...product, quantity: 1 }];
      });

      setCode("");
      toast.success("Product added to cart");
    } catch (error) {
      toast.error("Product not found");
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">POS</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-slate-900">Search / Scan Product</h2>

          <form onSubmit={handleScan} className="mt-4 flex gap-3">
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter SKU, barcode, or QR code"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3"
            />

            <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
              Add
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Cart</h2>

          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    {item.quantity} x {item.sellingPrice}
                  </p>
                </div>

                <p className="font-semibold">
                  {item.quantity * item.sellingPrice}
                </p>
              </div>
            ))}

            {!cart.length && (
              <p className="text-sm text-slate-500">Cart is empty</p>
            )}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{total}</span>
            </div>

            <button className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white">
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default POS;