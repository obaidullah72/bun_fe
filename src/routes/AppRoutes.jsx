import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import RoleProtectedRoute from "../components/common/RoleProtectedRoute.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import ProductsList from "../pages/products/ProductsList.jsx";
import AddProduct from "../pages/products/AddProduct.jsx";
import EditProduct from "../pages/products/EditProduct.jsx";
import ProductDetails from "../pages/products/ProductDetails.jsx";
import POS from "../pages/pos/POS.jsx";
import POSReceipt from "../pages/pos/POSReceipt.jsx";
import Categories from "../pages/categories/Categories.jsx";
import CategoryDetails from "../pages/categories/CategoryDetails.jsx";
import Suppliers from "../pages/suppliers/Suppliers.jsx";
import SupplierDetails from "../pages/suppliers/SupplierDetails.jsx";
import Shelves from "../pages/shelves/Shelves.jsx";
import ShelfDetails from "../pages/shelves/ShelfDetails.jsx";
import PurchaseOrders from "../pages/purchases/PurchaseOrders.jsx";
import PurchaseOrderDetails from "../pages/purchases/PurchaseOrderDetails.jsx";
import SalesOrders from "../pages/sales/SalesOrders.jsx";
import SalesOrderDetails from "../pages/sales/SalesOrderDetails.jsx";
import StockTracking from "../pages/inventory/StockTracking.jsx";
import Adjustments from "../pages/inventory/Adjustments.jsx";
import AdjustmentDetails from "../pages/inventory/AdjustmentDetails.jsx";
import LowStock from "../pages/inventory/LowStock.jsx";
import Reports from "../pages/reports/Reports.jsx";
import ActivityLogs from "../pages/logs/ActivityLogs.jsx";
import ActivityLogDetails from "../pages/logs/ActivityLogDetails.jsx";
import NotificationDetails from "../pages/notifications/NotificationDetails.jsx";
import Users from "../pages/users/Users.jsx";
import UserDetails from "../pages/users/UserDetails.jsx";
import Profile from "../pages/profile/Profile.jsx";
import Scanner from "../pages/scanner/Scanner.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager", "Cashier"]}><POS /></RoleProtectedRoute>} />
        <Route path="/pos/receipt/:id" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager", "Cashier"]}><POSReceipt /></RoleProtectedRoute>} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/add" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager"]}><AddProduct /></RoleProtectedRoute>} />
        <Route path="/products/:id/edit" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager"]}><EditProduct /></RoleProtectedRoute>} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/:id" element={<SupplierDetails />} />
        <Route path="/shelves" element={<Shelves />} />
        <Route path="/shelves/:id" element={<ShelfDetails />} />
        <Route path="/purchase-orders" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager"]}><PurchaseOrders /></RoleProtectedRoute>} />
        <Route path="/purchase-orders/:id" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager"]}><PurchaseOrderDetails /></RoleProtectedRoute>} />
        <Route path="/sales-orders" element={<SalesOrders />} />
        <Route path="/sales-orders/:id" element={<SalesOrderDetails />} />
        <Route path="/stock" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager", "Staff"]}><StockTracking /></RoleProtectedRoute>} />
        <Route path="/adjustments" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager", "Staff"]}><Adjustments /></RoleProtectedRoute>} />
        <Route path="/inventory/adjustments/:id" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager", "Staff"]}><AdjustmentDetails /></RoleProtectedRoute>} />
        <Route path="/low-stock" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager", "Staff"]}><LowStock /></RoleProtectedRoute>} />
        <Route path="/reports" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager"]}><Reports /></RoleProtectedRoute>} />
        <Route path="/activity-logs" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager"]}><ActivityLogs /></RoleProtectedRoute>} />
        <Route path="/activity-logs/:id" element={<RoleProtectedRoute allowedRoles={["Admin", "Manager"]}><ActivityLogDetails /></RoleProtectedRoute>} />
        <Route path="/notifications/:id" element={<NotificationDetails />} />
        <Route path="/users" element={<RoleProtectedRoute allowedRoles={["Admin"]}><Users /></RoleProtectedRoute>} />
        <Route path="/users/:id" element={<RoleProtectedRoute allowedRoles={["Admin"]}><UserDetails /></RoleProtectedRoute>} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
