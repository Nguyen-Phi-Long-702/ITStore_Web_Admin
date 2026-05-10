import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
export function ErrorBoundary() {
    const error = useRouteError();
    let errorMessage;
    let errorStatus;
    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText || error.data?.message || "Đã xảy ra lỗi";
        errorStatus = error.status;
    }
    else if (error instanceof Error) {
        errorMessage = error.message;
    }
    else if (typeof error === "string") {
        errorMessage = error;
    }
    else {
        errorMessage = "Đã xảy ra lỗi không xác định";
    }
    const handleReload = () => {
        window.location.reload();
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 px-4", children: _jsx("div", { className: "max-w-md w-full text-center", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 space-y-6", children: [_jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "rounded-full bg-red-100 p-4", children: _jsx(AlertTriangle, { className: "h-12 w-12 text-red-600" }) }) }), _jsxs("div", { className: "space-y-2", children: [errorStatus && (_jsx("h1", { className: "text-6xl font-bold text-gray-900", children: errorStatus })), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Oops! C\u00F3 l\u1ED7i x\u1EA3y ra" }), _jsx("p", { className: "text-gray-600", children: errorMessage })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [_jsx(Button, { asChild: true, variant: "outline", onClick: handleReload, children: _jsxs("button", { children: [_jsx(RefreshCcw, { className: "h-4 w-4 mr-2" }), "T\u1EA3i l\u1EA1i trang"] }) }), _jsx(Button, { asChild: true, children: _jsxs(Link, { to: "/", children: [_jsx(Home, { className: "h-4 w-4 mr-2" }), "V\u1EC1 trang ch\u1EE7"] }) })] }), process.env.NODE_ENV === "development" && error instanceof Error && (_jsxs("details", { className: "text-left", children: [_jsx("summary", { className: "cursor-pointer text-sm font-medium text-gray-700", children: "Chi ti\u1EBFt l\u1ED7i (Development)" }), _jsx("pre", { className: "mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-48", children: error.stack })] }))] }) }) }));
}
