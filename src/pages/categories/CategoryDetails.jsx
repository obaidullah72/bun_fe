import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategoryApi, getCategoryProductsApi } from "../../api/category.api.js";
import DetailLayout, { DetailCard, InfoGrid } from "../../components/common/DetailLayout.jsx";
import StockBadge from "../../components/common/StockBadge.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";

function CategoryDetails() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["category", id], queryFn: function () { return getCategoryApi(id); } });
  const { data: productsData } = useQuery({
    queryKey: ["category-products", id],
    queryFn: function () { return getCategoryProductsApi(id); }
  });
  const category = data?.data?.data;
  const products = productsData?.data?.data || [];

  return (
    <DetailLayout
      backTo="/categories"
      backLabel="Back to categories"
      title={category?.name}
      subtitle={category?.description}
      loading={isLoading}
    >
      <DetailCard title="Information">
        <InfoGrid
          items={[
            { label: "Name", value: category?.name },
            { label: "Description", value: category?.description },
            { label: "Status", value: category?.isActive !== false ? "Active" : "Inactive" },
            { label: "Products", value: products.length }
          ]}
        />
      </DetailCard>
      <DetailCard title="Products in category">
        <div className={tableWrapClass}>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className={thClass}>Name</th>
                <th className={thClass}>SKU</th>
                <th className={thClass}>Stock</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(function (p) {
                return (
                  <tr key={p._id} className="border-t border-slate-100">
                    <td className={tdClass}>
                      <Link to={`/products/${p._id}`} className="text-blue-600">{p.name}</Link>
                    </td>
                    <td className={tdClass}>{p.sku}</td>
                    <td className={tdClass}>{p.stockQuantity}</td>
                    <td className={tdClass}>
                      <StockBadge stock={p.stockQuantity} minStock={p.minStockLevel} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DetailCard>
    </DetailLayout>
  );
}

export default CategoryDetails;
