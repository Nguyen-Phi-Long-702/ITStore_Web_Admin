import { useState } from "react";
import { useNavigate } from "react-router";
import { notificationService } from "../../services/notificationService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";

export function NotificationForm({ onCreated }: { onCreated?: () => void }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await notificationService.createNotification({ title, body });
      toast.success("Đã gửi thông báo");
      setTitle("");
      setBody("");
      onCreated && onCreated();
      navigate("/notifications", { replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Lỗi khi gửi thông báo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded bg-white">
      <h3 className="text-md font-medium mb-3">Tạo thông báo</h3>
      <div className="mb-3">
        <label className="block text-sm mb-1">Tiêu đề</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block text-sm mb-1">Nội dung</label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} required />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          Gửi
        </Button>
      </div>
    </form>
  );
}
