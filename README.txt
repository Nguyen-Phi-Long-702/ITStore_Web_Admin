================================================================================
                        WEBADMIN - HỆ THỐNG QUẢN TRỊ
                        Quản lý linh kiện điện tử (IT Store)
================================================================================

MỤC LỤC
--------
1. Tổng quan dự án
2. Công nghệ sử dụng
3. Cài đặt và chạy dự án
4. Cấu trúc thư mục
5. Các chức năng của hệ thống
6. Thông tin tài khoản

================================================================================
1. TỔNG QUAN DỰ ÁN
================================================================================

WebAdmin là ứng dụng web quản trị dành cho cửa hàng IT Store, chuyên quản lý
linh kiện điện tử. Hệ thống cung cấp giao diện để quản trị viên (admin) theo
dõi và điều hành toàn bộ hoạt động kinh doanh bao gồm: sản phẩm, đơn hàng,
khách hàng, khuyến mãi, trả hàng, banner, thương hiệu, danh mục, thông báo,
thanh toán và báo cáo thống kê.

Hệ thống chỉ cho phép tài khoản có role "admin" đăng nhập. Tài khoản không có
quyền admin sẽ nhận thông báo lỗi "Tài khoản không có quyền truy cập hệ thống".

Token xác thực (access token và refresh token) được lưu tại localStorage với
các key: auth_access_token, auth_refresh_token, auth_user. Khi tải lại trang,
hệ thống gọi API /api/users/me để xác thực lại session. Khi access token hết
hạn (lỗi 401), hệ thống tự động refresh token, xử lý hàng đợi (queue) các
request đang chờ để tránh gọi refresh song song. Nếu refresh thất bại (bao
gồm thử lại lần 2 sau 600ms), hệ thống xóa token và redirect về /login. Mỗi
request có timeout 30 giây.

================================================================================
2. CÔNG NGHỆ SỬ DỤNG
================================================================================

Frontend Framework:
  - React 18.3.1 (khai báo là peerDependency)
  - TypeScript 5.x
  - Vite 6.3.5 (Build tool & Dev server)

Routing:
  - React Router 7.13.0 (sử dụng createBrowserRouter)

UI Components:
  - Radix UI: Alert Dialog, Dialog, Dropdown Menu, Label, Select, Slot,
    Switch, Tabs, Tooltip
  - Lucide React 0.487.0 (icon library)
  - Tailwind CSS 4.1.12 (tích hợp qua @tailwindcss/vite plugin)

Biểu đồ:
  - Recharts 2.15.2 (LineChart, PieChart)

Tiện ích:
  - class-variance-authority 0.7.1
  - clsx 2.1.1
  - tailwind-merge 3.2.0
  - tw-animate-css 1.3.8
  - next-themes 0.4.6
  - sonner 2.0.3 (Toast notifications)

Package Manager:
  - pnpm

Build (Vite manual chunks):
  - recharts  → chunk: charts-vendor
  - @radix-ui → chunk: radix-vendor
  - lucide-react → chunk: icons-vendor

================================================================================
3. CÀI ĐẶT VÀ CHẠY DỰ ÁN
================================================================================

Yêu cầu:
  - Node.js >= 18
  - pnpm >= 8
  - Backend server IT Store đang chạy tại http://localhost:3000

Các bước cài đặt:

  1. Cài đặt dependencies:
       pnpm install

  2. Chạy môi trường development:
       pnpm run dev

  3. Mở trình duyệt tại:
       http://localhost:5173

  4. Build production (nếu cần):
       pnpm run build

URL của backend API được khai báo trong:

    src/lib/api.ts  →  BASE_URL = "http://localhost:3000"

Đổi giá trị này nếu backend chạy ở địa chỉ khác.

================================================================================
4. CẤU TRÚC THƯ MỤC
================================================================================

WebAdmin/
├── src/
│   ├── App.tsx                  # Component gốc, khởi tạo RouterProvider
│   ├── main.tsx                 # Entry point
│   ├── routes.tsx               # Định nghĩa tất cả các route
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── RootLayout.tsx         # Layout gốc (bọc AuthProvider,
│   │   │   │                            DataProvider, Toaster)
│   │   │   └── DashboardLayout.tsx    # Sidebar điều hướng, bảo vệ route
│   │   │                               (redirect về /login nếu chưa đăng
│   │   │                               nhập), hiển thị badge đơn chờ và
│   │   │                               trả hàng chờ xử lý
│   │   ├── ui/                        # UI components tái sử dụng:
│   │   │   │                            alert-dialog, badge, button, card,
│   │   │   │                            dialog, dropdown-menu, input, label,
│   │   │   │                            select, sonner, switch, table, tabs,
│   │   │   │                            textarea, tooltip, utils
│   │   ├── products/
│   │   │   └── ColorSwatch.tsx        # Hiển thị màu sắc biến thể
│   │   ├── returns/
│   │   │   └── ReturnConditionBadge.tsx  # Badge tình trạng hàng trả
│   │   └── ErrorBoundary.tsx          # Bắt lỗi React, hiển thị UI fallback
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Xác thực & phân quyền (login, logout,
│   │   │                          updateUser, changePassword)
│   │   └── DataContext.tsx      # Dữ liệu toàn cục: products, categories,
│   │                              brands, orders, customers, coupons,
│   │                              productVariants, productImages,
│   │                              stockMovements, returnRequests + CRUD
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Reports.tsx
│   │   ├── Account.tsx
│   │   ├── products/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductVariantsView.tsx
│   │   │   └── Stock.tsx
│   │   ├── orders/
│   │   │   ├── OrderList.tsx
│   │   │   └── OrderDetail.tsx
│   │   ├── users/
│   │   │   ├── CustomerList.tsx
│   │   │   └── CustomerDetail.tsx
│   │   ├── Coupon/
│   │   │   ├── CouponList.tsx
│   │   │   └── CouponForm.tsx
│   │   ├── notifications/
│   │   │   ├── NotificationList.tsx
│   │   │   └── NotificationForm.tsx
│   │   ├── returns/
│   │   │   ├── ReturnList.tsx
│   │   │   └── ReturnDetail.tsx
│   │   ├── brands/
│   │   │   └── BrandList.tsx
│   │   ├── categories/
│   │   │   └── CategoryList.tsx
│   │   ├── banners/
│   │   │   └── BannerList.tsx
│   │   └── payments/
│   │       └── PaymentList.tsx
│   ├── services/                # Gọi API backend
│   │   ├── productService.ts    # Sản phẩm, biến thể, ảnh, tồn kho
│   │   ├── orderService.ts      # Đơn hàng
│   │   ├── customerService.ts   # Khách hàng
│   │   ├── couponService.ts     # Mã giảm giá
│   │   ├── categoryService.ts   # Danh mục
│   │   ├── brandService.ts      # Thương hiệu
│   │   ├── bannerService.ts     # Banner
│   │   ├── notificationService.ts  # Thông báo
│   │   ├── returnService.ts     # Yêu cầu trả hàng
│   │   └── paymentService.ts    # Lịch sử thanh toán
│   ├── types/
│   │   └── index.ts             # Toàn bộ TypeScript type/interface
│   ├── lib/
│   │   └── api.ts               # HTTP client (fetch wrapper, auto refresh
│   │                              token, timeout 30s, queue retry, 
│   │                              unwrapList, unwrapData)
│   ├── utils/
│   │   ├── statusUtils.ts       # Config nhãn & màu trạng thái đơn hàng
│   │   │                          (pending/confirmed/preparing/packed/
│   │   │                          shipping/delivered/failed/cancelled/
│   │   │                          received), sản phẩm (available/
│   │   │                          out_of_stock/discontinued), thanh toán
│   │   │                          (unpaid/paid/refunded), gateway payment
│   │   │                          (pending/success/failed/refunded);
│   │   │                          paymentMethodLabels (cod/momo/
│   │   │                          bank_transfer);
│   │   │                          formatCurrency, formatDate, formatDateOnly
│   │   └── slugUtils.ts         # generateSlug (sinh slug từ tên)
│   └── styles/
│       ├── index.css
│       ├── tailwind.css
│       ├── theme.css
│       └── fonts.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml

================================================================================
5. CÁC CHỨC NĂNG CỦA HỆ THỐNG
================================================================================

--- 5.1. ĐĂNG NHẬP (/login) ---

- Nhập email và mật khẩu để đăng nhập.
- Chỉ tài khoản role "admin" mới được phép vào. Nếu đăng nhập thành công
  nhưng role khác "admin", hiển thị toast lỗi "Tài khoản không có quyền
  truy cập hệ thống".
- Nếu email/mật khẩu sai hiển thị "Email hoặc mật khẩu không đúng".
- Sau khi đăng nhập thành công, chuyển hướng về trang đã truy cập trước
  đó (hoặc về "/").
- Các route trong DashboardLayout được bảo vệ: chưa đăng nhập sẽ tự động
  redirect về /login kèm state {from: location}.

--- 5.2. DASHBOARD (/) ---

2 thẻ thống kê của tuần hiện tại (Thứ Hai đến Chủ Nhật):
  - Doanh thu tuần này (chỉ tính đơn payment_status="paid" VÀ
    order_status="delivered" hoặc "received")
  - Đơn hàng tuần này (tổng số đơn trong tuần)

Biểu đồ và danh sách:
  - Biểu đồ đường (Line Chart - Recharts): Doanh thu tuần này theo từng
    ngày trong tuần (7 điểm dữ liệu, trục X hiển thị thứ + ngày/tháng,
    trục Y rút gọn: k/tr/tỷ).
  - Danh sách 5 đơn hàng gần đây nhất trong tuần (mã đơn DH000001...,
    tên khách hàng, tổng tiền, trạng thái). Mỗi mã đơn có thể nhấn vào
    để vào chi tiết đơn.
  - Cảnh báo tồn kho thấp: liệt kê các biến thể có tồn kho > 0 và < 10,
    hiển thị ảnh biến thể, tên sản phẩm, SKU, phiên bản, màu, tồn kho
    hiện tại. Có nút "Quản lý kho" dẫn tới /products/stock.

Dữ liệu gọi trực tiếp từ orderService.getByDateRange và
productService.getLowStock(10), không qua DataContext.

--- 5.3. QUẢN LÝ SẢN PHẨM (/products) ---

Danh sách sản phẩm:
  - Bộ lọc: tìm theo tên hoặc SKU; lọc theo trạng thái (Tất cả / Đang
    kinh doanh / Hết hàng / Ngừng kinh doanh); lọc theo danh mục; lọc
    theo thương hiệu.
  - Thay đổi bộ lọc tự động reset về trang 1.
  - Bảng hiển thị: ảnh thumbnail, tên sản phẩm, SKU, số biến thể, danh
    mục, thương hiệu, giá bán (min – max nếu khác nhau), trạng thái.
  - Phân trang: 20 sản phẩm/trang, điều hướng Trước/Sau, hiển thị
    khoảng "x - y của tổng".
  - Thao tác: Xem biến thể (/products/variants/:id), Chỉnh sửa
    (/products/edit/:id), Xóa (có AlertDialog xác nhận).

Thêm/Chỉnh sửa sản phẩm (/products/new, /products/edit/:id):
  - Thông tin cơ bản: Tên sản phẩm (*), Danh mục (*), Thương hiệu (*),
    Mô tả, Thông số kỹ thuật dạng key-value (không bắt buộc, được lưu
    dưới dạng JSON object).
  - Hình ảnh sản phẩm: Tối đa 8 ảnh (MAX_PRODUCT_IMAGES = 8). Nhấn ★
    để đặt ảnh đại diện (primary). Có thể xóa từng ảnh.
  - Biến thể sản phẩm: Mỗi biến thể gồm SKU (*), Phiên bản, Màu sắc,
    Giá bán (*), Giá gốc (so sánh), Số lượng tồn (*), Ảnh biến thể
    (bắt buộc khi tạo mới).
    Không được trùng SKU, không được trùng cặp (phiên bản + màu sắc).
    Phải có ít nhất 1 biến thể.
  - Trạng thái: available / out_of_stock / discontinued.

Xem biến thể (/products/variants/:id):
  - 4 thẻ thống kê: Tổng biến thể, Tổng tồn kho, Giá trị kho (tồn kho ×
    giá bán), Số màu sắc.
  - Bảng liệt kê tất cả biến thể: SKU, màu sắc, phiên bản, giá bán, giá
    gốc, tồn kho (tô đỏ < 10, tô vàng < 20), trạng thái hoạt động.
  - Cập nhật tồn kho: nhấn nút chỉnh sửa từng biến thể, nhập số thay đổi
    (dương = nhập hàng, âm = xuất hàng), xác nhận qua Dialog.

Quản lý kho (/products/stock):
  - Phân trang sản phẩm: 10 sản phẩm/trang (PAGE_LIMIT = 10), điều hướng
    bằng nút ChevronLeft/ChevronRight.
  - Banner cảnh báo đỏ hiển thị nếu có biến thể tồn kho > 0 và < 10
    (lấy từ productService.getLowStock(10)).
  - Bảng tồn kho theo từng biến thể: tên sản phẩm, SKU, màu sắc
    (ColorSwatch), phiên bản, giá bán, tồn kho, trạng thái kho (Hết hàng
    / Cần nhập (< 10) / Sắp hết (< 20) / Đủ hàng (>= 20)).
  - Nhập hàng vào kho qua Dialog: chọn sản phẩm từ danh sách trang hiện
    tại, chọn biến thể (Select), nhập số lượng và ghi chú. Hiển thị tồn
    kho hiện tại và tồn kho sau khi nhập.

--- 5.4. QUẢN LÝ ĐƠN HÀNG (/orders) ---

Danh sách đơn hàng:
  - 4 thẻ tóm tắt: Chờ xác nhận (pending), Đang xử lý (confirmed +
    preparing), Đang giao (shipping), Hoàn thành (delivered + received).
  - Bộ lọc: tìm kiếm theo mã đơn (DH...) hoặc tên khách hàng; lọc theo
    trạng thái đơn hàng (pending / confirmed / preparing / packed /
    shipping / delivered / failed / cancelled); lọc theo trạng thái thanh
    toán (pending / paid / refunded / failed). Lọc "delivered" cũng khớp
    với "received".
  - Bảng hiển thị: mã đơn (DH000001...), tên khách hàng, số điện thoại,
    tổng tiền, trạng thái thanh toán (Badge), trạng thái đơn hàng (Badge),
    ngày đặt. Nút "Chi tiết" dẫn tới /orders/:id.

Chi tiết đơn hàng (/orders/:id):
  - Timeline tiến trình: Chờ xác nhận → Đã xác nhận → Đang chuẩn bị →
    Đã đóng gói → Đang giao → Hoàn thành.
  - Danh sách sản phẩm đã đặt: ảnh, tên, SKU, đơn giá, số lượng, thành
    tiền.
  - Tóm tắt chi phí: tạm tính, phí vận chuyển, giảm giá (nếu có), tổng
    cộng.
  - Thông tin khách hàng và địa chỉ giao hàng: tên người nhận, số điện
    thoại, địa chỉ (đường, phường/xã, quận/huyện, tỉnh/thành), ghi chú.
  - Cập nhật trạng thái: nút chỉ xuất hiện đúng với trạng thái hiện tại
    (Xác nhận / Chuẩn bị / Đóng gói / Giao vận / Hoàn thành). Gọi API
    PATCH /api/admin/orders/:id/status.
  - Hủy đơn: có thể hủy khi đơn chưa ở trạng thái delivered/received/
    cancelled/failed. Mở Dialog yêu cầu nhập lý do hủy. Gọi API
    PATCH /api/admin/orders/:id/cancel.
  - Thông tin thanh toán: phương thức (COD / Ví MoMo / Chuyển khoản
    ngân hàng) và trạng thái thanh toán.
  - Lịch sử trạng thái (timeline từ order.status_logs): trạng thái mới,
    thời gian, ghi chú, người thực hiện.
  - In phiếu giao hàng: nhấn nút "In phiếu", trình duyệt mở cửa sổ in
    (khổ A6), gồm thông tin người nhận, danh sách sản phẩm, tổng tiền,
    ô chữ ký người nhận.
  - Nếu đơn hàng có yêu cầu trả hàng, hiển thị nút "Xem yêu cầu trả
    hàng" dẫn tới /returns/:returnId.

--- 5.5. QUẢN LÝ KHÁCH HÀNG (/customers) ---

Danh sách khách hàng:
  - 3 thẻ tóm tắt: Tổng khách hàng, Đang hoạt động (is_active=true),
    Đã khóa (is_active=false).
  - Tìm kiếm theo mã KH (customer_code), tên, email hoặc số điện thoại.
  - Bảng hiển thị: mã KH (customer_code hoặc KH000001...), ảnh đại diện,
    tên, số điện thoại, email, số đơn hàng (payment_status="paid" hoặc
    order_status="delivered"), tổng chi tiêu, trạng thái xác thực email
    (is_verified), trạng thái tài khoản (Hoạt động / Vô hiệu).
  - Thao tác: Xem chi tiết (/customers/:id), Vô hiệu hóa / Kích hoạt
    (gọi PATCH /api/admin/users/:id/status, có AlertDialog xác nhận).

Chi tiết khách hàng (/customers/:id):
  - Thông tin cá nhân: ảnh đại diện, họ tên, ID, email, số điện thoại,
    ngày sinh (nếu có), giới tính (nếu có: Nam/Nữ/Khác), ngày tham gia.
  - Trạng thái tài khoản: xác thực email (is_verified), trạng thái hoạt
    động (is_active).
  - Danh sách địa chỉ: hiển thị tất cả địa chỉ (recipient, phone_number,
    street, ward, district, province), đánh dấu địa chỉ mặc định
    (is_default) bằng Badge "Mặc định".

--- 5.6. QUẢN LÝ KHUYẾN MÃI (/coupon) ---

Danh sách mã giảm giá:
  - 3 thẻ tóm tắt: số mã đang chạy, tổng lượt đã sử dụng, tổng lượt
    còn khả dụng (của các mã đang chạy có max_uses > 0).
  - Tìm kiếm theo mã giảm giá (code).
  - Sắp xếp: Đang chạy (0) → Tạm dừng (1) → Đã hết lượt (2) → Đã hết
    hạn (3). Trong cùng nhóm, sắp xếp theo ngày tạo mới nhất.
  - Bảng hiển thị: mã (font-mono), loại giảm giá (Phần trăm / Cố định),
    giá trị (% hoặc VNĐ), đơn tối thiểu, số lượt sử dụng/tối đa (kèm
    thanh tiến trình nếu có max_uses), ngày hết hạn (hoặc "Không giới
    hạn"), trạng thái (Đang chạy / Tạm dừng / Đã hết lượt / Đã hết hạn).
  - Thao tác: Chỉnh sửa (/coupon/edit/:id), Xóa (có AlertDialog xác nhận).

Tạo/Chỉnh sửa mã giảm giá (/coupon/new, /coupon/edit/:id):
  - Thông tin cơ bản: Mã giảm giá (*) (tự động chuyển thành chữ hoa khi
    nhập), Loại giảm giá (Giảm theo phần trăm % / Giảm cố định VNĐ),
    Giá trị (*), Giá trị đơn tối thiểu (min_order_value).
  - Thời gian và giới hạn: Ngày hết hạn (datetime-local), Giới hạn số
    lần sử dụng (max_uses).
  - Trạng thái: Đang chạy (is_active=true) / Tạm dừng (is_active=false).
  - Xem trước coupon (card bên phải): hiển thị khi discount_value > 0,
    gồm mã, giá trị giảm, đơn tối thiểu (nếu có).
  - Sau khi lưu, chuyển về /coupon.

--- 5.7. QUẢN LÝ THÔNG BÁO (/notifications) ---

Danh sách thông báo:
  - Bảng hiển thị: tiêu đề (title), nội dung (body, rút gọn 2 dòng
    line-clamp-2), ngày tạo (UTC, format dd/mm/yyyy HH:MM:SS).
  - Phân trang phía client: chọn số bản ghi hiển thị (5 / 10 / 20),
    điều hướng Trước/Sau, hiển thị "Trang x / y".
  - Gọi API: GET /api/admin/notifications?page=&limit=.
  - Nút "Làm mới" để tải lại dữ liệu.
  - Nút "Thêm thông báo" dẫn tới /notifications/new.

Tạo thông báo (/notifications/new):
  - Form gồm: Tiêu đề (*), Nội dung (*) (Textarea).
  - Gọi API: POST /api/admin/notifications với body {title, body}.
  - Sau khi gửi thành công, chuyển về /notifications.

--- 5.8. QUẢN LÝ TRẢ HÀNG (/returns) ---

Danh sách yêu cầu trả hàng:
  - 4 thẻ tóm tắt: Tổng yêu cầu, Chờ duyệt (pending), Đã chấp nhận
    (approved), Hoàn thành (completed).
  - Tìm kiếm theo mã yêu cầu (YC000001...) hoặc mã đơn hàng (DH000001...)
    hoặc tên khách hàng.
  - Lọc theo trạng thái: Tất cả / Chờ duyệt / Đã chấp nhận / Từ chối /
    Đã nhận hàng / Hoàn thành.
  - Sắp xếp: theo ngày tạo (mới nhất trước) hoặc theo số tiền hoàn
    (giảm dần).
  - Bảng hiển thị: mã yêu cầu (YC...), mã đơn hàng (DH..., có thể nhấn
    vào để vào /orders/:id), tên khách hàng, lý do + số sản phẩm + số
    ảnh, số tiền hoàn, trạng thái (Badge), ngày tạo.
  - Nút "Chi tiết" dẫn tới /returns/:id.

Chi tiết yêu cầu trả hàng (/returns/:id):
  - Thông tin yêu cầu: mã yêu cầu, mã đơn hàng (link tới /orders/:id),
    ngày tạo, trạng thái, lý do trả hàng, ghi chú của admin (nếu có).
  - Danh sách sản phẩm yêu cầu trả: ảnh, tên, SKU, màu sắc, phiên bản,
    đơn giá, số lượng trả/tổng, tình trạng hàng (ReturnConditionBadge:
    good / damaged / wrong_item), thành tiền. Tổng giá trị trả hàng ở
    cuối bảng.
  - Hình ảnh chứng minh: hiển thị dạng lưới, nhấn để xem phóng to (mở
    tab mới).
  - Thông tin khách hàng: tên, số điện thoại, email.
  - Xử lý yêu cầu theo trạng thái hiện tại:
      + pending:  Chấp nhận (ghi chú admin tùy chọn, gọi PATCH
                  /api/admin/return-requests/:id/approve) hoặc Từ chối
                  (bắt buộc nhập lý do, gọi PATCH .../reject).
      + approved: Xác nhận đã nhận hàng (gọi PATCH .../received).
      + received: Hoàn thành hoàn tiền (gọi PATCH .../refund).
      + rejected / completed: Hiển thị thông báo trạng thái cuối.
  - Lịch sử xử lý: timeline các mốc dựa trên status_logs.

--- 5.9. BÁO CÁO & THỐNG KÊ (/reports) ---

Bộ lọc thời gian (Select góc trên phải):
  - 7 ngày qua (week)
  - 30 ngày qua (month)
  - Quý này (quarter – 90 ngày)
  - Năm nay (year – 365 ngày)

3 thẻ KPI:
  - Tổng doanh thu (payment_status="paid" VÀ order_status="delivered"
    hoặc "received")
  - Đơn hàng (tổng đơn hợp lệ: delivered, hoặc paid và không bị
    cancelled/failed)
  - Giá trị TB/Đơn (tổng doanh thu / số đơn hàng hợp lệ)

2 biểu đồ song song (Recharts):
  - Xu hướng doanh thu (Line Chart):
      + week/month: theo ngày (dd/mm)
      + quarter: theo tuần (Tuần 1, Tuần 2, ...)
      + year: theo tháng (mm/yyyy)
  - Phân bổ trạng thái đơn hàng (Pie Chart): Hoàn thành (delivered),
    Đang giao (shipping), Đang xử lý (pending + confirmed + preparing +
    packed), Đã hủy (cancelled).

Bảng sản phẩm sắp hết hàng:
  - Lấy từ productService.getLowStock(10), không phụ thuộc timeRange.
  - Hiển thị tất cả biến thể tồn kho > 0 và < 10.
  - Cột: SKU, tên sản phẩm + phiên bản/màu, tồn kho (tô đỏ).

--- 5.10. QUẢN LÝ THƯƠNG HIỆU (/brands) ---

  - 2 thẻ tóm tắt: Tổng thương hiệu, Tổng sản phẩm.
  - Tìm kiếm theo tên hoặc mã thương hiệu (brand_code).
  - Bảng hiển thị: mã thương hiệu, tên, logo (ảnh thumbnail), số sản
    phẩm thuộc thương hiệu.
  - Thêm thương hiệu (Dialog): nhập tên (*), upload file logo từ máy
    tính (*bắt buộc khi tạo mới, tối đa 2MB). Upload qua FormData tới
    POST /api/admin/brands.
  - Chỉnh sửa thương hiệu (Dialog): cập nhật tên, logo (không bắt buộc
    khi chỉnh sửa). Gọi PUT /api/admin/brands/:id.
  - Xóa: có AlertDialog xác nhận.

--- 5.11. QUẢN LÝ DANH MỤC (/categories) ---

  - 2 thẻ tóm tắt: Tổng danh mục, Tổng sản phẩm.
  - Tìm kiếm theo tên hoặc mã danh mục (category_code).
  - Bảng hiển thị: mã danh mục, tên, số sản phẩm thuộc danh mục.
  - Thêm danh mục (Dialog): nhập tên (*), chọn danh mục cha (không bắt
    buộc), nhập mô tả. Slug tự động sinh từ tên qua generateSlug. Gọi
    POST /api/admin/categories. API trả cây phân cấp, service tự làm
    phẳng (flattenTree).
  - Chỉnh sửa danh mục (Dialog): cập nhật tên, danh mục cha, mô tả.
    Slug tự động cập nhật theo tên mới.
  - Xóa: nếu danh mục còn sản phẩm, backend trả lỗi và hiển thị toast
    thông báo rõ ràng. Có AlertDialog xác nhận trước khi xóa.

--- 5.12. QUẢN LÝ BANNER (/banners) ---

  - Bộ lọc: sắp xếp theo sort_order tăng dần/giảm dần; lọc theo trạng
    thái (Tất cả / Đang hoạt động / Đã ẩn).
  - Bảng hiển thị: thứ tự (sort_order), hình ảnh (thumbnail), đường dẫn
    liên kết (link_url), ngày hết hạn (end_date), trạng thái (Toggle
    Switch + Badge).
  - Bật/tắt hiển thị banner trực tiếp qua Switch (cập nhật is_active).
  - Thêm banner (Dialog): upload ảnh (*), đường dẫn liên kết (không bắt
    buộc), ngày hết hạn, thứ tự (sort_order), trạng thái hiển thị. Gọi
    POST /api/admin/banners qua FormData.
  - Chỉnh sửa banner (Dialog): thay ảnh, cập nhật link, sort_order, ngày
    hết hạn, trạng thái. Gọi PUT /api/admin/banners/:id.
  - Xóa: có AlertDialog xác nhận.

--- 5.13. LỊCH SỬ THANH TOÁN (/payments) ---

  - 4 thẻ tóm tắt (tính trên dữ liệu trang hiện tại): Tổng giao dịch,
    Thành công (success), Chờ xử lý (pending), Thất bại/Hoàn tiền
    (failed + refunded).
  - Bộ lọc: tìm theo User ID (nhập số nguyên); lọc theo trạng thái
    (pending / success / failed / refunded); lọc theo phương thức
    (COD / Chuyển khoản). Thay đổi bộ lọc tự động reset về trang 1.
  - Bảng hiển thị: mã giao dịch (transaction_id), mã đơn hàng (link tới
    /orders/:id), tên và email khách hàng, số tiền, phương thức, trạng
    thái (Badge), ngày tạo, ngày thanh toán (paid_at).
  - Phân trang: 10 bản ghi/trang, điều hướng Trước/Sau, hiển thị trang
    hiện tại / tổng trang. Gọi GET /api/admin/payments với params:
    page, limit, payment_status, method, user_id.

--- 5.14. TÀI KHOẢN CỦA TÔI (/account) ---

  - Hiển thị thông tin: ảnh đại diện, họ tên (full_name), username,
    role (hiển thị "Quản trị viên"), ID.
  - Thông tin chi tiết: họ tên (có thể sửa), email (chỉ đọc), số điện
    thoại (có thể sửa), địa chỉ (chỉ đọc, lấy từ API
    GET /api/users/me/addresses, hiển thị địa chỉ mặc định hoặc địa chỉ
    đầu tiên).
  - Chỉnh sửa thông tin: cập nhật full_name và phone_number. Gọi API
    PUT /api/users/me.
  - Cập nhật ảnh đại diện: khi ở chế độ chỉnh sửa, nhấn vào ảnh để mở
    file picker, chọn file ảnh (tối đa 5MB). Gọi PATCH
    /api/users/me/avatar qua FormData. Có thể xóa ảnh đại diện.
  - Đổi mật khẩu (Dialog): nhập mật khẩu cũ, mật khẩu mới (tối thiểu
    8 ký tự), xác nhận mật khẩu mới. Mật khẩu mới không được trùng mật
    khẩu cũ. Mỗi trường có nút Eye/EyeOff để hiện/ẩn mật khẩu. Gọi API
    POST /api/auth/reset-password-user với body {old_password,
    new_password}.

================================================================================
6. THÔNG TIN TÀI KHOẢN
================================================================================

Hệ thống chỉ chấp nhận đăng nhập với tài khoản có role "admin".
Thông tin tài khoản (email, mật khẩu) được cấu hình và quản lý tại backend.

================================================================================
                              IT Store Admin Panel
                              Version: 0.0.1
================================================================================
