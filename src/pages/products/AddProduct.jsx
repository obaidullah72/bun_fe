import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProductApi } from "../../api/product.api.js";
import ProductForm from "../../components/products/ProductForm.jsx";

function AddProduct() {
  const navigate = useNavigate();

  async function handleSubmit(form) {
    try {
      await createProductApi({ ...form, qrCodeValue: form.qrCodeValue || form.sku });
      toast.success("Product created");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  }

  return <ProductForm title="Add Product" onSubmit={handleSubmit} />;
}

export default AddProduct;
