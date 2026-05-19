import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { scanProductApi } from "../../api/product.api.js";
import { createSaleApi } from "../../api/pos.api.js";

function POS() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [cart, setCart] = useState([]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  function addToCart(product) {
    setCart(function (current) {
      const existing = current.find(function (item) { return item._id === product._id; });
      if (existing) {
        return current.map(function (item) {
          return item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item;
        });
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  async function handleScan(e) {
    e.preventDefault();
    if (!code) return;
    try {
      const res = await scanProductApi(code);
      addToCart(res.data.data);
      setCode("");
      toast.success("Added to cart");
    } catch {
      toast.error("Product not found");
    }
  }

  function updateQty(id, qty) {
    if (qty < 1) return;
    setCart(function (c) { return c.map(function (i) { return i._id === id ? { ...i, quantity: qty } : i; }); });
  }

  function removeItem(id) {
    setCart(function (c) { return c.filter(function (i) { return i._id !== id; }); });
  }

  const subtotal = cart.reduce(function (s, i) { return s + i.sellingPrice * i.quantity; }, 0);
  const total = subtotal + Number(tax) - Number(discount);
  const change = Math.max(0, Number(paidAmount) - total);

  async function completeSale() {
    if (!cart.length) return toast.error("Cart is empty");
    if (Number(paidAmount) < total) return toast.error("Paid amount is insufficient");
    setLoading(true);
    try {
      const res = await createSaleApi({
        items: cart.map(function (i) {
          return { product: i._id, quantity: i.quantity, unitPrice: i.sellingPrice, discount: 0 };
        }),
        tax: Number(tax),
        discount: Number(discount),
        paymentMethod,
        paidAmount: Number(paidAmount),
        customerName,
        customerPhone
      });
      toast.success("Sale completed!");
      navigate(`/pos/receipt/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Sale failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Point of Sale</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <form onSubmit={handleScan} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <input value={code} onChange={function (e) { setCode(e.target.value); }} placeholder="Scan SKU, barcode, or QR" className="flex-1 rounded-xl border px-4 py-3 dark:bg-slate-800" autoFocus />
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold">Add</button>
          </form>
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <h2 className="font-semibold mb-3">Cart Items</h2>
            {cart.map(function (item) {
              return (
                <div key={item._id} className="flex items-center justify-between border-b py-3 dark:border-slate-800">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.sku} · {item.sellingPrice} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={function () { updateQty(item._id, item.quantity - 1); }} className="rounded border px-2">-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={function () { updateQty(item._id, item.quantity + 1); }} className="rounded border px-2">+</button>
                    <button type="button" onClick={function () { removeItem(item._id); }} className="ml-2 text-red-600">Remove</button>
                  </div>
                </div>
              );
            })}
            {!cart.length && <p className="text-slate-500 text-sm">Cart is empty</p>}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 space-y-3">
          <input value={customerName} onChange={function (e) { setCustomerName(e.target.value); }} placeholder="Customer name (optional)" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <input value={customerPhone} onChange={function (e) { setCustomerPhone(e.target.value); }} placeholder="Customer phone (optional)" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <select value={paymentMethod} onChange={function (e) { setPaymentMethod(e.target.value); }} className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800">
            {["Cash", "Card", "Bank Transfer", "Mobile Wallet"].map(function (m) { return <option key={m}>{m}</option>; })}
          </select>
          <input type="number" value={tax} onChange={function (e) { setTax(e.target.value); }} placeholder="Tax" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <input type="number" value={discount} onChange={function (e) { setDiscount(e.target.value); }} placeholder="Discount" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <input type="number" value={paidAmount} onChange={function (e) { setPaidAmount(e.target.value); }} placeholder="Paid amount" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
          <div className="space-y-1 text-sm border-t pt-3 dark:border-slate-700">
            <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{total.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-600"><span>Change</span><span>{change.toFixed(2)}</span></div>
          </div>
          <button type="button" disabled={loading} onClick={completeSale} className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default POS;
