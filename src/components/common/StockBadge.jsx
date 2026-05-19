function StockBadge({ stock, minStock }) {
  if (stock === 0) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
        Out of Stock
      </span>
    );
  }
  if (stock <= minStock) {
    return (
      <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
      In Stock
    </span>
  );
}

export default StockBadge;
