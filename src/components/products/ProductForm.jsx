import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { getCategoriesApi } from "../../api/category.api.js";
import { getSuppliersApi } from "../../api/supplier.api.js";
import { getShelvesApi } from "../../api/shelf.api.js";
import PageHeader from "../ui/PageHeader.jsx";
import FormField from "../ui/FormField.jsx";
import Button from "../ui/Button.jsx";
import { cardClass } from "../ui/uiClasses.js";

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

  const categoryOptions = [{ value: "", label: "Select category" }].concat(
    (categories.data?.data?.data || []).map(function (c) { return { value: c._id, label: c.name }; })
  );
  const supplierOptions = [{ value: "", label: "Select supplier" }].concat(
    (suppliers.data?.data?.data || []).map(function (s) { return { value: s._id, label: s.name }; })
  );
  const shelfOptions = [{ value: "", label: "Select shelf location" }].concat(
    (shelves.data?.data?.data || []).map(function (s) {
      return {
        value: s._id,
        label: `${s.shelfName} · ${s.rackNumber || ""} · ${s.rowNumber || ""} · ${s.pointName || ""}`
      };
    })
  );

  return (
    <div>
      <PageHeader title={title} subtitle="Fill in product details and inventory info" />
      <form onSubmit={function (e) { e.preventDefault(); onSubmit(form); }} className={`${cardClass} max-w-4xl p-6`}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Product name" name="name" icon="product" value={form.name} onChange={handleChange} placeholder="Product name" required />
          <FormField label="SKU" name="sku" value={form.sku} onChange={handleChange} placeholder="SKU-001" required />
          <FormField label="Barcode" name="barcode" value={form.barcode} onChange={handleChange} placeholder="Barcode number" />
          <FormField label="Unit" name="unit" type="select" value={form.unit} onChange={handleChange} options={["pcs", "kg", "liter", "box", "pack"]} />
          <FormField label="Category" name="category" type="select" icon="category" value={form.category} onChange={handleChange} options={categoryOptions} />
          <FormField label="Supplier" name="supplier" type="select" icon="supplier" value={form.supplier} onChange={handleChange} options={supplierOptions} />
          <FormField label="Shelf location" name="shelf" type="select" icon="shelf" value={form.shelf} onChange={handleChange} options={shelfOptions} className="md:col-span-2" />
          <FormField label="Purchase price" name="purchasePrice" type="number" icon="price" value={form.purchasePrice} onChange={handleChange} placeholder="0" />
          <FormField label="Selling price" name="sellingPrice" type="number" icon="price" value={form.sellingPrice} onChange={handleChange} placeholder="0" required />
          <FormField label="Stock quantity" name="stockQuantity" type="number" icon="stock" value={form.stockQuantity} onChange={handleChange} placeholder="0" />
          <FormField label="Min stock level" name="minStockLevel" type="number" icon="stock" value={form.minStockLevel} onChange={handleChange} placeholder="5" />
          <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} placeholder="Product description" className="md:col-span-2" />
        </div>
        <Button type="submit" icon={Save} className="mt-6 w-full sm:w-auto">
          Save Product
        </Button>
      </form>
    </div>
  );
}

export default ProductForm;
