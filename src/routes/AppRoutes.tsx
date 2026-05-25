import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import MainLayout from "../components/layouts/MainLayout";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import NotFound from "../pages/NotFound/NotFound";
import AdminLayout from "../components/layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminProducts from "../pages/Admin/Products/AdminProducts";
import AdminInventory from "../pages/Admin/Inventory/AdminInventory";
import AdminOrders from "../pages/Admin/Orders/AdminOrders";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLoginRoute from "./AdminLoginRoute";
import UserLoginRoute from "./UserLoginRoute";
import Register from "../pages/Register/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route path="/login" element={<UserLoginRoute />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin/login" element={<AdminLoginRoute />} />

      <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
