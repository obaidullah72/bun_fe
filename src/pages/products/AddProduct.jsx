import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProductApi } from "../../api/product.api.js";

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    qrCodeValue: "",
    purchasePrice: 0,
    sellingPrice: 0,
    stockQuantity: 0,
    minStockLevel: 5,
    unit: "pcs"
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await createProductApi(form);
      toast.success("Product created");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          required
        />

        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          required
        />

        <input
          name="barcode"
          placeholder="Barcode"
          value={form.barcode}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
        />

        <input
          name="qrCodeValue"
          placeholder="QR Code Value"
          value={form.qrCodeValue}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
        />

        <input
          name="purchasePrice"
          type="number"
          placeholder="Purchase Price"
          value={form.purchasePrice}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
        />

        <input
          name="sellingPrice"
          type="number"
          placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
          required
        />

        <input
          name="stockQuantity"
          type="number"
          placeholder="Stock Quantity"
          value={form.stockQuantity}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
        />

        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          <option value="pcs">pcs</option>
          <option value="kg">kg</option>
          <option value="liter">liter</option>
          <option value="box">box</option>
          <option value="pack">pack</option>
        </select>

        <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white md:col-span-2">
          Save Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;