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
thanh toán, và báo cáo thống kê.

Hệ thống chỉ cho phép tài khoản có role "admin" đăng nhập. Các tài khoản
khách hàng thông thường không được phép truy cập.

Token xác thực (access token và refresh token) được lưu tại localStorage.
Khi access token hết hạn (lỗi 401), hệ thống tự động refresh token và thử lại
request, đồng thời xử lý cơ chế hàng đợi (queue) để tránh gọi refresh song
song. Nếu refresh thất bại, người dùng bị redirect về /login.

================================================================================
2. CÔNG NGHỆ SỬ DỤNG
================================================================================

Frontend Framework:
  - React 18.3.1 (Thư viện UI chính, khai báo là peerDependency)
  - TypeScript 5.x (Ngôn ngữ lập trình type-safe)
  - Vite 6.3.5 (Build tool & Dev server)

Routing:
  - React Router 7.13.0 (Điều hướng trang, sử dụng createBrowserRouter)

UI Components:
  - Radix UI (Alert Dialog, Dialog, Dropdown Menu, Label, Select, Slot,
    Switch, Tabs, Tooltip)
  - Lucide React 0.487.0 (Thư viện icon)
  - Tailwind CSS 4.1.12 (Styling, tích hợp qua @tailwindcss/vite plugin)

Biểu đồ:
  - Recharts 2.15.2 (Line Chart, Pie Chart, Bar Chart)

Tiện ích:
  - class-variance-authority 0.7.1 (quản lý biến thể class CSS)
  - clsx 2.1.1 (ghép class điều kiện)
  - tailwind-merge 3.2.0 (merge Tailwind class)
  - tw-animate-css 1.3.8 (animation utilities)
  - next-themes 0.4.6 (quản lý theme)
  - sonner 2.0.3 (Toast notifications)

Package Manager:
  - pnpm

Build:
  - Vite manual chunks: recharts → charts-vendor, @radix-ui → radix-vendor,
    lucide-react → icons-vendor

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

URL của backend API được khai báo trong:

    src/lib/api.ts  →  BASE_URL = "http://localhost:3000"

Đổi giá trị này nếu backend chạy ở địa chỉ khác.

Ghi chú:
  - Timeout mỗi request là 30 giây (TIMEOUT_MS = 30000).
  - Khi refresh token thất bại lần đầu, hệ thống tự thử lại sau 600ms
    (xử lý lỗi tạm thời như Redis connection idle timeout) trước khi từ bỏ.
  - Build production: pnpm run build

================================================================================
4. CẤU TRÚC THƯ MỤC
================================================================================

WebAdmin/
├── src/
│   ├── App.tsx                  # Component gốc, khởi tạo RouterProvider
│   ├── main.tsx                 # Entry point
│   ├── routes.tsx               # Định nghĩa tất cả các route (createBrowserRouter)
│   ├── components/              # Các component dùng chung
│   │   ├── layouts/
│   │   │   ├── RootLayout.tsx   # Layout gốc (AuthProvider + DataProvider + Toaster)
│   │   │   └── DashboardLayout.tsx  # Sidebar, topbar, bảo vệ route (redirect nếu chưa
│   │   │                            # đăng nhập), hiển thị badge đếm đơn chờ/trả hàng
│   │   ├── ui/                  # UI components (button, card, table, badge, input,
│   │   │   │                      select, dialog, alert-dialog, dropdown-menu,
│   │   │   │                      switch, tabs, tooltip, textarea, sonner, ...)
│   │   ├── products/
│   │   │   └── ColorSwatch.tsx  # Hiển thị màu sắc biến thể sản phẩm
│   │   ├── returns/
│   │   │   └── ReturnConditionBadge.tsx  # Badge tình trạng hàng trả
│   │   └── ErrorBoundary.tsx    # Bắt lỗi React, hiển thị UI fallback
│   ├── contexts/                # React Context
│   │   ├── AuthContext.tsx      # Xác thực & phân quyền (login, logout, updateUser,
│   │   │                          changePassword, refresh session khi tải lại trang)
│   │   └── DataContext.tsx      # Dữ liệu toàn cục (products, categories, brands,
│   │                              orders, customers, coupons, variants, images,
│   │                              stockMovements, returnRequests) + CRUD actions
│   ├── pages/                   # Các trang của ứng dụng
│   │   ├── auth/
│   │   │   └── Login.tsx        # Trang đăng nhập
│   │   ├── Dashboard.tsx        # Trang tổng quan
│   │   ├── Reports.tsx          # Báo cáo & thống kê
│   │   ├── Account.tsx          # Quản lý tài khoản admin
│   │   ├── products/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx  # Thêm / Chỉnh sửa sản phẩm
│   │   │   ├── ProductVariantsView.tsx
│   │   │   └── Stock.tsx        # Quản lý kho hàng
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
│   ├── services/                # Gọi API backend (mỗi module một file)
│   │   ├── productService.ts    # Sản phẩm, biến thể, ảnh, tồn kho
│   │   ├── orderService.ts      # Đơn hàng, cập nhật trạng thái, hủy đơn
│   │   ├── customerService.ts   # Khách hàng, kích hoạt/vô hiệu hóa
│   │   ├── couponService.ts     # Mã giảm giá
│   │   ├── categoryService.ts   # Danh mục (xử lý cây phân cấp)
│   │   ├── brandService.ts      # Thương hiệu (upload logo qua FormData)
│   │   ├── bannerService.ts     # Banner (upload ảnh qua FormData)
│   │   ├── notificationService.ts  # Thông báo đẩy
│   │   ├── returnService.ts     # Yêu cầu trả hàng
│   │   └── paymentService.ts    # Lịch sử thanh toán (có phân trang)
│   ├── types/
│   │   └── index.ts             # Toàn bộ TypeScript type/interface của dự án
│   ├── lib/
│   │   └── api.ts               # HTTP client (fetch wrapper, auto refresh token,
│   │                              timeout, queue retry, unwrapList, unwrapData)
│   ├── utils/
│   │   ├── statusUtils.ts       # Config nhãn & màu cho trạng thái đơn hàng, sản phẩm,
│   │   │                          thanh toán; formatCurrency, formatDate, formatDateOnly
│   │   └── slugUtils.ts         # Sinh slug từ tên (generateSlug)
│   └── styles/
│       ├── index.css            # Import gốc
│       ├── tailwind.css         # Tailwind directives
│       ├── theme.css            # CSS variables / design tokens
│       └── fonts.css            # Khai báo font chữ
├── index.html
├── vite.config.ts               # Vite config: React plugin, Tailwind plugin, alias @/
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml

================================================================================
5. CÁC CHỨC NĂNG CỦA HỆ THỐNG
================================================================================

--- 5.1. ĐĂNG NHẬP (/login) ---

- Trang đăng nhập bằng email và mật khẩu.
- Chỉ tài khoản có role "admin" mới được phép đăng nhập; tài khoản không có
  quyền sẽ nhận thông báo lỗi "Tài khoản không có quyền truy cập hệ thống".
- Sau khi đăng nhập thành công, access token và refresh token được lưu vào
  localStorage (key: auth_access_token, auth_refresh_token, auth_user).
- Khi tải lại trang, hệ thống gọi API /api/users/me để xác thực lại session.
- Tự động refresh token khi access token hết hạn (lỗi 401). Nếu refresh thất
  bại, xóa token và redirect về /login.
- Các route trong DashboardLayout được bảo vệ: nếu chưa đăng nhập sẽ tự
  động chuyển hướng về /login.

--- 5.2. DASHBOARD (/) ---

Tổng quan hệ thống với 4 thẻ thống kê so sánh tuần hiện tại và tuần trước:
  - Doanh thu (chỉ tính đơn có payment_status = "paid" VÀ order_status =
    "delivered" hoặc "received")
  - Tổng số đơn hàng (trong tuần)
  - Tổng số khách hàng (trong tuần)
  - Số đơn chờ xử lý (các trạng thái: pending, confirmed, preparing,
    packed, shipping)

Biểu đồ và danh sách:
  - Biểu đồ đường (Line Chart): Doanh thu 7 ngày gần nhất (trục Y rút gọn:
    k/tr/tỷ, trục X hiển thị ngày)
  - Danh sách 5 đơn hàng gần đây nhất (mã đơn, tên khách, tổng tiền,
    trạng thái)
  - Cảnh báo tồn kho thấp: liệt kê các biến thể có tồn kho > 0 và < 10

Dữ liệu dashboard được lấy trực tiếp từ API theo khoảng tuần hiện tại
(Thứ Hai → Chủ Nhật). Không dùng DataContext để load, gọi thẳng
orderService.getByDateRange và productService.getLowStock.

--- 5.3. QUẢN LÝ SẢN PHẨM (/products) ---

Danh sách sản phẩm:
  - Hiển thị danh sách sản phẩm với các biến thể được gộp theo sản phẩm
    (rowspan).
  - Mỗi biến thể hiển thị: SKU, màu sắc (có ColorSwatch), phiên bản,
    giá bán, tồn kho.
  - Tồn kho < 10 được tô màu đỏ.
  - Bộ lọc: tìm theo tên/SKU; lọc theo trạng thái (Đang kinh doanh /
    Hết hàng / Ngừng kinh doanh), danh mục, màu sắc, phiên bản. Có thể
    xóa bộ lọc màu và phiên bản bằng nút "×".
  - Thao tác: Xem biến thể, Chỉnh sửa, Xóa (có dialog xác nhận).

Thêm/Chỉnh sửa sản phẩm (/products/new, /products/edit/:id):
  - Thông tin cơ bản: Tên sản phẩm (*), Danh mục (*), Thương hiệu (*),
    Mô tả, Thông số kỹ thuật (dạng key-value, không bắt buộc).
  - Hình ảnh sản phẩm: Tối đa 8 ảnh (MAX_PRODUCT_IMAGES = 8). Nhấn ★ để
    đặt ảnh đại diện (primary). Có thể xóa từng ảnh. Khi tạo mới, ảnh
    được upload lên backend qua FormData.
  - Biến thể sản phẩm: Mỗi biến thể gồm SKU (*), Phiên bản, Màu sắc,
    Giá bán (*), Giá gốc (so sánh), Số lượng tồn (*), Ảnh biến thể
    (bắt buộc khi tạo mới).
    Không được trùng SKU, không được trùng cặp (phiên bản + màu sắc).
    Có thể thêm/xóa biến thể (phải có ít nhất 1 biến thể).
  - Trạng thái sản phẩm: available (Đang kinh doanh) / out_of_stock
    (Hết hàng) / discontinued (Ngừng kinh doanh).
  - Mã SKU sản phẩm được tự động sinh theo định dạng PRD-00001, PRD-00002...
  - Thông số kỹ thuật được parse và lưu dưới dạng JSON object.

Xem biến thể (/products/variants/:id):
  - Thống kê: Tổng biến thể, Tổng tồn kho, Giá trị kho (tồn kho × giá
    bán), Số màu sắc.
  - Bảng liệt kê tất cả biến thể: SKU, màu sắc, phiên bản, giá bán, giá
    gốc, tồn kho (màu đỏ < 10, vàng < 20), trạng thái hoạt động.
  - Cập nhật tồn kho từng biến thể: nhập số thay đổi (dương = nhập hàng,
    âm = xuất hàng).

Quản lý kho (/products/stock):
  - Bảng tồn kho tất cả sản phẩm theo từng biến thể: mã sản phẩm, tên,
    SKU, màu sắc, phiên bản, danh mục, thương hiệu, giá, tồn kho, trạng
    thái kho (Hết hàng / Cần nhập (< 10) / Sắp hết (< 20) / Đủ hàng
    (>= 20)).
  - Cảnh báo banner đỏ nếu có biến thể có tồn kho > 0 và < 10.
  - Nhập hàng vào kho: chọn sản phẩm, chọn biến thể, nhập số lượng và
    ghi chú. Hiển thị preview tồn kho sau khi nhập.

--- 5.4. QUẢN LÝ ĐƠN HÀNG (/orders) ---

Danh sách đơn hàng:
  - 4 thẻ tóm tắt: Chờ xác nhận (pending), Đang xử lý (confirmed +
    preparing), Đang giao (shipping), Hoàn thành (delivered + received).
  - Bộ lọc: tìm theo mã đơn hoặc tên khách hàng; lọc theo trạng thái
    đơn hàng (pending / confirmed / preparing / packed / shipping /
    delivered / failed / cancelled); lọc theo trạng thái thanh toán
    (unpaid / paid / refunded).
  - Bảng hiển thị: mã đơn (DH000001...), tên khách hàng, số điện thoại,
    số lượng sản phẩm, tổng tiền, trạng thái thanh toán, trạng thái đơn
    hàng, ngày đặt.

Chi tiết đơn hàng (/orders/:id):
  - Timeline tiến trình đơn hàng: Chờ xác nhận → Đã xác nhận → Chuẩn bị
    hàng → Đã đóng gói → Đang giao → Hoàn thành.
  - Danh sách sản phẩm đã đặt: ảnh, tên, SKU, đơn giá, số lượng, thành
    tiền.
  - Tóm tắt chi phí: tạm tính, phí vận chuyển, giảm giá (nếu có), tổng
    cộng.
  - Thông tin khách hàng: tên, người nhận, số điện thoại, địa chỉ giao
    hàng, ghi chú (nếu có).
  - Cập nhật trạng thái: mỗi nút chỉ xuất hiện đúng khi đơn ở trạng thái
    tương ứng (Xác nhận → Chuẩn bị → Đóng gói → Giao vận → Hoàn thành).
    Gọi API: PATCH /api/admin/orders/:id/status.
  - Hủy đơn: chỉ có thể hủy khi chưa giao thành công; yêu cầu nhập lý do
    hủy. Gọi API: PATCH /api/admin/orders/:id/cancel.
  - Thông tin thanh toán: phương thức (COD / Ví MoMo / Chuyển khoản) và
    trạng thái.
  - Lịch sử trạng thái (timeline từ backend): trạng thái, thời gian, ghi
    chú, người thực hiện (admin/khách hàng/hệ thống).
  - In phiếu giao hàng khổ A6: in trực tiếp từ trình duyệt, gồm thông tin
    người nhận, danh sách sản phẩm, tổng tiền, và ô chữ ký người nhận.
  - Nút "Xem yêu cầu trả hàng" hiển thị nếu đơn hàng có yêu cầu trả hàng.

--- 5.5. QUẢN LÝ KHÁCH HÀNG (/customers) ---

Danh sách khách hàng:
  - 3 thẻ tóm tắt: Tổng khách hàng, Đang hoạt động, Đã khóa.
  - Tìm kiếm theo mã khách hàng, tên, email hoặc số điện thoại.
  - Bảng hiển thị: mã KH, ảnh đại diện, tên, số điện thoại, email, số đơn
    hàng (đã thanh toán hoặc đã giao), tổng chi tiêu, trạng thái xác thực
    email (is_verified), trạng thái tài khoản (Hoạt động / Vô hiệu).
  - Thao tác: Xem chi tiết, Vô hiệu hóa / Kích hoạt tài khoản (gọi API
    PATCH /api/admin/users/:id/status, có dialog xác nhận).

Chi tiết khách hàng (/customers/:id):
  - Thông tin cá nhân: ảnh đại diện, họ tên, ID, email, số điện thoại,
    ngày sinh (nếu có), giới tính (nếu có), ngày tham gia.
  - Trạng thái tài khoản: xác thực email, trạng thái hoạt động.
  - Danh sách địa chỉ: hiển thị tất cả địa chỉ đã lưu, đánh dấu địa chỉ
    mặc định (is_default).

--- 5.6. QUẢN LÝ KHUYẾN MÃI (/coupon) ---

Danh sách mã giảm giá:
  - 3 thẻ tóm tắt: số mã đang chạy, tổng lượt sử dụng, tổng lượt còn
    khả dụng.
  - Tìm kiếm theo mã giảm giá.
  - Danh sách được sắp xếp: mã đang chạy (is_active = true) lên đầu, sau
    đó đến tạm dừng, hết lượt, hết hạn. Trong cùng nhóm, sắp xếp theo
    ngày tạo mới nhất.
  - Bảng hiển thị: mã (dạng monospace), loại giảm giá (percent / fixed),
    giá trị, đơn tối thiểu, số lượt sử dụng/tối đa (kèm thanh tiến
    trình), ngày hết hạn, trạng thái (Đang chạy / Tạm dừng / Đã hết lượt
    / Đã hết hạn).
  - Thao tác: Chỉnh sửa, Xóa (có dialog xác nhận).

Tạo/Chỉnh sửa mã giảm giá (/coupon/new, /coupon/edit/:id):
  - Thông tin: Mã giảm giá (*) (tự động chuyển sang chữ hoa), Loại giảm
    giá (Phần trăm % / Cố định VNĐ), Giá trị (*), Giá trị đơn tối thiểu
    (min_order_value), Ngày hết hạn (datetime), Giới hạn số lần sử dụng
    (max_uses).
  - Trạng thái: Đang chạy (is_active = true) / Tạm dừng (is_active =
    false).
  - Xem trước coupon hiển thị trực tiếp ngay khi nhập thông tin.

--- 5.7. QUẢN LÝ THÔNG BÁO (/notifications) ---

Danh sách thông báo:
  - Hiển thị danh sách thông báo đã tạo: tiêu đề, nội dung (rút gọn 2
    dòng), ngày tạo.
  - Phân trang: có thể chọn số bản ghi hiển thị (5 / 10 / 20), điều
    hướng trang Trước/Sau. Gọi API /api/admin/notifications?page=&limit=.
  - Nút Làm mới để tải lại dữ liệu.

Tạo thông báo (/notifications/new):
  - Nhập Tiêu đề (*) và Nội dung (*).
  - Sau khi gửi thành công, chuyển về danh sách thông báo.

--- 5.8. QUẢN LÝ TRẢ HÀNG (/returns) ---

Danh sách yêu cầu trả hàng:
  - 4 thẻ tóm tắt: Tổng yêu cầu, Chờ duyệt, Đã chấp nhận, Hoàn thành.
  - Tìm kiếm theo mã yêu cầu (YC000001...) hoặc mã đơn hàng (DH000001...).
  - Lọc theo trạng thái: Chờ duyệt (pending) / Đã chấp nhận (approved) /
    Từ chối (rejected) / Đã nhận hàng (received) / Hoàn thành (completed).
  - Sắp xếp theo ngày tạo hoặc số tiền hoàn.
  - Bảng hiển thị: mã yêu cầu, mã đơn hàng (link tới chi tiết đơn), tên
    khách hàng, lý do + số sản phẩm + số ảnh, số tiền hoàn, trạng thái,
    ngày tạo.

Chi tiết yêu cầu trả hàng (/returns/:id):
  - Thông tin yêu cầu: mã yêu cầu, mã đơn hàng (link), ngày tạo, trạng
    thái, lý do trả hàng, ghi chú của admin (nếu có).
  - Danh sách sản phẩm yêu cầu trả: ảnh, tên, SKU, màu, phiên bản, đơn
    giá, số lượng trả/tổng, tình trạng hàng (ReturnConditionBadge:
    good / damaged / wrong_item), thành tiền. Tổng giá trị trả hàng ở
    cuối bảng.
  - Hình ảnh chứng minh: hiển thị dạng lưới, nhấn để xem phóng to.
  - Thông tin khách hàng: tên, số điện thoại, email.
  - Xử lý yêu cầu theo từng trạng thái:
      + pending:   Chấp nhận (ghi chú tùy chọn, gọi /approve) hoặc
                   Từ chối (bắt buộc nhập lý do, gọi /reject).
      + approved:  Xác nhận đã nhận hàng (gọi /received).
      + received:  Hoàn thành hoàn tiền (gọi /refund).
      + rejected / completed: Hiển thị thông báo trạng thái cuối.
  - Lịch sử xử lý: timeline các mốc (Tạo yêu cầu, Chấp nhận/Từ chối,
    Nhận hàng, Hoàn tiền).

--- 5.9. BÁO CÁO & THỐNG KÊ (/reports) ---

Bộ lọc thời gian: 7 ngày qua (week) / 30 ngày qua (month) / 90 ngày qua
(quarter) / 365 ngày qua (year).

4 thẻ KPI:
  - Tổng doanh thu (chỉ đơn payment_status="paid" VÀ order_status=
    "delivered" hoặc "received")
  - Tổng số đơn hàng hợp lệ
  - Giá trị trung bình mỗi đơn
  - Danh sách sản phẩm sắp hết hàng (tồn kho > 0 và < 10)

Biểu đồ:
  - Xu hướng doanh thu (Line Chart): theo ngày (7/30 ngày), theo tuần
    (90 ngày), theo tháng (365 ngày).
  - Phân bổ trạng thái đơn hàng (Pie Chart): Hoàn thành, Đang giao,
    Đang xử lý, Đã hủy.
  - Doanh thu theo danh mục (Bar Chart bên ngoài recharts, tự vẽ bằng
    CSS): top danh mục doanh thu cao nhất.

Bảng dữ liệu:
  - Sản phẩm sắp hết hàng: SKU, tên sản phẩm, phiên bản/màu, tồn kho
    (tô đỏ). Lấy từ productService.getLowStock(10), hiển thị tối đa 5
    biến thể.
  - Sản phẩm bán chạy nhất: Top 5, xếp hạng (huy chương vàng/bạc/đồng
    cho top 3), tên sản phẩm, số lượng đã bán, doanh thu. Tính toán từ
    dữ liệu đơn hàng đã lấy về (client-side).

--- 5.10. QUẢN LÝ THƯƠNG HIỆU (/brands) ---

  - 2 thẻ tóm tắt: Tổng thương hiệu, Tổng sản phẩm.
  - Tìm kiếm theo tên hoặc mã thương hiệu (BRD...).
  - Bảng hiển thị: mã thương hiệu, tên, logo, số sản phẩm.
  - Thêm thương hiệu: nhập tên (*), logo upload file từ máy tính (tối đa
    2MB, bắt buộc khi tạo mới). Upload qua FormData đến
    POST /api/admin/brands.
  - Chỉnh sửa: cập nhật tên và logo (logo không bắt buộc khi chỉnh sửa).
    Gọi PUT /api/admin/brands/:id.
  - Xóa: có dialog xác nhận.

--- 5.11. QUẢN LÝ DANH MỤC (/categories) ---

  - 2 thẻ tóm tắt: Tổng danh mục, Tổng sản phẩm.
  - Tìm kiếm theo tên hoặc mã danh mục (CAT...).
  - Bảng hiển thị: mã danh mục, tên, số sản phẩm thuộc danh mục.
  - Thêm danh mục: nhập tên (*), chọn danh mục cha (không bắt buộc), mô
    tả. Slug được tự động sinh từ tên danh mục qua hàm generateSlug.
    Gọi POST /api/admin/categories. API trả về cây phân cấp, service tự
    phẳng hóa (flattenTree) trước khi đưa vào context.
  - Chỉnh sửa: cập nhật tên, danh mục cha, mô tả. Slug tự động cập nhật
    theo tên mới.
  - Xóa: không thể xóa danh mục còn sản phẩm (backend trả lỗi, hiển thị
    thông báo rõ ràng).

--- 5.12. QUẢN LÝ BANNER (/banners) ---

  - Hiển thị danh sách banner.
  - Bộ lọc: sắp xếp theo sort_order tăng/giảm dần; lọc theo trạng thái
    (Tất cả / Đang hoạt động / Đã ẩn).
  - Bảng hiển thị: thứ tự (sort_order), hình ảnh (thumbnail 200×80px),
    đường dẫn liên kết (link_url), ngày hết hạn (end_date), trạng thái
    (toggle Switch + Badge).
  - Bật/tắt hiển thị banner trực tiếp qua toggle Switch (cập nhật
    is_active).
  - Thêm banner: upload ảnh (*) qua FormData, đường dẫn liên kết (không
    bắt buộc), ngày hết hạn, trạng thái hiển thị.
    Gọi POST /api/admin/banners.
  - Chỉnh sửa: thay ảnh, cập nhật link, thứ tự hiển thị (sort_order),
    ngày hết hạn, trạng thái. Gọi PUT /api/admin/banners/:id.
  - Xóa: có dialog xác nhận.

--- 5.13. LỊCH SỬ THANH TOÁN (/payments) ---

  - 4 thẻ tóm tắt (dựa trên dữ liệu trang hiện tại): Tổng giao dịch,
    Thành công (success), Chờ xử lý (pending), Thất bại/Hoàn tiền
    (failed + refunded).
  - Bộ lọc: tìm theo ID người dùng; lọc theo trạng thái thanh toán
    (pending / success / failed / refunded); lọc theo phương thức thanh
    toán (COD / Chuyển khoản). Khi thay đổi bộ lọc, tự động về trang 1.
  - Bảng hiển thị: mã giao dịch (transaction_id), mã đơn hàng (link tới
    chi tiết đơn), tên và email khách hàng, số tiền, phương thức, trạng
    thái (Badge), ngày tạo, ngày thanh toán (paid_at).
  - Phân trang: mỗi trang 10 bản ghi, điều hướng Trước/Sau, hiển thị số
    trang hiện tại / tổng trang. Gọi API /api/admin/payments với params
    page, limit, payment_status, method, user_id.

--- 5.14. TÀI KHOẢN CỦA TÔI (/account) ---

  - Hiển thị thông tin: ảnh đại diện, họ tên, username, role (Quản trị
    viên), ID tài khoản.
  - Thông tin chi tiết: họ tên (có thể sửa), email (chỉ đọc), số điện
    thoại (có thể sửa), địa chỉ (chỉ đọc, lấy từ API /api/users/me/
    addresses).
  - Cập nhật ảnh đại diện: nhấn vào ảnh khi đang ở chế độ chỉnh sửa,
    upload file ảnh (tối đa 5MB). Gọi PATCH /api/users/me/avatar qua
    FormData. Có thể xóa ảnh đại diện.
  - Chỉnh sửa thông tin: cập nhật full_name và phone_number qua
    PUT /api/users/me.
  - Đổi mật khẩu: nhập mật khẩu cũ, mật khẩu mới (tối thiểu 8 ký tự),
    xác nhận mật khẩu mới. Mật khẩu mới không được trùng mật khẩu cũ.
    Gọi POST /api/auth/reset-password-user. Có nút hiển thị/ẩn từng
    trường mật khẩu (Eye / EyeOff icon).

================================================================================
6. THÔNG TIN TÀI KHOẢN
================================================================================

Hệ thống chỉ chấp nhận đăng nhập với tài khoản có role "admin".
Thông tin tài khoản (email, mật khẩu) được cấu hình và quản lý tại backend.

================================================================================
                              IT Store Admin Panel
                              Version: 0.0.1
================================================================================
