import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router";
import { AuthProvider } from "../../contexts/AuthContext";
import { DataProvider } from "../../contexts/DataContext";
import { Toaster } from "../ui/sonner";
export function RootLayout() {
    return (_jsx(AuthProvider, { children: _jsxs(DataProvider, { children: [_jsx(Outlet, {}), _jsx(Toaster, {})] }) }));
}
