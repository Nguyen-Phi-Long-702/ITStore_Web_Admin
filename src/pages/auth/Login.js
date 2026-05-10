import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { LogIn, Mail, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const from = location.state?.from?.pathname || "/";
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        setIsLoading(true);
        try {
            const success = await login(email.trim(), password);
            if (success) {
                toast.success("Đăng nhập thành công!");
                navigate(from, { replace: true });
            }
            else {
                toast.error("Email hoặc mật khẩu không đúng");
            }
        }
        catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#FFE0B2] via-white to-[#FFE0B2] flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-[#E0872B] rounded-2xl mb-4", children: _jsx("span", { className: "text-2xl font-bold text-white", children: "EC" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "H\u1EC7 th\u1ED1ng qu\u1EA3n tr\u1ECB" }), _jsx("p", { className: "text-gray-600", children: "Qu\u1EA3n l\u00FD linh ki\u1EC7n \u0111i\u1EC7n t\u1EED" })] }), _jsxs(Card, { className: "shadow-xl", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(LogIn, { className: "h-5 w-5 text-[#E0872B]" }), "\u0110\u0103ng nh\u1EADp"] }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsxs("div", { className: "relative mt-1", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Nh\u1EADp email", className: "pl-10", disabled: isLoading, autoComplete: "email", autoFocus: true })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "password", children: "M\u1EADt kh\u1EA9u" }), _jsxs("div", { className: "relative mt-1", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u", className: "pl-10", disabled: isLoading, autoComplete: "current-password", onKeyDown: (e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e);
                                                            }
                                                        } })] })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" }), "\u0110ang \u0111\u0103ng nh\u1EADp..."] })) : (_jsxs(_Fragment, { children: [_jsx(LogIn, { className: "h-4 w-4 mr-2" }), "\u0110\u0103ng nh\u1EADp"] })) })] }) })] })] }) }));
}
