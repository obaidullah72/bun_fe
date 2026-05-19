import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../../api/category.api.js";
import { getSuppliersApi } from "../../api/supplier.api.js";
import { getShelvesApi } from "../../api/shelf.api.js";

function ProductForm({ initial, onSubmit, title }) {
  const [form, setForm] = useState({
    name: "", sku: "", barcode: "", description: "", category: "", supplier: "", shelf: "",
    purchasePrice: 0, sellingPrice: 0, stockQuantity: 0, minStockLevel: 5, unit: "pcs", isActive: true
  });

  const categories = useQuery({ queryKey: ["categories"], queryFn: getCategoriesApi });
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: getSuppliersApi });
  const shelves = useQuery({ queryKey: ["shelves"], queryFn: getShelvesApi });

  useEffect(function () {
    if (initial) {
      setForm({
        name: initial.name || "",
        sku: initial.sku || "",
        barcode: initial.barcode || "",
        description: initial.description || "",
        category: initial.category?._id || initial.category || "",
        supplier: initial.supplier?._id || initial.supplier || "",
        shelf: initial.shelf?._id || initial.shelf || "",
        purchasePrice: initial.purchasePrice || 0,
        sellingPrice: initial.sellingPrice || 0,
        stockQuantity: initial.stockQuantity || 0,
        minStockLevel: initial.minStockLevel || 5,
        unit: initial.unit || "pcs",
        isActive: initial.isActive !== false
      });
    }
  }, [initial]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(function (f) {
      return { ...f, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value };
    });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold dark:text-white">{title}</h1>
      <form onSubmit={function (e) { e.preventDefault(); onSubmit(form); }} className="mt-6 grid gap-4 md:grid-cols-2">
        <input name="name" required value={form.name} onChange={handleChange} placeholder="Name" className="rounded-xl border px-4 py-2 dark:bg-slate-900" />
        <input name="sku" required value={form.sku} onChange={handleChange} placeholder="SKU" className="rounded-xl border px-4 py-2 dark:bg-slate-900" />
        <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="Barcode" className="rounded-xl border px-4 py-2 dark:bg-slate-900" />
        <select name="unit" value={form.unit} onChange={handleChange} className="rounded-xl border px-4 py-2 dark:bg-slate-900">
          {["pcs", "kg", "liter", "box", "pack"].map(function (u) { return <option key={u}>{u}</option>; })}
        </select>
        <select name="category" value={form.category} onChange={handleChange} className="rounded-xl border px-4 py-2 dark:bg-slate-900">
          <option value="">Category</option>
          {(categories.data?.data?.data || []).map(function (c) { return <option key={c._id} value={c._id}>{c.name}</option>; })}
        </select>
        <select name="supplier" value={form.supplier} onChange={handleChange} className="rounded-xl border px-4 py-2 dark:bg-slate-900">
          <option value="">Supplier</option>
          {(suppliers.data?.data?.data || []).map(function (s) { return <option key={s._id} value={s._id}>{s.name}</option>; })}
        </select>
        <select name="shelf" value={form.shelf} onChange={handleChange} className="md:col-span-2 rounded-xl border px-4 py-2 dark:bg-slate-900">
          <option value="">Shelf location</option>
          {(shelves.data?.data?.data || []).map(function (s) {
            const label = `${s.shelfName} - ${s.rackNumber} - ${s.rowNumber} - ${s.pointName}`;
            return <option key={s._id} value={s._id}>{label}</option>;
          })}
        </select>
        <input name="purchasePrice" type="number" value={form.purchasePrice} onChange={handleChange} placeholder="Purchase price" className="rounded-xl border px-4 py-2 dark:bg-slate-900" />
        <input name="sellingPrice" type="number" required value={form.sellingPrice} onChange={handleChange} placeholder="Selling price" className="rounded-xl border px-4 py-2 dark:bg-slate-900" />
        <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} placeholder="Stock" className="rounded-xl border px-4 py-2 dark:bg-slate-900" />
        <input name="minStockLevel" type="number" value={form.minStockLevel} onChange={handleChange} placeholder="Min stock" className="rounded-xl border px-4 py-2 dark:bg-slate-900" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="md:col-span-2 rounded-xl border px-4 py-2 dark:bg-slate-900" />
        <button type="submit" className="md:col-span-2 rounded-xl bg-blue-600 py-3 font-semibold text-white">Save Product</button>
      </form>
    </div>
  );
}
export default ProductForm;
