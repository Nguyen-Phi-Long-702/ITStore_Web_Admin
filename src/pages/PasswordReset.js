import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Lock, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
const API_BASE_URL = "http://localhost:3000";
const BLOCKED_MESSAGE = "Liên kết đã hết hạn. Vui lòng kiểm tra email mới nhất hoặc gửi lại yêu cầu.";
function buildApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}
export function PasswordReset() {
    const location = useLocation();
    const [isSuccess, setIsSuccess] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState("");
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get("token");
        if (!tokenFromUrl) {
            setError("Không tìm thấy token. Vui lòng sử dụng link từ email.");
            setToken("");
            setIsTokenValid(false);
            setIsBlocked(true);
            return;
        }
        setToken(tokenFromUrl);
        setIsTokenValid(true);
        setIsBlocked(false);
    }, [location.search]);
    useEffect(() => {
        const pageTitle = isTokenValid ? "Đổi mật khẩu" : "Link hết hạn";
        document.title = `${pageTitle} | IT Store`;
        return () => {
            document.title = "IT Store";
        };
    }, [isTokenValid]);
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!isTokenValid) {
            setError("Token không hợp lệ hoặc đã hết hạn.");
            return;
        }
        if (!token) {
            setError("Không tìm thấy token. Vui lòng sử dụng link từ email.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự");
            return;
        }
        if (!/[a-z]/.test(newPassword)) {
            setError("Mật khẩu phải có ít nhất 1 ký tự thường");
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            setError("Mật khẩu phải có ít nhất 1 ký tự in hoa");
            return;
        }
        if (!/\d/.test(newPassword)) {
            setError("Mật khẩu phải có ít nhất 1 số");
            return;
        }
        if (!/[^A-Za-z0-9]/.test(newPassword)) {
            setError("Mật khẩu phải có ít nhất 1 ký tự đặc biệt");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(buildApiUrl("/api/auth/reset-password"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    new_password: newPassword,
                }),
            });
            let data = null;
            try {
                data = await response.json();
            }
            catch {
                data = null;
            }
            if (data?.success === true) {
                setIsSuccess(true);
                setIsBlocked(false);
            }
            else {
                const apiMessage = data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
                const normalizedMessage = apiMessage.toLowerCase();
                if (normalizedMessage.includes("hết hạn") ||
                    normalizedMessage.includes("không hợp lệ") ||
                    normalizedMessage.includes("token")) {
                    setError(BLOCKED_MESSAGE);
                    setIsBlocked(true);
                }
                else {
                    setError(apiMessage);
                    setIsBlocked(false);
                }
            }
        }
        catch {
            setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "flex h-screen items-center justify-center bg-gradient-to-br from-[#FFE0B2] to-[#FFE0B2] p-4", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "rounded-2xl bg-white p-8 shadow-xl", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("div", { className: "mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE0B2]", children: _jsx(KeyRound, { className: "h-8 w-8 text-[#E0872B]" }) }), _jsx("h1", { className: "mb-2 text-gray-900", children: "\u0110\u1ED5i M\u1EADt Kh\u1EA9u" }), _jsx("p", { className: "text-gray-600", children: isSuccess
                                    ? "Mật khẩu đã được đổi thành công"
                                    : "Tạo mật khẩu mới cho tài khoản" })] }), !isSuccess && error && (_jsx("div", { className: "mb-4 rounded-lg bg-red-50 p-3 text-red-600", children: error })), !isSuccess && isTokenValid && !isBlocked && (_jsxs("form", { onSubmit: handlePasswordSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-gray-700", children: "M\u1EADt kh\u1EA9u m\u1EDBi" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), disabled: isLoading || !isTokenValid, className: "w-full rounded-lg border border-gray-300 bg-gray-100 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#E0872B] disabled:cursor-not-allowed disabled:opacity-50", placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u m\u1EDBi", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-gray-700", children: "X\u00E1c nh\u1EADn m\u1EADt kh\u1EA9u" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), disabled: isLoading || !isTokenValid, className: "w-full rounded-lg border border-gray-300 bg-gray-100 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#E0872B] disabled:cursor-not-allowed disabled:opacity-50", placeholder: "Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u", required: true })] })] }), _jsxs("button", { type: "submit", disabled: isLoading, className: "flex w-full items-center justify-center gap-2 rounded-lg bg-[#E0872B] py-3 text-white transition-colors hover:bg-[#E0872B] disabled:cursor-not-allowed disabled:opacity-50", children: [isLoading && _jsx(Loader2, { className: "h-5 w-5 animate-spin" }), isLoading ? "Đang xử lý..." : "Đổi mật khẩu"] })] })), isSuccess && (_jsxs("div", { className: "space-y-6 text-center", children: [_jsx("div", { className: "inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#FFE0B2]", children: _jsx(CheckCircle2, { className: "h-12 w-12 text-[#E0872B]" }) }), _jsxs("div", { children: [_jsx("h2", { className: "mb-2 text-gray-900", children: "Th\u00E0nh c\u00F4ng!" }), _jsx("p", { className: "text-gray-600", children: "M\u1EADt kh\u1EA9u c\u1EE7a b\u1EA1n \u0111\u00E3 \u0111\u01B0\u1EE3c \u0111\u1ED5i th\u00E0nh c\u00F4ng. B\u1EA1n c\u00F3 th\u1EC3 \u0111\u0103ng nh\u1EADp b\u1EB1ng m\u1EADt kh\u1EA9u m\u1EDBi." })] })] }))] }) }) }));
}
