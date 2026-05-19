import { useState } from "react";
import toast from "react-hot-toast";
import { ScanLine, Search, RotateCcw } from "lucide-react";
import { scanProductApi } from "../../api/product.api.js";
import { useAuthStore } from "../../store/authStore.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import ProductDetailCard from "../../components/products/ProductDetailCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import { cardClass } from "../../components/ui/uiClasses.js";

function Scanner() {
  const user = useAuthStore(function (s) { return s.user; });
  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleScan(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    setLoading(true);
    setProduct(null);
    try {
      const res = await scanProductApi(trimmed);
      setProduct(res.data.data);
      setCode("");
      toast.success("Product found");
    } catch {
      toast.error("Product not found");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  function handleScanAnother() {
    setProduct(null);
    setCode("");
    inputRef.current?.focus();
  }

  return (
    <div>
      <PageHeader title="Product Scanner" subtitle="Scan or enter SKU, barcode, or QR code — details appear below" />

      <div className={`${cardClass} mx-auto max-w-lg p-6`}>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ScanLine size={28} />
        </div>
        <form onSubmit={handleScan} className="space-y-4">
          <FormField
            label="Product code"
            name="search"
            icon={Search}
            value={code}
            onChange={function (e) { setCode(e.target.value); }}
            placeholder="SKU, barcode, or QR value"
            required
          />
          <div className="flex gap-2">
            <Button type="submit" icon={Search} className="flex-1" disabled={loading}>
              {loading ? "Looking up..." : "Scan / Lookup"}
            </Button>
            {product && (
              <Button type="button" variant="secondary" icon={RotateCcw} onClick={handleScanAnother}>
                Clear
              </Button>
            )}
          </div>
        </form>
        <p className="mt-3 text-center text-xs text-slate-500">
          Tip: use a barcode scanner — it types the code and submits automatically
        </p>
      </div>

      {loading && <Loader text="Finding product..." />}

      {product && !loading && (
        <ProductDetailCard product={product} user={user} />
      )}
    </div>
  );
}

export default Scanner;
