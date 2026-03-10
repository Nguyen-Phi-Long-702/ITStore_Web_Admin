import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";
import { ProductList } from "./pages/products/ProductList";
import { ProductForm } from "./pages/products/ProductForm";
import { ProductVariantsView } from "./pages/products/ProductVariantsView";
import { InventoryManagement } from "./pages/products/InventoryManagement";
import { OrderList } from "./pages/orders/OrderList";
import { OrderDetail } from "./pages/orders/OrderDetail";
import { CustomerList } from "./pages/users/CustomerList";
import { PromotionList } from "./pages/promotions/PromotionList";
import { PromotionForm } from "./pages/promotions/PromotionForm";
import { ReturnList } from "./pages/returns/ReturnList";
import { ReturnDetail } from "./pages/returns/ReturnDetail";
import { Reports } from "./pages/Reports";
import { SystemConfig } from "./pages/SystemConfig";
import { BrandList } from "./pages/brands/BrandList";
import { CategoryList } from "./pages/categories/CategoryList";
import { Account } from "./pages/Account";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "/",
        Component: DashboardLayout,
        ErrorBoundary: ErrorBoundary,
        children: [
          { index: true, Component: Dashboard },
          { path: "products", Component: ProductList },
          { path: "products/new", Component: ProductForm },
          { path: "products/edit/:id", Component: ProductForm },
          {
            path: "products/variants/:id",
            Component: ProductVariantsView,
          },
          {
            path: "products/inventory",
            Component: InventoryManagement,
          },
          { path: "brands", Component: BrandList },
          { path: "categories", Component: CategoryList },
          { path: "orders", Component: OrderList },
          { path: "orders/:id", Component: OrderDetail },
          { path: "customers", Component: CustomerList },
          { path: "promotions", Component: PromotionList },
          { path: "promotions/new", Component: PromotionForm },
          {
            path: "promotions/edit/:id",
            Component: PromotionForm,
          },
          { path: "returns", Component: ReturnList },
          { path: "returns/:id", Component: ReturnDetail },
          { path: "reports", Component: Reports },
          { path: "settings", Component: SystemConfig },
          { path: "account", Component: Account },
        ],
      },
    ],
  },
]);