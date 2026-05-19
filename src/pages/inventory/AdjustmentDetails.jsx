import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdjustmentApi } from "../../api/inventory.api.js";
import DetailLayout, { DetailCard, InfoGrid } from "../../components/common/DetailLayout.jsx";
import Button from "../../components/ui/Button.jsx";

function AdjustmentDetails() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["adjustment", id],
    queryFn: function () { return getAdjustmentApi(id); }
  });
  const adj = data?.data?.data;

  return (
    <DetailLayout
      backTo="/adjustments"
      backLabel="Back to adjustments"
      title="Inventory Adjustment"
      subtitle={adj ? new Date(adj.createdAt).toLocaleString() : ""}
      loading={isLoading}
      actions={
        adj?.product?._id && (
          <Link to={`/products/${adj.product._id}`}>
            <Button type="button" variant="secondary">View product</Button>
          </Link>
        )
      }
    >
      <DetailCard>
        <InfoGrid
          items={[
            { label: "Product", value: adj?.product?.name },
            { label: "SKU", value: adj?.product?.sku },
            { label: "Type", value: adj?.type },
            { label: "Quantity", value: adj?.quantity },
            { label: "Previous stock", value: adj?.previousStock },
            { label: "New stock", value: adj?.newStock },
            { label: "Reason", value: adj?.reason },
            { label: "Adjusted by", value: adj?.adjustedBy?.name }
          ]}
        />
      </DetailCard>
    </DetailLayout>
  );
}

export default AdjustmentDetails;
