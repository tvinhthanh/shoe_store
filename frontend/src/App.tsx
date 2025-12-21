import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet
} from "react-router-dom";

import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout";

import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";

import { useAppContext } from "./contexts/AppContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import HomeAdmin from "./pages/HomeAdmin";
import AdminCategoriesPage from "./pages/admin/category/AdminCategoriesPage";
import AdminProductsPage from "./pages/admin/product/AdminProductsPage";
import AdminVariantsPage from "./pages/admin/variant/AdminVariantsPage";
import AdminOrdersPage from "./pages/admin/order/AdminOrdersPage";
import AdminCustomersPage from "./pages/admin/customer/AdminCustomersPage";
import AdminReviewsPage from "./pages/admin/review/AdminReviewsPage";
import ProductDetail from "./pages/user/product/ProductDetail";
import {
  TermsOfSale,
  TermsOfUse,
  PrivacyPolicy,
  PrivacySettings,
} from "./pages/static/StaticPages";


import { CartProvider } from "./contexts/CartContext";
import CartPage from "./pages/user/cart/Cart";
import OrderListPage from "./pages/user/order/Order";

const App = () => {
  const { isLoggedIn, userRole, isAuthLoading } = useAppContext();

  // CHẶN RENDER TRƯỚC KHI XÁC THỰC
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Đang tải thông tin đăng nhập...
      </div>
    );
  }

  // PROTECT ADMIN
  const RequireAdmin = () => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (userRole !== "admin") return <Navigate to="/" />;
    return <Outlet />;
  };

  return (
    <CartProvider>
      <Router>
        <Routes>

          <Route element={<Layout />}>
            <Route
              path="/"
              element={userRole === "admin" ? <Navigate to="/admin" /> : <Home />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/mydonhang" element={<OrderListPage />} />
            <Route path="/terms-of-sale" element={<TermsOfSale />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy-settings" element={<PrivacySettings />} />
          </Route>

          <Route path="/admin" element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<HomeAdmin />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="variants" element={<AdminVariantsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminCustomersPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
