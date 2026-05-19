import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShoppingCart, ScanLine, User, Phone, CreditCard, Percent, DollarSign,
  Minus, Plus, Trash2, Receipt
} from "lucide-react";
import { scanProductApi } from "../../api/product.api.js";
import { createSaleApi } from "../../api/pos.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import { cardClass, inputClass, btnIcon } from "../../components/ui/uiClasses.js";

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

  function addToCart(product, qty = 1) {
    if (product.stockQuantity === 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    const existing = cart.find(function (item) { return item._id === product._id; });
    const newQty = (existing?.quantity || 0) + qty;
    if (newQty > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} in stock for ${product.name}`);
      return;
    }
    if (product.stockQuantity <= product.minStockLevel) {
      toast(`Low stock: ${product.name} (${product.stockQuantity} left)`, { icon: "⚠️" });
    }
    setCart(function (current) {
      const found = current.find(function (item) { return item._id === product._id; });
      if (found) {
        return current.map(function (item) {
          return item._id === product._id ? { ...item, quantity: item.quantity + qty } : item;
        });
      }
      return [...current, { ...product, quantity: qty }];
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
    const item = cart.find(function (i) { return i._id === id; });
    if (item && qty > item.stockQuantity) {
      toast.error(`Only ${item.stockQuantity} in stock`);
      return;
    }
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
    const overStock = cart.find(function (i) { return i.quantity > i.stockQuantity; });
    if (overStock) {
      return toast.error(`Insufficient stock for ${overStock.name}`);
    }
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
      <PageHeader title="Point of Sale" subtitle="Scan products and complete checkout" />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <form onSubmit={handleScan} className={`${cardClass} flex gap-3 p-4`}>
            <div className="relative flex-1">
              <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={code} onChange={function (e) { setCode(e.target.value); }} placeholder="Scan SKU, barcode, or QR" className={`${inputClass} pl-10`} autoFocus />
            </div>
            <Button type="submit" icon={Plus}>Add</Button>
          </form>

          <div className={`${cardClass} p-4`}>
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
              <ShoppingCart size={18} className="text-blue-600" /> Cart Items
            </h2>
            {cart.map(function (item) {
              return (
                <div key={item._id} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.sku} · {item.sellingPrice} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={function () { updateQty(item._id, item.quantity - 1); }} className={btnIcon}><Minus size={16} /></button>
                    <span className="min-w-[2rem] text-center font-medium">{item.quantity}</span>
                    <button type="button" onClick={function () { updateQty(item._id, item.quantity + 1); }} className={btnIcon}><Plus size={16} /></button>
                    <button type="button" onClick={function () { removeItem(item._id); }} className={`${btnIcon} text-red-500 hover:bg-red-50`}><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
            {!cart.length && <p className="py-8 text-center text-sm text-slate-500">Cart is empty — scan a product to begin</p>}
          </div>
        </div>

        <div className={`${cardClass} space-y-4 p-6`}>
          <h2 className="font-semibold text-slate-900">Checkout</h2>
          <FormField label="Customer name" name="name" icon={User} value={customerName} onChange={function (e) { setCustomerName(e.target.value); }} placeholder="Optional" />
          <FormField label="Customer phone" name="phone" value={customerPhone} onChange={function (e) { setCustomerPhone(e.target.value); }} placeholder="Optional" />
          <FormField label="Payment method" name="role" type="select" icon={CreditCard} value={paymentMethod} onChange={function (e) { setPaymentMethod(e.target.value); }} options={["Cash", "Card", "Bank Transfer", "Mobile Wallet"]} />
          <FormField label="Tax" name="price" type="number" icon={Percent} value={tax} onChange={function (e) { setTax(e.target.value); }} />
          <FormField label="Discount" name="price" type="number" icon={Percent} value={discount} onChange={function (e) { setDiscount(e.target.value); }} />
          <FormField label="Paid amount" name="price" type="number" icon={DollarSign} value={paidAmount} onChange={function (e) { setPaidAmount(e.target.value); }} required />

          <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-900"><span>Total</span><span>{total.toFixed(2)}</span></div>
            <div className="flex justify-between font-medium text-emerald-600"><span>Change</span><span>{change.toFixed(2)}</span></div>
          </div>

          <Button type="button" disabled={loading} onClick={completeSale} icon={Receipt} className="w-full !bg-emerald-600 hover:!bg-emerald-700">
            {loading ? "Processing..." : "Complete Sale"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default POS;
