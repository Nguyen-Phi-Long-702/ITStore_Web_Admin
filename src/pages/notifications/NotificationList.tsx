import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Bell, CalendarClock, Plus, RefreshCw } from "lucide-react";
import { notificationService, NotificationItem } from "../../services/notificationService";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

function formatCreatedAt(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()} ${pad(
    date.getUTCHours(),
  )}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function getNotificationDate(item: NotificationItem) {
  return item.created_at || item.createdAt;
}

export function NotificationList() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications(page, limit);
      setItems(res.data);
      setTotal(res.total);
    } catch (err: any) {
      toast.error(err.message ?? "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  return (
    <div className="p-6 space-y-6">
      <Card className="border-orange-100 shadow-sm">
        <CardHeader className="pb-4 border-b border-orange-100">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#E0872B]">
                  <Bell className="h-5 w-5" />
                </span>
                Thông báo hệ thống
              </CardTitle>
              <p className="mt-2 text-sm text-gray-600">
                Danh sách thông báo loại system được lưu trong cơ sở dữ liệu.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Làm mới
              </Button>
              <Button asChild className="gap-2 bg-[#E0872B] text-white hover:bg-[#c97218]">
                <Link to="/notifications/new">
                  <Plus className="h-4 w-4" />
                  Thêm thông báo
                </Link>
              </Button>
            </div>
          </div>

          
        </CardHeader>

        <CardContent className="pt-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">Loại</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead className="w-[240px]">Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-gray-500">
                      Chưa có thông báo nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item._id ?? item.id} className="align-top">
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full bg-orange-100 text-[#E0872B]">
                          {item.type ?? "system"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 whitespace-normal">
                        {item.title}
                      </TableCell>
                      <TableCell className="whitespace-normal text-gray-600 leading-6">
                        <span className="line-clamp-2">{item.body}</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 font-mono whitespace-normal">
                        {formatCreatedAt(getNotificationDate(item))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-gray-500">
              Trang {page} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Số bản ghi</label>
              <select
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-[#E0872B]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || loading}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((current) => current + 1)}
                disabled={loading || page >= totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
