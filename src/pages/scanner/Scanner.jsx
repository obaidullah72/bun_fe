import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { scanProductApi } from "../../api/product.api.js";

function Scanner() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  async function handleScan(e) {
    e.preventDefault();
    try {
      const res = await scanProductApi(code);
      navigate(`/products/${res.data.data._id}`);
    } catch {
      toast.error("Product not found");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Product Scanner</h1>
      <p className="mt-2 text-slate-500">Enter or scan SKU, barcode, or QR code</p>
      <form onSubmit={handleScan} className="mt-6 flex gap-3">
        <input autoFocus value={code} onChange={function (e) { setCode(e.target.value); }} placeholder="Scan code..." className="flex-1 rounded-xl border px-4 py-3 dark:bg-slate-900" />
        <button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold">Lookup</button>
      </form>
    </div>
  );
}
export default Scanner;
