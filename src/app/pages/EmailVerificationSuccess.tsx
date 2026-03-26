import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";

export function EmailVerificationSuccess() {
  const location = useLocation();
  const notificationTitle = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get("message")?.trim();

    if (message) {
      return message;
    }

    return searchParams.get("success") === "true"
      ? "Xác thực tài khoản thành công"
      : "Thông báo xác thực tài khoản";
  }, [location.search]);

  useEffect(() => {
    document.title = `${notificationTitle} | IT Store`;

    return () => {
      document.title = "IT Store";
    };
  }, [notificationTitle]);

  return (
    <iframe
      src={`/email-verification/index.html${location.search}`}
      title={notificationTitle}
      className="h-screen w-full border-0"
    />
  );
}
