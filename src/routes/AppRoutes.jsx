import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import RoleProtectedRoute from "../components/common/RoleProtectedRoute.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import ProductsList from "../pages/products/ProductsList.jsx";
import AddProduct from "../pages/products/AddProduct.jsx";
import POS from "../pages/pos/POS.jsx";
import Categories from "../pages/categories/Categories.jsx";
import Suppliers from "../pages/suppliers/Suppliers.jsx";
import Shelves from "../pages/shelves/Shelves.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/products" element={<ProductsList />} />

        <Route
          path="/products/add"
          element={
            <RoleProtectedRoute allowedRoles={["Admin", "Manager"]}>
              <AddProduct />
            </RoleProtectedRoute>
          }
        />

        <Route path="/categories" element={<Categories />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/shelves" element={<Shelves />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;