import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, User, Mail, Phone, MapPin, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../utils/statusUtils";
import { customerService } from "../../services/customerService";
import type { Customer } from "../../types";

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    customerService
      .getDetail(Number(id))
      .then((data) => setCustomer(data as any))
      .catch(() => setCustomer(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 border-4 border-[#E0872B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy khách hàng</p>
        <Button onClick={() => navigate("/customers")} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const genderLabel: Record<string, string> = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/customers")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết khách hàng</h2>
          <p className="text-gray-600">{customer.full_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                {(customer as any).avatar_url ? (
                  <img
                    src={(customer as any).avatar_url}
                    alt={customer.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#FFE0B2] flex items-center justify-center">
                    <User className="h-8 w-8 text-[#E0872B]" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-lg">{customer.full_name}</p>
                  <p className="text-sm text-gray-600">ID: #{customer.id}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-medium">{customer.phone_number || "-"}</p>
              </div>
              {customer.date_of_birth && (
                <div>
                  <p className="text-sm text-gray-600">Ngày sinh</p>
                  <p className="font-medium">{formatDate(customer.date_of_birth)}</p>
                </div>
              )}
              {customer.gender && (
                <div>
                  <p className="text-sm text-gray-600">Giới tính</p>
                  <p className="font-medium">{genderLabel[customer.gender] ?? "-"}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Ngày tham gia</p>
                <p className="font-medium">{formatDate(customer.created_at)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Xác thực email</p>
                <Badge
                  className={
                    customer.is_verified
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {customer.is_verified ? "Đã xác thực" : "Chưa xác thực"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <Badge
                  className={
                    customer.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {customer.is_active ? "Hoạt động" : "Vô hiệu"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Địa chỉ ({(customer as any).addresses?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(customer as any).addresses?.length > 0 ? (
                (customer as any).addresses.map((addr: any) => (
                  <div key={addr.id} className="space-y-1 border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{addr.recipient}</p>
                      {addr.is_default && (
                        <Badge className="bg-[#FFE0B2] text-[#E0872B]">
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{addr.phone_number}</p>
                    <p className="text-sm text-gray-600">
                      {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Chưa có địa chỉ</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}