import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";                                 
import Products from "../pages/Products/Products";
import Cart from "../pages/Cart/Cart";
import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/products"
        element={
          <MainLayout>
            <Products />
          </MainLayout>
        }
      />

      <Route
        path="/cart"
        element={
          <MainLayout>
            <Cart />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRouter;
