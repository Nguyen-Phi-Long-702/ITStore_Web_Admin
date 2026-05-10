import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Save, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "../components/ui/tabs";
import { toast } from "sonner";
import { useData } from "../contexts/DataContext";
export function SystemConfig() {
    const { systemConfig, updateSystemConfig } = useData();
    const [paymentConfig, setPaymentConfig] = useState(systemConfig.paymentConfig);
    const [shippingConfig, setShippingConfig] = useState(systemConfig.shippingConfig);
    const [bankInfo, setBankInfo] = useState(systemConfig.bankInfo);
    const [banners, setBanners] = useState(systemConfig.banners);
    const [notificationTemplates, setNotificationTemplates] = useState(systemConfig.notificationTemplates);
    const [lastSyncedConfig, setLastSyncedConfig] = useState(systemConfig);
    useEffect(() => {
        const hasUnsavedChanges = JSON.stringify(paymentConfig) !==
            JSON.stringify(lastSyncedConfig.paymentConfig) ||
            JSON.stringify(shippingConfig) !==
                JSON.stringify(lastSyncedConfig.shippingConfig) ||
            JSON.stringify(bankInfo) !== JSON.stringify(lastSyncedConfig.bankInfo) ||
            JSON.stringify(banners) !== JSON.stringify(lastSyncedConfig.banners) ||
            JSON.stringify(notificationTemplates) !==
                JSON.stringify(lastSyncedConfig.notificationTemplates);
        if (hasUnsavedChanges) {
            return;
        }
        setPaymentConfig(systemConfig.paymentConfig);
        setShippingConfig(systemConfig.shippingConfig);
        setBankInfo(systemConfig.bankInfo);
        setBanners(systemConfig.banners);
        setNotificationTemplates(systemConfig.notificationTemplates);
        setLastSyncedConfig(systemConfig);
    }, [
        systemConfig,
        paymentConfig,
        shippingConfig,
        bankInfo,
        banners,
        notificationTemplates,
        lastSyncedConfig,
    ]);
    const handleSavePayment = () => {
        updateSystemConfig({ paymentConfig });
        setLastSyncedConfig((prev) => ({ ...prev, paymentConfig }));
        toast.success("Đã lưu cấu hình phương thức thanh toán");
    };
    const handleSaveShipping = () => {
        updateSystemConfig({ shippingConfig });
        setLastSyncedConfig((prev) => ({ ...prev, shippingConfig }));
        toast.success("Đã lưu cấu hình phí vận chuyển");
    };
    const handleSaveBankInfo = () => {
        updateSystemConfig({ bankInfo });
        setLastSyncedConfig((prev) => ({ ...prev, bankInfo }));
        toast.success("Đã lưu thông tin ngân hàng");
    };
    const handleSaveBanners = () => {
        updateSystemConfig({ banners });
        setLastSyncedConfig((prev) => ({ ...prev, banners }));
        toast.success("Đã lưu cấu hình banner");
    };
    const handleSaveNotifications = () => {
        updateSystemConfig({ notificationTemplates });
        setLastSyncedConfig((prev) => ({ ...prev, notificationTemplates }));
        toast.success("Đã lưu cấu hình thông báo");
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "C\u1EA5u h\u00ECnh h\u1EC7 th\u1ED1ng" }), _jsx("p", { className: "text-gray-600", children: "Thi\u1EBFt l\u1EADp c\u00E1c tham s\u1ED1 v\u00E0 c\u1EA5u h\u00ECnh cho h\u1EC7 th\u1ED1ng" })] }), _jsxs(Tabs, { defaultValue: "payment", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "payment", children: "Thanh to\u00E1n" }), _jsx(TabsTrigger, { value: "shipping", children: "V\u1EADn chuy\u1EC3n" }), _jsx(TabsTrigger, { value: "banners", children: "Banner" }), _jsx(TabsTrigger, { value: "notifications", children: "Th\u00F4ng b\u00E1o" })] }), _jsxs(TabsContent, { value: "payment", className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Ph\u01B0\u01A1ng th\u1EE9c thanh to\u00E1n" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Thanh to\u00E1n khi nh\u1EADn h\u00E0ng (COD)" }), _jsx("p", { className: "text-sm text-gray-600", children: "Cho ph\u00E9p kh\u00E1ch h\u00E0ng thanh to\u00E1n khi nh\u1EADn h\u00E0ng" })] }), _jsx(Switch, { checked: paymentConfig.codEnabled, onCheckedChange: (checked) => setPaymentConfig({ ...paymentConfig, codEnabled: checked }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Chuy\u1EC3n kho\u1EA3n ng\u00E2n h\u00E0ng" }), _jsx("p", { className: "text-sm text-gray-600", children: "Thanh to\u00E1n qua chuy\u1EC3n kho\u1EA3n ng\u00E2n h\u00E0ng" })] }), _jsx(Switch, { checked: paymentConfig.bankTransferEnabled, onCheckedChange: (checked) => setPaymentConfig({
                                                            ...paymentConfig,
                                                            bankTransferEnabled: checked,
                                                        }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "Th\u1EBB t\u00EDn d\u1EE5ng / Ghi n\u1EE3" }), _jsx("p", { className: "text-sm text-gray-600", children: "Thanh to\u00E1n b\u1EB1ng th\u1EBB qu\u1ED1c t\u1EBF" })] }), _jsx(Switch, { checked: paymentConfig.creditCardEnabled, onCheckedChange: (checked) => setPaymentConfig({
                                                            ...paymentConfig,
                                                            creditCardEnabled: checked,
                                                        }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "V\u00ED MoMo" }), _jsx("p", { className: "text-sm text-gray-600", children: "Thanh to\u00E1n qua v\u00ED \u0111i\u1EC7n t\u1EED MoMo" })] }), _jsx(Switch, { checked: paymentConfig.momoEnabled, onCheckedChange: (checked) => setPaymentConfig({ ...paymentConfig, momoEnabled: checked }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Label, { children: "VNPay" }), _jsx("p", { className: "text-sm text-gray-600", children: "Thanh to\u00E1n qua c\u1ED5ng VNPay" })] }), _jsx(Switch, { checked: paymentConfig.vnpayEnabled, onCheckedChange: (checked) => setPaymentConfig({
                                                            ...paymentConfig,
                                                            vnpayEnabled: checked,
                                                        }) })] }), _jsx("div", { className: "pt-4", children: _jsxs(Button, { onClick: handleSavePayment, children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "L\u01B0u c\u1EA5u h\u00ECnh"] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Th\u00F4ng tin ng\u00E2n h\u00E0ng" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "bankName", children: "T\u00EAn ng\u00E2n h\u00E0ng" }), _jsx(Input, { id: "bankName", value: bankInfo.bankName, onChange: (e) => setBankInfo({ ...bankInfo, bankName: e.target.value }), placeholder: "T\u00EAn ng\u00E2n h\u00E0ng" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "accountNumber", children: "S\u1ED1 t\u00E0i kho\u1EA3n" }), _jsx(Input, { id: "accountNumber", value: bankInfo.accountNumber, onChange: (e) => setBankInfo({
                                                                    ...bankInfo,
                                                                    accountNumber: e.target.value,
                                                                }), placeholder: "S\u1ED1 t\u00E0i kho\u1EA3n" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "accountName", children: "T\u00EAn t\u00E0i kho\u1EA3n" }), _jsx(Input, { id: "accountName", value: bankInfo.accountName, onChange: (e) => setBankInfo({ ...bankInfo, accountName: e.target.value }), placeholder: "T\u00EAn t\u00E0i kho\u1EA3n" })] })] }), _jsx("div", { className: "pt-2", children: _jsxs(Button, { onClick: handleSaveBankInfo, children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "L\u01B0u th\u00F4ng tin"] }) })] })] })] }), _jsx(TabsContent, { value: "shipping", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "C\u1EA5u h\u00ECnh ph\u00ED v\u1EADn chuy\u1EC3n" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "baseShippingFee", children: "Ph\u00ED v\u1EADn chuy\u1EC3n c\u01A1 b\u1EA3n (VN\u0110)" }), _jsx(Input, { id: "baseShippingFee", type: "number", value: shippingConfig.baseShippingFee, onChange: (e) => setShippingConfig({
                                                                ...shippingConfig,
                                                                baseShippingFee: Number(e.target.value),
                                                            }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "freeShippingThreshold", children: "Mi\u1EC5n ph\u00ED v\u1EADn chuy\u1EC3n t\u1EEB (VN\u0110)" }), _jsx(Input, { id: "freeShippingThreshold", type: "number", value: shippingConfig.freeShippingThreshold, onChange: (e) => setShippingConfig({
                                                                ...shippingConfig,
                                                                freeShippingThreshold: Number(e.target.value),
                                                            }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "distanceFeePerKm", children: "Ph\u00ED theo kho\u1EA3ng c\u00E1ch (VN\u0110/km)" }), _jsx(Input, { id: "distanceFeePerKm", type: "number", value: shippingConfig.distanceFeePerKm, onChange: (e) => setShippingConfig({
                                                                ...shippingConfig,
                                                                distanceFeePerKm: Number(e.target.value),
                                                            }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "urgentShippingFee", children: "Ph\u00ED giao h\u00E0ng nhanh (VN\u0110)" }), _jsx(Input, { id: "urgentShippingFee", type: "number", value: shippingConfig.urgentShippingFee, onChange: (e) => setShippingConfig({
                                                                ...shippingConfig,
                                                                urgentShippingFee: Number(e.target.value),
                                                            }) })] })] }), _jsx("div", { className: "pt-4", children: _jsxs(Button, { onClick: handleSaveShipping, children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "L\u01B0u c\u1EA5u h\u00ECnh"] }) })] })] }) }), _jsx(TabsContent, { value: "banners", className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsx(CardTitle, { children: "Qu\u1EA3n l\u00FD Banner trang ch\u1EE7" }), _jsxs(Button, { size: "sm", children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "Th\u00EAm banner"] })] }), _jsxs(CardContent, { className: "space-y-4", children: [banners.map((banner, index) => (_jsxs("div", { className: "flex items-center gap-4 p-4 border rounded-lg", children: [_jsx("div", { className: "w-32 h-20 bg-gray-100 rounded flex items-center justify-center", children: _jsx(Upload, { className: "h-6 w-6 text-gray-400" }) }), _jsx("div", { className: "flex-1", children: _jsx(Input, { value: banner.title, onChange: (e) => {
                                                            const newBanners = [...banners];
                                                            newBanners[index].title = e.target.value;
                                                            setBanners(newBanners);
                                                        }, placeholder: "Ti\u00EAu \u0111\u1EC1 banner" }) }), _jsx(Switch, { checked: banner.active, onCheckedChange: (checked) => {
                                                        const newBanners = [...banners];
                                                        newBanners[index].active = checked;
                                                        setBanners(newBanners);
                                                    } })] }, banner.id))), _jsx("div", { className: "pt-4", children: _jsxs(Button, { onClick: handleSaveBanners, children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "L\u01B0u c\u1EA5u h\u00ECnh"] }) })] })] }) }), _jsx(TabsContent, { value: "notifications", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "C\u1EA5u h\u00ECnh th\u00F4ng b\u00E1o" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "orderNotification", children: "Th\u00F4ng b\u00E1o \u0111\u01A1n h\u00E0ng m\u1EDBi" }), _jsx(Textarea, { id: "orderNotification", value: notificationTemplates.orderNotification, onChange: (e) => {
                                                        const newTemplates = { ...notificationTemplates };
                                                        newTemplates.orderNotification = e.target.value;
                                                        setNotificationTemplates(newTemplates);
                                                    }, rows: 3 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "lowStockNotification", children: "Th\u00F4ng b\u00E1o s\u1EAFp h\u1EBFt h\u00E0ng" }), _jsx(Textarea, { id: "lowStockNotification", value: notificationTemplates.lowStockNotification, onChange: (e) => {
                                                        const newTemplates = { ...notificationTemplates };
                                                        newTemplates.lowStockNotification = e.target.value;
                                                        setNotificationTemplates(newTemplates);
                                                    }, rows: 3 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "shipmentNotification", children: "Th\u00F4ng b\u00E1o giao h\u00E0ng" }), _jsx(Textarea, { id: "shipmentNotification", value: notificationTemplates.shipmentNotification, onChange: (e) => {
                                                        const newTemplates = { ...notificationTemplates };
                                                        newTemplates.shipmentNotification = e.target.value;
                                                        setNotificationTemplates(newTemplates);
                                                    }, rows: 3 })] }), _jsx("div", { className: "pt-4", children: _jsxs(Button, { onClick: handleSaveNotifications, children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "L\u01B0u c\u1EA5u h\u00ECnh"] }) })] })] }) })] })] }));
}
