import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ScanLine, Search } from "lucide-react";
import { scanProductApi } from "../../api/product.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import Button from "../../components/ui/Button.jsx";
import { cardClass } from "../../components/ui/uiClasses.js";

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
      <PageHeader title="Product Scanner" subtitle="Scan or enter SKU, barcode, or QR code to find a product" />
      <div className={`${cardClass} mx-auto max-w-lg p-8`}>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ScanLine size={32} />
        </div>
        <form onSubmit={handleScan} className="space-y-4">
          <FormField label="Product code" name="search" icon={Search} value={code} onChange={function (e) { setCode(e.target.value); }} placeholder="SKU, barcode, or QR value" required />
          <Button type="submit" icon={Search} className="w-full">Lookup Product</Button>
        </form>
      </div>
    </div>
  );
}
export default Scanner;
