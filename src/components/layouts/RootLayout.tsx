import { Outlet } from "react-router";
import { AuthProvider } from "../../contexts/AuthContext";
import { DataProvider } from "../../contexts/DataContext";
import { Toaster } from "../ui/sonner";

export function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <Outlet />
        <Toaster />
      </DataProvider>
    </AuthProvider>
  );
}
