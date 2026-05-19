import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShelfApi, getShelfProductsApi } from "../../api/shelf.api.js";
import Loader from "../../components/common/Loader.jsx";

function ShelfDetails() {
  const { id } = useParams();
  const shelfQuery = useQuery({ queryKey: ["shelf", id], queryFn: function () { return getShelfApi(id); } });
  const productsQuery = useQuery({ queryKey: ["shelf-products", id], queryFn: function () { return getShelfProductsApi(id); } });

  if (shelfQuery.isLoading) return <Loader />;

  const shelf = shelfQuery.data?.data?.data;
  const products = productsQuery.data?.data?.data || [];
  const location = [shelf?.rackNumber, shelf?.rowNumber, shelf?.pointName].filter(Boolean).join(" - ");

  return (
    <div>
      <Link to="/shelves" className="text-sm text-blue-600">← Back to shelves</Link>
      <h1 className="mt-4 text-2xl font-bold dark:text-white">{shelf?.shelfName}</h1>
      <p className="text-slate-500">{shelf?.shelfCode} · {shelf?.zone} · {location}</p>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="font-semibold">Products on this shelf ({products.length})</h2>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">Name</th><th className="p-2">SKU</th><th className="p-2">Stock</th></tr></thead>
          <tbody>
            {products.map(function (p) {
              return <tr key={p._id} className="border-t dark:border-slate-800"><td className="p-2">{p.name}</td><td className="p-2">{p.sku}</td><td className="p-2">{p.stockQuantity}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShelfDetails;
