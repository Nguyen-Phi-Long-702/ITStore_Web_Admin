import { useState, useEffect } from "react";
import { Save, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { toast } from "sonner";
import { useData } from "../contexts/DataContext";

export function SystemConfig() {
  const { systemConfig, updateSystemConfig } = useData();

  const [paymentConfig, setPaymentConfig] = useState(
    systemConfig.paymentConfig,
  );
  const [shippingConfig, setShippingConfig] = useState(
    systemConfig.shippingConfig,
  );
  const [bankInfo, setBankInfo] = useState(systemConfig.bankInfo);
  const [banners, setBanners] = useState(systemConfig.banners);
  const [notificationTemplates, setNotificationTemplates] = useState(
    systemConfig.notificationTemplates,
  );
  const [lastSyncedConfig, setLastSyncedConfig] = useState(systemConfig);

  useEffect(() => {
    const hasUnsavedChanges =
      JSON.stringify(paymentConfig) !==
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cấu hình hệ thống</h2>
        <p className="text-gray-600">
          Thiết lập các tham số và cấu hình cho hệ thống
        </p>
      </div>

      <Tabs defaultValue="payment">
        <TabsList>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
          <TabsTrigger value="banners">Banner</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thanh toán khi nhận hàng (COD)</Label>
                  <p className="text-sm text-gray-600">
                    Cho phép khách hàng thanh toán khi nhận hàng
                  </p>
                </div>
                <Switch
                  checked={paymentConfig.codEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentConfig({ ...paymentConfig, codEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Chuyển khoản ngân hàng</Label>
                  <p className="text-sm text-gray-600">
                    Thanh toán qua chuyển khoản ngân hàng
                  </p>
                </div>
                <Switch
                  checked={paymentConfig.bankTransferEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentConfig({
                      ...paymentConfig,
                      bankTransferEnabled: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Thẻ tín dụng / Ghi nợ</Label>
                  <p className="text-sm text-gray-600">
                    Thanh toán bằng thẻ quốc tế
                  </p>
                </div>
                <Switch
                  checked={paymentConfig.creditCardEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentConfig({
                      ...paymentConfig,
                      creditCardEnabled: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Ví MoMo</Label>
                  <p className="text-sm text-gray-600">
                    Thanh toán qua ví điện tử MoMo
                  </p>
                </div>
                <Switch
                  checked={paymentConfig.momoEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentConfig({ ...paymentConfig, momoEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>VNPay</Label>
                  <p className="text-sm text-gray-600">
                    Thanh toán qua cổng VNPay
                  </p>
                </div>
                <Switch
                  checked={paymentConfig.vnpayEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentConfig({
                      ...paymentConfig,
                      vnpayEnabled: checked,
                    })
                  }
                />
              </div>

              <div className="pt-4">
                <Button onClick={handleSavePayment}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin ngân hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bankName">Tên ngân hàng</Label>
                <Input
                  id="bankName"
                  value={bankInfo.bankName}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bankName: e.target.value })
                  }
                  placeholder="Tên ngân hàng"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Số tài khoản</Label>
                  <Input
                    id="accountNumber"
                    value={bankInfo.accountNumber}
                    onChange={(e) =>
                      setBankInfo({
                        ...bankInfo,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Số tài khoản"
                  />
                </div>

                <div>
                  <Label htmlFor="accountName">Tên tài khoản</Label>
                  <Input
                    id="accountName"
                    value={bankInfo.accountName}
                    onChange={(e) =>
                      setBankInfo({ ...bankInfo, accountName: e.target.value })
                    }
                    placeholder="Tên tài khoản"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={handleSaveBankInfo}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thông tin
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình phí vận chuyển</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="baseShippingFee">
                    Phí vận chuyển cơ bản (VNĐ)
                  </Label>
                  <Input
                    id="baseShippingFee"
                    type="number"
                    value={shippingConfig.baseShippingFee}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        baseShippingFee: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="freeShippingThreshold">
                    Miễn phí vận chuyển từ (VNĐ)
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={shippingConfig.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        freeShippingThreshold: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="distanceFeePerKm">
                    Phí theo khoảng cách (VNĐ/km)
                  </Label>
                  <Input
                    id="distanceFeePerKm"
                    type="number"
                    value={shippingConfig.distanceFeePerKm}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        distanceFeePerKm: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="urgentShippingFee">
                    Phí giao hàng nhanh (VNĐ)
                  </Label>
                  <Input
                    id="urgentShippingFee"
                    type="number"
                    value={shippingConfig.urgentShippingFee}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        urgentShippingFee: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveShipping}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quản lý Banner trang chủ</CardTitle>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Thêm banner
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="w-32 h-20 bg-gray-100 rounded flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={banner.title}
                      onChange={(e) => {
                        const newBanners = [...banners];
                        newBanners[index].title = e.target.value;
                        setBanners(newBanners);
                      }}
                      placeholder="Tiêu đề banner"
                    />
                  </div>
                  <Switch
                    checked={banner.active}
                    onCheckedChange={(checked) => {
                      const newBanners = [...banners];
                      newBanners[index].active = checked;
                      setBanners(newBanners);
                    }}
                  />
                </div>
              ))}

              <div className="pt-4">
                <Button onClick={handleSaveBanners}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình thông báo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orderNotification">
                  Thông báo đơn hàng mới
                </Label>
                <Textarea
                  id="orderNotification"
                  value={notificationTemplates.orderNotification}
                  onChange={(e) => {
                    const newTemplates = { ...notificationTemplates };
                    newTemplates.orderNotification = e.target.value;
                    setNotificationTemplates(newTemplates);
                  }}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="lowStockNotification">
                  Thông báo sắp hết hàng
                </Label>
                <Textarea
                  id="lowStockNotification"
                  value={notificationTemplates.lowStockNotification}
                  onChange={(e) => {
                    const newTemplates = { ...notificationTemplates };
                    newTemplates.lowStockNotification = e.target.value;
                    setNotificationTemplates(newTemplates);
                  }}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="shipmentNotification">
                  Thông báo giao hàng
                </Label>
                <Textarea
                  id="shipmentNotification"
                  value={notificationTemplates.shipmentNotification}
                  onChange={(e) => {
                    const newTemplates = { ...notificationTemplates };
                    newTemplates.shipmentNotification = e.target.value;
                    setNotificationTemplates(newTemplates);
                  }}
                  rows={3}
                />
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
