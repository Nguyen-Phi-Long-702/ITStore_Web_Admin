import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";
import { ProductList } from "./pages/products/ProductList";
import { ProductForm } from "./pages/products/ProductForm";
import { ProductVariantsView } from "./pages/products/ProductVariantsView";
import { Stock } from "./pages/products/Stock";
import { OrderList } from "./pages/orders/OrderList";
import { OrderDetail } from "./pages/orders/OrderDetail";
import { CustomerList } from "./pages/users/CustomerList";
import { CouponList } from "./pages/Coupon/CouponList";
import { CouponForm } from "./pages/Coupon/CouponForm";
import { NotificationList } from "./pages/notifications/NotificationList";
import { NotificationForm } from "./pages/notifications/NotificationForm";
import { ReturnList } from "./pages/returns/ReturnList";
import { ReturnDetail } from "./pages/returns/ReturnDetail";
import { Reports } from "./pages/Reports";
import { BrandList } from "./pages/brands/BrandList";
import { CategoryList } from "./pages/categories/CategoryList";
import { BannerList } from "./pages/banners/BannerList";
import { Account } from "./pages/Account";
import { PaymentList } from "./pages/payments/PaymentList";
import { CustomerDetail } from "./pages/users/CustomerDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      { path: "login", Component: Login},
      {
        path: "/",
        Component: DashboardLayout,
        ErrorBoundary: ErrorBoundary,
        children: [
          { index: true, Component: Dashboard },
          { path: "products", Component: ProductList },
          { path: "products/new", Component: ProductForm },
          { path: "products/edit/:id", Component: ProductForm },
          { path: "products/variants/:id", Component: ProductVariantsView},
          { path: "products/stock", Component: Stock},
          { path: "brands", Component: BrandList },
          { path: "categories", Component: CategoryList },
          { path: "banners", Component: BannerList },
          { path: "orders", Component: OrderList },
          { path: "orders/:id", Component: OrderDetail },
          { path: "customers", Component: CustomerList },
          { path: "customers/:id", Component: CustomerDetail },
          { path: "coupon", Component: CouponList },
          { path: "coupon/new", Component: CouponForm },
          { path: "coupon/edit/:id", Component: CouponForm},
          { path: "notifications", Component: NotificationList },
          { path: "notifications/new", Component: NotificationForm },
          { path: "returns", Component: ReturnList },
          { path: "returns/:id", Component: ReturnDetail },
          { path: "reports", Component: Reports },
          { path: "account", Component: Account },
          { path: "payments", Component: PaymentList },
        ],
      },
    ],
  },
]);
