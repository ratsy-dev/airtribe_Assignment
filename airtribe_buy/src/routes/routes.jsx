import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/login";
import RegisterPage from "../pages/register/register";
import AllProductPage from "../pages/allproducts/allProduct";
import ProductDetailPage from "../pages/productdetailpage/productDetailPage";
import CartPage from "../pages/cart/cart";
import CheckOutPage from "../pages/checkout/checkout";
import ProtectedRoute from "./protectedroute/protectedRoute";
import MainLayout from "../container/layout";
import WishListPage from "../pages/wishlist/wishlist";

const token = localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: "",
    element: <Navigate to="/products" />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "products",
        element: <AllProductPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "login",
        element: token ? <Navigate to="/allproducts" /> : <LoginPage />,
      },
      {
        path: "register",
        element: token ? <Navigate to="/allproducts" /> : <RegisterPage />,
      },
      {
        path: "cart",
        element: <ProtectedRoute element={<CartPage />} />,
      },
      {
        path: "wishlist",
        element: <ProtectedRoute element={<WishListPage />} />,
      },
      {
        path: "/checkout",
        element: <ProtectedRoute element={<CheckOutPage />} />,
      },
      {
        path: "*",
        element: <Navigate to="/products" />,
      },
    ],
  },
]);

export default router;
