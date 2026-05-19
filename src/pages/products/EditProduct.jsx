import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getProductApi, updateProductApi } from "../../api/product.api.js";
import ProductForm from "../../components/products/ProductForm.jsx";
import Loader from "../../components/common/Loader.jsx";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["product", id], queryFn: function () { return getProductApi(id); } });
  const mutation = useMutation({
    mutationFn: function (form) { return updateProductApi(id, form); },
    onSuccess: function () { toast.success("Product updated"); navigate(`/products/${id}`); }
  });
  if (isLoading) return <Loader />;
  return <ProductForm initial={data?.data?.data} onSubmit={function (f) { mutation.mutate(f); }} title="Edit Product" />;
}
export default EditProduct;
