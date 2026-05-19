import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Package, Eye } from "lucide-react";
import StockBadge from "../../components/common/StockBadge.jsx";
import { getProductsApi } from "../../api/product.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import SearchInput from "../../components/common/SearchInput.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { tableWrapClass, thClass, tdClass, btnIcon } from "../../components/ui/uiClasses.js";

function ProductsList() {
  const user = useAuthStore(function (s) { return s.user; });
  const [search, setSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, stockStatus],
    queryFn: async function () {
      const response = await getProductsApi({
        search: search || undefined,
        stockStatus: stockStatus || undefined
      });
      return response.data.data;
    }
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog and stock"
        action={
          canManageInventory(user) ? (
            <Link to="/products/add">
              <Button icon={Plus}>Add Product</Button>
            </Link>
          ) : null
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={search}
            onChange={function (e) { setSearch(e.target.value); }}
            placeholder="Search by name, SKU, or barcode..."
          />
        </div>
        <select
          value={stockStatus}
          onChange={function (e) { setStockStatus(e.target.value); }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
        >
          <option value="">All stock</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      {!data?.length ? (
        <EmptyState title="No products found" description="Add products to start tracking inventory." icon={Package} />
      ) : (
        <div className={tableWrapClass}>
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className={thClass}>Product</th>
                <th className={thClass}>SKU</th>
                <th className={thClass}>Stock / Status</th>
                <th className={thClass}>Price</th>
                <th className={thClass}>Shelf</th>
                <th className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(function (product) {
                const rowClass =
                  product.stockQuantity === 0
                    ? "bg-red-50/60"
                    : product.stockQuantity <= product.minStockLevel
                      ? "bg-orange-50/40"
                      : "";
                return (
                  <tr key={product._id} className={`border-t border-slate-100 hover:bg-slate-50/50 ${rowClass}`}>
                    <td className={`${tdClass} font-medium text-slate-900`}>{product.name}</td>
                    <td className={tdClass}>{product.sku}</td>
                    <td className={tdClass}>
                      <span className="font-medium">{product.stockQuantity}</span>
                      <div className="mt-1">
                        <StockBadge stock={product.stockQuantity} minStock={product.minStockLevel} />
                      </div>
                    </td>
                    <td className={tdClass}>{product.sellingPrice}</td>
                    <td className={tdClass}>
                      {product.shelfNameSnapshot || "—"}
                      {product.shelfPointSnapshot && (
                        <span className="block text-xs text-slate-400">{product.shelfPointSnapshot}</span>
                      )}
                    </td>
                    <td className={tdClass}>
                      <Link to={`/products/${product._id}`} className={btnIcon} title="View">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductsList;
