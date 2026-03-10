import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || "Đã xảy ra lỗi";
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "Đã xảy ra lỗi không xác định";
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <div className="space-y-2">
            {errorStatus && (
              <h1 className="text-6xl font-bold text-gray-900">{errorStatus}</h1>
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              Oops! Có lỗi xảy ra
            </h2>
            <p className="text-gray-600">{errorMessage}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" onClick={handleReload}>
              <button>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Tải lại trang
              </button>
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Link>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && error instanceof Error && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Chi tiết lỗi (Development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-48">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
