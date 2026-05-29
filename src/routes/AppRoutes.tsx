import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import MainLayout from "../components/layouts/MainLayout";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import CheckoutAddressPage from "../pages/Checkout/CheckoutAddressPage";
import CheckoutReviewPage from "../pages/Checkout/CheckoutReviewPage";
import CheckoutPaymentMethodPage from "../pages/Checkout/CheckoutPaymentMethodPage";
import CheckoutCardPaymentPage from "../pages/Checkout/CheckoutCardPaymentPage";
import CheckoutPaymentResultPage from "../pages/Checkout/CheckoutPaymentResultPage";
import NotFound from "../pages/NotFound/NotFound";
import AdminLayout from "../components/layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminProducts from "../pages/Admin/Products/AdminProducts";
import AdminInventory from "../pages/Admin/Inventory/AdminInventory";
import AdminOrders from "../pages/Admin/Orders/AdminOrders";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLoginRoute from "./AdminLoginRoute";
import UserLoginRoute from "./UserLoginRoute";
import RegisterRoute from "./RegisterRoute";
import AccountPlaceholder from "../pages/Account/AccountPlaceholder";
import ProfilePage from "../pages/Account/Profile/ProfilePage";
import AddressPage from "../pages/Account/Address/AddressPage";
import UserProtectedRoute from "./UserProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={<AccountPlaceholder titleKey="cart.checkoutTitle" />}
        />
        <Route element={<UserProtectedRoute />}>
          <Route path="/checkout/address" element={<CheckoutAddressPage />} />
          <Route path="/checkout/review" element={<CheckoutReviewPage />} />
          <Route path="/checkout/payment" element={<CheckoutPaymentMethodPage />} />
          <Route path="/checkout/payment/card" element={<CheckoutCardPaymentPage />} />
          <Route
            path="/checkout/result/success"
            element={<CheckoutPaymentResultPage status="success" />}
          />
          <Route
            path="/checkout/result/failure"
            element={<CheckoutPaymentResultPage status="failure" />}
          />
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/addresses" element={<AddressPage />} />
        </Route>
        <Route
          path="/account/orders"
          element={<AccountPlaceholder titleKey="auth.account.ordersTitle" />}
        />
      </Route>

      <Route path="/login" element={<UserLoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />

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
