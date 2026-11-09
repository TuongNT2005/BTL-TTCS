# TÀI LIỆU THIẾT KẾ KIẾN TRÚC & GIAO DIỆN FRONTEND (FRONTEND DESIGN SPECIFICATION)
**Dự án:** Hệ Thống Thương Mại Điện Tử Thời Trang May Mặc Đương Đại (Sartorial / Contemporary Apparel E-Commerce)  
**Tài liệu tham chiếu:** [`API-SPEC.md`](file:///d:/project/BTL-TTCS%20-%20Copy/BTL-TTCS/agent/API-SPEC.md), [`FE-DESIGN-SKILL.md`](file:///d:/project/BTL-TTCS%20-%20Copy/BTL-TTCS/agent/FE-DESIGN-SKILL.md), [`PRD.md`](file:///d:/project/BTL-TTCS%20-%20Copy/BTL-TTCS/agent/PRD.md), [`ARCHITEC.md`](file:///d:/project/BTL-TTCS%20-%20Copy/BTL-TTCS/agent/ARCHITEC.md)  
**Ngày cập nhật:** 18/10/2026  
**Phiên bản:** 2.0 (Chuẩn hóa toàn diện theo RESTful API & Quy chuẩn Thiết kế Độc bản)

---

## 1. TỔNG QUAN ĐỊNH VỊ THƯƠNG HIỆU & ĐỐI TƯỢNG NGƯỜI DÙNG

### 1.1. Bản sắc thị giác & Chủ đề sản phẩm (Subject Matter & Brand Identity)
- **Lĩnh vực hoạt động:** Thương hiệu thời trang may mặc thiết kế và trang phục thường ngày cao cấp (Contemporary Ready-to-Wear & Sartorial Atelier).
- **Tránh xa các khuôn mẫu AI sáo rỗng (Anti-Templates):**
  - Tuyệt đối không sử dụng bảng màu "kem ấm #F4F1EA + đất nung terracotta #D97757" hoặc "đen tuyền neon acid green" vốn là dấu hiệu của giao diện tạo tự động.
  - Không lạm dụng phong cách "SaaS-card kit" với các thẻ bo tròn 16px giống hệt nhau, đổ bóng mờ nhạt và viền dày đặc vô nghĩa.
  - Loại bỏ các tiền tố tiêu đề chữ hoa toàn bộ (ALL-CAPS EYEBROWS) kèm dấu mũi tên "→" ở cuối nút bấm.
- **Phong cách chủ đạo:** **Editorial Minimalism (Chủ nghĩa tối giản mang hơi thở tạp chí thời trang)**:
  - Bố cục lưới thoáng đãng, tương phản cao, tập trung tôn vinh phom dáng, chất liệu vải và đường kim mũi chỉ qua hình ảnh sản phẩm lớn.
  - Sử dụng các đường kẻ chỉ thanh mảnh (Hairline dividers 1px) tạo phân cách cấu trúc thay vì các mảng màu chắp vá.
  - Góc bo siêu tinh gọn (`rounded-none` hoặc `rounded-[2px]`), tạo cảm giác dứt khoát, hiện đại, sang trọng.

### 1.2. Chân dung người dùng & Nhiệm vụ cốt lõi (Target Audiences & Jobs to be Done)
1. **Khách hàng trực tuyến (Shoppers / Fashion Enthusiasts):**
   - *Mục tiêu:* Nhanh chóng tìm kiếm mẫu trang phục ưng ý theo kích cỡ/màu sắc; đánh giá chất liệu qua ảnh chi tiết và nhận xét thực tế; đặt hàng mượt mà có áp dụng xu thưởng (`coin`); theo dõi vận đơn và dễ dàng gửi yêu cầu đổi trả khi sản phẩm không vừa vặn.
   - *Kỳ vọng:* Tốc độ phản hồi tức thì (<100ms), tương tác chọn biến thể trực quan (size matrix, color swatches), giỏ hàng cập nhật số lượng trơn tru (Optimistic UI).
2. **Quản trị viên & Nhân viên vận hành (Shop Administrators & Warehouse Operators):**
   - *Mục tiêu:* Quản lý vòng đời sản phẩm & ma trận biến thể; nhập kho nhanh; điều phối đơn hàng và cập nhật trạng thái giao hàng; phê duyệt/từ chối các yêu cầu đổi trả minh bạch; theo dõi báo cáo doanh thu & xu hướng bán chạy.
   - *Kỳ vọng:* Màn hình làm việc dạng bảng dữ liệu đậm chất công thái học (Ergonomic dense data tables), bộ lọc đa tiêu chí nhanh chóng, không giật lag.

---

## 2. HỆ THỐNG DESIGN TOKENS & VISUAL LANGUAGE (DESIGN SYSTEM)

Tuân thủ nguyên tắc giới hạn và tinh gọn của `FE-DESIGN-SKILL.md`: "Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined."

### 2.1. Bảng màu tinh tuyển (Curated Color Palette - 6 Core Tokens)

```
[#121316] Ink Obsidian      - Màu chữ chính, tiêu đề, nút bấm chủ đạo (Primary Dark)
[#F9F9F8] Canvas Alabaster   - Nền trang web, mang ánh sáng tự nhiên của sợi dệt
[#FFFFFF] Pure Surface       - Nền modal, popover, drawer giỏ hàng
[#E6E4DF] Hairline Cashmere  - Đường kẻ ranh giới, khung viền ngăn cách (1px border)
[#6B706E] Muted Graphite     - Màu chữ phụ, thông số kỹ thuật, breadcrumb, label
[#8C2B2B] Crimson Atelier    - Màu điểm nhấn chiến dịch sale, cảnh báo hết hàng, error
```

#### Bảng màu chức năng (Functional Semantics)
- **Tồn kho sẵn có (In Stock):** Ký hiệu chấm tròn xanh ô liu dịu nhẹ `#2F5233` kèm chữ "Còn hàng".
- **Sắp hết hàng (Low Stock <= 5):** Chữ cảnh báo màu hổ phách khói `#B45309` ("Chỉ còn X chiếc").
- **Hết hàng (Out of Stock):** Màu xám `#9CA3AF` gạch chéo nhẹ trên nút chọn kích cỡ.
- **Trạng thái đơn hàng (Order Badges):**
  - `PENDING`: Viền mỏng 1px `#D97706`, nền `#FFFBEB`, chữ `#B45309`.
  - `PAID`: Viền mỏng 1px `#2563EB`, nền `#EFF6FF`, chữ `#1D4ED8`.
  - `DELIVERIED`: Viền mỏng 1px `#059669`, nền `#ECFDF5`, chữ `#047857`.
  - `CANCEL` / `EXPRIED`: Viền mỏng 1px `#9CA3AF`, nền `#F3F4F6`, chữ `#4B5563`.

### 2.2. Hệ thống Typography (Deliberate Editorial Pairing)
Không dùng font mặc định đơn điệu, áp dụng cặp font có cá tính đối ứng rõ rệt:

1. **Display & Headline Font: `Playfair Display` hoặc `Syne` (Serif / High-Fashion Display)**
   - *Vai trò:* Tên thương hiệu, tiêu đề bộ sưu tập lớn, tên sản phẩm trong trang chi tiết, tiêu đề banner sự kiện.
   - *Đặc điểm:* Đường nét thanh mảnh tương phản nét đậm, gợi cảm giác sang trọng của các ấn phẩm Vogue hay Harper's Bazaar.
2. **Body & Interface Font: `Plus Jakarta Sans` hoặc `Inter` (Geometric Sans-Serif)**
   - *Vai trò:* Toàn bộ văn bản mô tả, nhãn nút bấm, bảng dữ liệu admin, thông số biến thể, biểu mẫu.
   - *Đặc điểm:* Chiều cao x-height lớn, khoảng cách ký tự cân đối, đọc văn bản dài hay danh sách đơn hàng không gây mỏi mắt.
3. **Numeric & Monospace Font: `JetBrains Mono` hoặc `Space Grotesk`**
   - *Vai trò:* Mã đơn hàng (`#ORD-1024`), SKU sản phẩm, giá tiền VNĐ (`1.250.000 đ`), số dư xu tích lũy.

#### Thang tỷ lệ chữ (Type Scale)
- `Display Hero`: 48px - 64px / Leading 1.1 / Font-normal / Serif
- `Heading 1`: 32px - 40px / Leading 1.2 / Font-medium / Serif
- `Heading 2`: 24px - 28px / Leading 1.3 / Font-semibold / Sans
- `Heading 3`: 18px - 20px / Leading 1.4 / Font-semibold / Sans
- `Body Large`: 16px / Leading 1.6 / Font-normal / Sans (Độ dài dòng tối đa 70 ký tự)
- `Body Normal`: 14px / Leading 1.5 / Font-normal / Sans
- `Caption / Meta`: 12px / Leading 1.4 / Font-normal / Monospace hoặc Sans

### 2.3. Cấu trúc không gian, Đường viền & Tương tác (Layout & Motion)
- **Lưới bố cục (Layout Grid):** Container tối đa 1440px trên màn hình desktop, lề 32px (mobile: lề 16px).
- **Hairline Borders:** Sử dụng `border border-[#E6E4DF]` tạo ranh giới tinh gọn, dứt khoát.
- **Corner Radius:** Chuẩn hóa toàn bộ:
  - Nút bấm, ô input, dropdown: `rounded-[2px]` (gần như vuông vức sắc sảo).
  - Thẻ ảnh sản phẩm: `rounded-none`.
  - Badges trạng thái: `rounded-[2px]`, không bao giờ dùng kiểu bo tròn pill quả trám rẻ tiền.
- **Tương tác có chủ đích (Deliberate Micro-interactions):**
  - Không dùng hiệu ứng lướt bay lòe loẹt khắp nơi.
  - Hover vào sản phẩm: Ảnh zoom cực nhẹ (`scale-[1.02]` trong 400ms cubic-bezier), hiển thị bảng chọn size nhanh.
  - Drawer giỏ hàng trượt từ phải sang mượt mà trong 250ms với lớp phủ backdrop blur nhẹ.
  - Toast thông báo nhỏ gọn xuất hiện ở góc dưới bên phải trong 3 giây rồi biến mất nhẹ nhàng.

---

## 3. KIẾN TRÚC KỸ THUẬT FRONTEND & QUẢN LÝ DỮ LIỆU

### 3.1. Tech Stack Hiện Đại & Nhất Quán
- **Core:** React 18 + Vite (Cấu hình Host 0.0.0.0, Fast Refresh).
- **Styling:** TailwindCSS v4 (`@tailwindcss/vite`), `clsx`, `tailwind-merge` cho hàm `cn()`.
- **Navigation:** React Router DOM v6 với cơ chế Nested Routes & Layout Wrappers.
- **State Management:**
  - `AuthContext`: Quản lý Access Token, thông tin user hiện tại (`authUser`), quyền (`ROLE_USER` / `ROLE_ADMIN`), cơ chế tự động refresh token trong nền.
  - `CartContext`: Quản lý số lượng badge giỏ hàng, sync danh sách mục giỏ hàng theo thời gian thực, hỗ trợ cập nhật số lượng tức thì (optimistic updates).
  - `UIContext`: Quản lý Drawer giỏ hàng, Modal chi tiết sản phẩm xem nhanh, Toast thông báo hệ thống.
- **HTTP Client:** Axios Client tùy biến với Queue Token Refresh Interceptor chống Race Condition khi gọi nhiều request đồng thời lúc token hết hạn.

### 3.2. Cấu trúc thư mục chuẩn hóa (Project Directory Structure)

```
front-end/shop/src/
├── assets/                  # Icons SVG, logo thương hiệu, lookbook placeholders
├── components/
│   ├── common/              # Thành phần dùng chung toàn hệ thống
│   │   ├── Button.jsx       # Nút bấm theo chuẩn editorial (Primary, Outline, Ghost, Danger)
│   │   ├── Input.jsx        # Ô nhập liệu tối giản với nhãn nổi và hiển thị lỗi
│   │   ├── Select.jsx       # Dropdown chọn size, màu, danh mục tùy biến
│   │   ├── Badge.jsx        # Nhãn trạng thái đơn hàng, nhãn sale %
│   │   ├── Modal.jsx        # Hộp thoại pop-up cơ bản có phím tắt Escape
│   │   ├── Drawer.jsx       # Khung trượt từ cạnh phải (cho Giỏ hàng & Bộ lọc)
│   │   ├── Pagination.jsx   # Phân trang hỗ trợ cả 'size' và 'pageSize', nút Trước/Sau
│   │   ├── Skeleton.jsx     # Khối nạp dữ liệu chờ (thay thế spinner tròn xoay)
│   │   └── Toast.jsx        # Thông báo ngắn tự biến mất
│   ├── layout/              # Khung giao diện chính
│   │   ├── StorefrontLayout.jsx  # Header, Marquee, Footer cho khách mua sắm
│   │   ├── CustomerLayout.jsx    # Sidebar điều hướng tài khoản cá nhân
│   │   └── AdminLayout.jsx       # Sidebar quản trị, Header quản trị, thống kê nhanh
│   └── storefront/          # Thành phần chuyên biệt cho khách hàng
│       ├── ProductCard.jsx  # Thẻ sản phẩm chuẩn tỷ lệ 3:4 lookbook
│       ├── VariantSelector.jsx # Bộ chọn Ma trận Size & Màu kèm kiểm tra tồn kho
│       ├── CartDrawer.jsx   # Giỏ hàng xem nhanh bên phải màn hình
│       ├── ReviewList.jsx   # Danh sách nhận xét & xếp hạng sao
│       └── RefundModal.jsx  # Modal tạo yêu cầu đổi/trả hàng kèm preview ảnh
├── context/                 # Context Providers (Auth, Cart, UI)
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── UIContext.jsx
├── hooks/                   # Custom React Hooks
│   ├── useAuth.js           # Truy xuất trạng thái đăng nhập & logout
│   ├── useCart.js           # Thêm, sửa số lượng, xóa mục giỏ hàng
│   ├── useDebounce.js       # Giảm tải tìm kiếm thời gian thực
│   └── useToast.js          # Gọi toast thông báo tiện lợi
├── services/                # Tầng gọi API kết nối chuẩn xác với API-SPEC.md
│   ├── apiClient.js         # Axios instance tích hợp JWT interceptor
│   ├── authService.js       # /auth/login, /auth/register, /auth/refresh, /auth/logout
│   ├── productService.js    # /products, /product-variants, /warehouse
│   ├── cartService.js       # /cart, /cart/items
│   ├── orderService.js      # /orders, /orders/my-orders, /orders/{id}/pay, /cancel
│   ├── eventService.js      # /events
│   ├── commentService.js    # /products/{id}/comments
│   ├── refundService.js     # /refund-requests, /refund-requests/my-requests
│   ├── userService.js       # /users, /users/update-infor, /users/change-pass
│   └── reportService.js     # /report/*
├── pages/
│   ├── Storefront/          # Khối trang công khai cho khách hàng
│   │   ├── HomePage.jsx
│   │   ├── ProductCatalogPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── EventDetailPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   └── PaymentCallbackPage.jsx
│   ├── Customer/            # Khối tài khoản khách hàng đã đăng nhập
│   │   ├── ProfilePage.jsx
│   │   ├── OrdersHistoryPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   └── MyRefundRequestsPage.jsx
│   ├── Admin/               # Khối dành riêng cho Quản trị viên
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsManagePage.jsx
│   │   ├── WarehouseManagePage.jsx
│   │   ├── OrdersManagePage.jsx
│   │   ├── EventsManagePage.jsx
│   │   ├── RefundsManagePage.jsx
│   │   └── UsersManagePage.jsx
│   └── Auth/
│       ├── LoginPage.jsx
│       └── RegisterPage.jsx
├── routes/                  # Cấu hình định tuyến & Phân quyền bảo vệ
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── utils/                   # Hàm tiện ích (Format tiền tệ VNĐ, ngày tháng, tính xu)
│   ├── formatters.js
│   └── validators.js
└── index.css                # Cấu hình Tailwind v4 và Custom Typography
```

### 3.3. Cơ chế Xác thực & Hàng đợi Làm mới Token (JWT Interceptor Pipeline)

Để đảm bảo kết nối hoàn hảo với Backend Spring Security đã triển khai trong phiên trước:
- Token được lưu trữ an toàn trong `localStorage` hoặc bộ nhớ ứng dụng.
- Khi Axios nhận mã HTTP `401 Unauthorized`:
  1. Tạm dừng tất cả các request phát sinh tiếp theo vào hàng đợi (`failedRequestsQueue`).
  2. Tự động kích hoạt gọi API `POST /auth/refresh` kèm `refreshToken`.
  3. Khi nhận được `accessToken` mới: Cập nhật lại header `Authorization: Bearer <new_token>` cho toàn bộ các request đang chờ trong queue và thực thi lại.
  4. Nếu làm mới thất bại (Refresh Token hết hạn 7 ngày): Xóa dữ liệu xác thực, kích hoạt thông báo hết phiên và điều hướng êm ái về `/login`.

---

## 4. BẢN VẼ BỐ CỤC (ASCII WIREFRAMES) & ĐẶC TẢ CHI TIẾT CÁC MÀN HÌNH

### 4.1. Màn hình Trang Chủ & Khám Phá Sản Phẩm (Storefront Home)

#### Ý tưởng bố cục:
Hero Banner không dùng ảnh tĩnh đơn điệu, mà là khối lookbook thời trang bất đối xứng: 60% chiều rộng là ảnh mẫu trang phục chất lượng cao, 40% là tiêu đề bộ sưu tập với typography thanh lịch và đồng hồ đếm ngược sự kiện khuyến mãi (`/events`).

#### Sơ đồ Wireframe (ASCII):
```
+-----------------------------------------------------------------------------------------+
| [MARQUEE]  MIỄN PHÍ VẬN CHUYỂN ĐƠN TỪ 500K  •  TÍCH XU HOÀN TIỀN 5%  •  ƯU ĐÃI MÙA HÈ   |
+-----------------------------------------------------------------------------------------+
|  ATELIER VOGUE         [Áo Sơ Mi] [Váy & Đầm] [Quần Tây] [Bộ Sưu Tập]   [Search] [Cart(2)] [User] |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  +---------------------------------------+  +----------------------------------------+  |
|  | EDITORIAL LOOKBOOK                    |  | MÙA HÈ RỰC RỠ '26                      |  |
|  |                                       |  |                                        |  |
|  | [ Hình ảnh người mẫu mặc thiết kế     |  | Những đường may tinh xảo từ chất liệu  |  |
|  |   áo sơ mi lụa cao cấp tối giản ]     |  | Linen và Lụa tự nhiên thoáng mát.      |  |
|  |                                       |  |                                        |  |
|  |                                       |  | SỰ KIỆN GIẢM 20% KẾT THÚC TRONG:       |  |
|  |                                       |  | [ 02 Ngày : 14 Giờ : 35 Phút ]         |  |
|  |                                       |  |                                        |  |
|  |                                       |  | [ Khám Phá Ngay ]                      |  |
|  +---------------------------------------+  +----------------------------------------+  |
|                                                                                         |
|-----------------------------------------------------------------------------------------|
|  SẢN PHẨM MỚI NHẤT                                          [Xem tất cả 48 sản phẩm]    |
|-----------------------------------------------------------------------------------------|
|                                                                                         |
|  +------------------+  +------------------+  +------------------+  +------------------+ |
|  | [Ảnh SP 3:4]     |  | [Ảnh SP 3:4]     |  | [Ảnh SP 3:4]     |  | [Ảnh SP 3:4]     | |
|  | [HOT -20%]       |  |                  |  | [MỚI]            |  |                  | |
|  |                  |  |                  |  |                  |  |                  | |
|  | Áo Sơ Mi Lụa Cổ V|  | Váy Midi Xếp Ly  |  | Quần Tây Suông Đen| | Áo Blazer Đệm Vai| |
|  | 680.000 đ        |  | 850.000 đ        |  | 720.000 đ        |  | 1.450.000 đ      | |
|  | (•) (•) (•)      |  | (•) (•)          |  | (•) (•)          |  | (•)              | |
|  +------------------+  +------------------+  +------------------+  +------------------+ |
|                                                                                         |
|-----------------------------------------------------------------------------------------|
|  SỰ KIỆN ĐANG DIỄN RA (/events)                                                         |
|  +------------------------------------------------------------------------------------+ |
|  | [Banner Sự Kiện: SUMMER SALE - GIẢM 20% TOÀN BỘ SẢN PHẨM ÁO]   [Áp Dụng Tự Động]   | |
|  +------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

#### Chi tiết tương tác & Tích hợp API:
- Gọi `GET /events?status=AVAILABLE` để lấy sự kiện đang diễn ra đưa lên Banner Hero và Countdown.
- Gọi `GET /products?page=1&size=8&sortBy=createdAt&sortDir=desc` nạp danh sách sản phẩm mới.
- Thẻ sản phẩm (`ProductCard`):
  - Hiển thị chấm màu sắc (Color swatches). Khi hover vào chấm màu, ảnh đại diện đổi sang màu tương ứng.
  - Hover hiển thị thanh chọn nhanh kích cỡ (S, M, L, XL). Nhấp chọn kích cỡ -> tự động kích hoạt `POST /cart/items` (`{ productVariantId, quantity: 1 }`), mở êm ái Drawer Giỏ hàng mà không cần chuyển trang.

---

### 4.2. Màn hình Chi Tiết Sản Phẩm & Đánh Giá (Product Detail & Reviews)

#### Sơ đồ Wireframe (ASCII):
```
+-----------------------------------------------------------------------------------------+
| Trang chủ / Áo Sơ Mi / Áo Sơ Mi Lụa Cổ V Trắng                                          |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  +-----------------------+  +--------------------------------------------------------+  |
|  | [Ảnh lớn 1]           |  | ÁO SƠ MI LỤA CỔ V                                      |  |
|  |                       |  | Mã SP: #PRD-012  •  Đánh giá: ★★★★★ (24 đánh giá)     |  |
|  |                       |  |                                                        |  |
|  |                       |  | 680.000 đ   ~~850.000 đ~~  (-20% Sự Kiện Hè)            |  |
|  |                       |  |--------------------------------------------------------|  |
|  |                       |  | MÀU SẮC: Trắng Ngà                                     |  |
|  |                       |  | [X] Trắng Ngà    [ ] Đen Tuyền    [ ] Xanh Rêu         |  |
|  |                       |  |                                                        |  |
|  |                       |  | KÍCH CỠ:                                               |  |
|  |                       |  | [ S ]   [ M ]   [ L ]   [ XL - Hết hàng ]              |  |
|  |                       |  | * Chỉ còn 3 sản phẩm trong kho                         |  |
|  |                       |  |--------------------------------------------------------|  |
|  |                       |  | SỐ LƯỢNG: [ - ]  1  [ + ]                              |  |
|  |                       |  |                                                        |  |
|  |                       |  | [ THÊM VÀO GIỎ HÀNG ]         [ MUA NGAY ]             |  |
|  |                       |  |--------------------------------------------------------|  |
|  |                       |  | ĐẶC TÍNH SẢN PHẨM:                                     |  |
|  |                       |  | - 100% Lụa tơ tằm dệt thủ công                         |  |
|  |                       |  | - Độ co giãn nhẹ, giữ form suông chuẩn sau khi giặt    |  |
|  +-----------------------+  +--------------------------------------------------------+  |
|  [Thumb 1] [Thumb 2] [Thumb 3]                                                          |
|                                                                                         |
|-----------------------------------------------------------------------------------------|
|  ĐÁNH GIÁ TỪ KHÁCH HÀNG (24)                                   [ Viết Đánh Giá ]        |
|-----------------------------------------------------------------------------------------|
|  ★★★★★  Nguyễn Minh Trang - 12/06/2026                                                  |
|  "Chất vải mềm và mát tuyệt đối, đường may cổ áo rất tinh tế. Giao hàng trong 2 ngày."  |
|  -------------------------------------------------------------------------------------  |
|  ★★★★☆  Trần Bảo Nam - 10/06/2026                                                       |
|  "Form áo mặc lên vừa vặn, màu trắng ngà dễ phối đồ."                                   |
+-----------------------------------------------------------------------------------------+
```

#### Chi tiết kỹ thuật & Xử lý trạng thái:
- **API tích hợp:**
  - `GET /products/{productId}`: Trả về thông tin đầy đủ kèm danh sách biến thể (`ProductVariant`).
  - `GET /products/{productId}/comments?sortBy=createdAt&sortDir=desc`: Nạp danh sách bình luận kèm phân trang/sắp xếp.
  - `POST /products/{productId}/comments`: Gửi bình luận và số sao (1-5 sao) khi đã đăng nhập (`ROLE_USER` hoặc `ROLE_ADMIN`).
- **Logic Ma trận Biến thể (Variant Matrix Logic):**
  - Trích xuất danh sách duy nhất các Màu sắc (`colors`) và Kích cỡ (`sizes`) từ `product.productVariants`.
  - Khi người dùng chọn Màu A: Tự động lọc các Size có sẵn cho Màu A. Nếu biến thể nào có `quantity === 0`, hiển thị trạng thái vô hiệu hóa kèm gạch ngang, ngăn ngừa người dùng thêm vào giỏ.
  - Hiển thị trực tiếp tồn kho thực tế: Nếu `selectedVariant.quantity <= 5`, hiện dòng thông báo hổ phách: *"Chỉ còn X sản phẩm trong kho"*.

---

### 4.3. Ngăn Kéo Giỏ Hàng & Màn Hình Thanh Toán (Cart Drawer & Checkout Flow)

#### Sơ đồ Drawer Giỏ Hàng (Slide-over Cart):
```
+-------------------------------------------------------------+
| GIỎ HÀNG CỦA BẠN (3)                                    [X] |
+-------------------------------------------------------------+
| [✓] Chọn tất cả (3 mục)                     [Xóa mục đã chọn]|
|-------------------------------------------------------------|
| [✓] +-------+  Áo Sơ Mi Lụa Cổ V                            |
|     | [Ảnh] |  Phân loại: Trắng Ngà / Size M                |
|     +-------+  Đơn giá: 680.000 đ                           |
|                Số lượng: [ - ]  2  [ + ]     Thành tiền:    |
|                [Xóa]                         1.360.000 đ    |
|-------------------------------------------------------------|
| [✓] +-------+  Quần Tây Suông Đen                           |
|     | [Ảnh] |  Phân loại: Đen / Size L                      |
|     +-------+  Đơn giá: 720.000 đ                           |
|                Số lượng: [ - ]  1  [ + ]     Thành tiền:    |
|                [Xóa]                         720.000 đ      |
|-------------------------------------------------------------|
| TỔNG TIỀN HÀNG (2 mục chọn):                   2.080.000 đ  |
| * Chưa bao gồm phí ship và trừ xu thưởng                    |
|                                                             |
| [ TIẾN HÀNH ĐẶT HÀNG NGAY ]                                 |
+-------------------------------------------------------------+
```

#### Sơ đồ Màn hình Thanh Toán & Trừ Xu Thưởng (Checkout Page):
```
+-----------------------------------------------------------------------------------------+
| TIẾN HÀNH THANH TOÁN ĐƠN HÀNG                                                           |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  THÔNG TIN GIAO HÀNG                        TÓM TẮT ĐƠN HÀNG                            |
|  +--------------------------------------+   +-----------------------------------------+ |
|  | Người nhận:                          |   | 2x Áo Sơ Mi Lụa (Trắng/M)   1.360.000 đ | |
|  | [ Nguyễn Văn A                     ] |   | 1x Quần Tây Suông (Đen/L)     720.000 đ | |
|  |                                      |   |-----------------------------------------| |
|  | Số điện thoại:                       |   | Tạm tính:                   2.080.000 đ | |
|  | [ 0912345678                       ] |   | Phí vận chuyển:             Miễn phí    | |
|  |                                      |   |                                         | |
|  | Địa chỉ giao hàng:                   |   | ÁP DỤNG XU TÍCH LŨY (COIN LOYALTY):     | |
|  | [ 123 Đường Lê Duẩn, Hà Nội        ] |   | Bạn đang có: 400.000 xu                 | |
|  |                                      |   | [ 100000        ] [Dùng tối đa] [Áp dụng| |
|  | Ghi chú:                             |   | Giảm trừ xu:                 -100.000 đ | |
|  | [ Giao hàng giờ hành chính         ] |   |-----------------------------------------| |
|  +--------------------------------------+   | TỔNG THANH TOÁN:            1.980.000 đ | |
|                                             |                                         | |
|  PHƯƠNG THỨC THANH TOÁN                     | [ XÁC NHẬN ĐẶT HÀNG (201 Created) ]     | |
|  (•) Thanh toán khi nhận hàng (COD)         |                                         | |
|  ( ) Thanh toán trực tuyến (VNPAY / Thẻ)    +-----------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

#### Chi tiết kỹ thuật & Quy tắc nghiệp vụ (Business Logic):
- **Cập nhật số lượng giỏ hàng:** Khi bấm `[+]` hoặc `[-]`:
  - Gọi ngay `PUT /cart/items/{cartItemId}` với payload `{ "quantity": newQuantity }`.
  - Nếu kho không đủ, hiển thị Toast cảnh báo: *"Kho chỉ còn X sản phẩm!"* và tự động phục hồi lại số lượng cũ trên giao diện.
- **Xóa mục hàng:** Bấm nút xóa gọi `DELETE /cart/items` với mảng ID `{ "cartItemIds": [cartItemId] }`.
- **Áp dụng Xu (Coin Validation):**
  - Giới hạn: `0 <= coinUsed <= Math.min(user.coin, totalOrderPrice)`.
  - Phản ánh tức thời số tiền trừ vào hóa đơn.
- **Tạo đơn hàng:**
  - Gửi `POST /orders` với body `{ receiverName, receiverPhone, receiverAddress, cartItemIds, coinUsed }`.
  - Nhận mã phản hồi **`201 Created`** kèm `data: { id: orderId }`.
  - Tự động xóa các mục đã đặt khỏi `CartContext` và điều hướng sang trang xác nhận đơn hàng hoặc cổng thanh toán.
- **Thanh toán tức thời:** Gọi `POST /orders/{orderId}/pay` để chuyển trạng thái sang `PAID` và cập nhật ngày thanh toán `paidAt`.

---

### 4.4. Khu Vực Cá Nhân: Đơn Hàng & Luồng Đổi Trả (Customer Account & Returns)

#### Sơ đồ Quản lý Đơn hàng & Gửi Yêu cầu Đổi trả:
```
+-----------------------------------------------------------------------------------------+
| TÀI KHOẢN CỦA TÔI                                                                       |
+-----------------------------------------------------------------------------------------+
|  [Hồ Sơ Cá Nhân]   [ĐƠN HÀNG CỦA TÔI]   [MỤC ĐÃ MUA & ĐỔI TRẢ]   [YÊU CẦU ĐỔI TRẢ (2)]  |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  Bộ lọc: [Tất cả] [Chờ thanh toán] [Đã thanh toán] [Đang giao] [Đã nhận] [Đã hủy]       |
|                                                                                         |
|  +------------------------------------------------------------------------------------+ |
|  | ĐƠN HÀNG #ORD-10025  •  Ngày tạo: 14/06/2026  •  Hạn thanh toán: 15/06/2026       | |
|  | Trạng thái: [ PENDING - CHỜ THANH TOÁN ]                                           | |
|  |                                                                                    | |
|  | • 1x Áo Sơ Mi Lụa Cổ V (Trắng/M)                    680.000 đ                      | |
|  | • 1x Quần Tây Suông (Đen/L)                         720.000 đ                      | |
|  |------------------------------------------------------------------------------------| |
|  | Xu đã dùng: 50.000 xu  •  Tổng thanh toán: 1.350.000 đ                             | |
|  |                                                                                    | |
|  | [ Chi Tiết Đơn Hàng ]          [ Thanh Toán Ngay ]          [ HỦY ĐƠN HÀNG ]       | |
|  +------------------------------------------------------------------------------------+ |
|                                                                                         |
|  +------------------------------------------------------------------------------------+ |
|  | ĐƠN HÀNG #ORD-10018  •  Ngày giao: 10/06/2026                                      | |
|  | Trạng thái: [ DELIVERIED - ĐÃ GIAO THÀNH CÔNG ]                                    | |
|  |                                                                                    | |
|  | • 1x Váy Midi Xếp Ly (Be/S)                         850.000 đ                      | |
|  |   [ GỬI YÊU CẦU ĐỔI / TRẢ HÀNG ]                                                   | |
|  +------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

#### Sơ đồ Modal Yêu cầu Đổi/Trả Hàng (Refund Modal):
```
+-------------------------------------------------------------------+
| YÊU CẦU ĐỔI / TRẢ HÀNG                                        [X] |
+-------------------------------------------------------------------+
| Sản phẩm: Váy Midi Xếp Ly (Be / Size S)                            |
| Số lượng đã mua: 2 cái  •  Số lượng còn có thể đổi: 2              |
|                                                                   |
| Số lượng muốn đổi/trả:                                            |
| [ - ]  1  [ + ]                                                   |
|                                                                   |
| Lý do đổi / trả hàng:                                             |
| [ Sản phẩm bị lỗi đường may tại eo váy, rộng hơn bảng size chuẩn ]|
|                                                                   |
| Hình ảnh minh chứng (lỗi may/hỏng):                               |
| +---------------------------------------------------------------+ |
| | [Ảnh minh chứng.jpg - 1.2MB]                    [Chọn ảnh mới]| |
| +---------------------------------------------------------------+ |
|                                                                   |
| [ Hủy bỏ ]                                [ GỬI YÊU CẦU ĐỔI HÀNG ]|
+-------------------------------------------------------------------+
```

#### Chi tiết kỹ thuật luồng đổi trả:
1. Gọi `GET /orders/bought-items` để lấy danh sách các mặt hàng đã mua thuộc đơn `DELIVERIED`.
2. Khách bấm "Gửi yêu cầu đổi hàng", modal hiển thị số lượng tối đa có thể hoàn (`boughtQuantity - refundedQuantity`).
3. Nếu có đính kèm ảnh: Tự động upload qua `POST /uploads` (multipart/form-data) lấy link URL.
4. Gửi `POST /refund-requests` với body `{ orderItemId, reason, quantity, image }`. Nhận `201 Created`.
5. Tab "Yêu cầu đổi trả của tôi" gọi `GET /refund-requests/my-requests` để theo dõi tiến độ duyệt của Admin.

---

### 4.5. Khối Quản Trị Viên (Admin Management Suite)

Thiết kế bảng dữ liệu công thái học, không gian hiển thị tối đa, hạn chế các khối padding thừa mứa.

#### Sơ đồ Bảng Điều Khiển Quản Trị (Admin Dashboard & Modules):
```
+-----------------------------------------------------------------------------------------+
|  ATELIER ADMIN PORTAL               [Tìm kiếm nhanh...]           [Thông báo(3)] [Admin]|
+-----------------------------------------------------------------------------------------+
|  [||] Bảng Điều Khiển  |  TỔNG QUAN DOANH THU & HOẠT ĐỘNG                               |
|  [#] Quản Lý Sản Phẩm  |  +------------------+  +------------------+  +---------------+ |
|  [*] Kho & Biến Thể    |  | TỔNG DOANH THU   |  | ĐƠN CHỜ XỬ LÝ    |  | YÊU CẦU HOÀN  | |
|  [o] Đơn Hàng          |  | 285.400.000 đ    |  | 14 đơn hàng      |  | 3 yêu cầu     | |
|  [%] Sự Kiện Khuyến Mãi|  +------------------+  +------------------+  +---------------+ |
|  [<] Quản Lý Đổi Trả   |                                                                |
|  [@] Khách Hàng        |  BIỂU ĐỒ DOANH SỐ (30 NGÀY QUA)             CƠ CẤU DANH MỤC    |
|                        |  +----------------------------------------+  +---------------+ |
|                        |  | [ Biểu đồ đường Doanh thu / Ngày      ] |  | [Biểu đồ tròn]| |
|                        |  |   Dữ liệu từ /report/sale-figure       |  |   Áo: 45%     | |
|                        |  |                                        |  |   Váy: 35%    | |
|                        |  +----------------------------------------+  +---------------+ |
|                        |                                                                |
|                        |  TOP KHÁCH HÀNG CHI TIÊU NHẤT               SẢN PHẨM BÁN CHẠY  |
|                        |  1. Nguyễn Thu Hương - 18.500.000 đ         1. Áo Sơ Mi Lụa V |
|                        |  2. Lê Hoàng Nam     - 14.200.000 đ         2. Quần Tây Suông |
+-----------------------------------------------------------------------------------------+
```

#### Sơ đồ Màn hình Quản Lý Biến Thể & Nhập Kho Nhanh (Warehouse Management):
```
+-----------------------------------------------------------------------------------------+
| QUẢN LÝ KHO HÀNG & BIẾN THỂ SẢN PHẨM                              [ + NHẬP KHO NHANH ]   |
+-----------------------------------------------------------------------------------------+
| Lọc: [Chọn Sản phẩm: Tất cả ▼]  [Chọn Kích cỡ: Tất cả ▼]  [Chọn Màu: Tất cả ▼]  [Tìm SKU]|
|                                                                                         |
| ID   SẢN PHẨM             MÀU SẮC      SIZE   GIÁ BÁN        TỒN KHO      HÀNH ĐỘNG     |
|-----------------------------------------------------------------------------------------|
| 101  Áo Sơ Mi Lụa Cổ V    Trắng Ngà    S      680.000 đ      14 cái       [Sửa] [Nhập]  |
| 102  Áo Sơ Mi Lụa Cổ V    Trắng Ngà    M      680.000 đ       3 cái (!)   [Sửa] [Nhập]  |
| 103  Áo Sơ Mi Lụa Cổ V    Trắng Ngà    L      680.000 đ       0 cái [HẾT] [Sửa] [Nhập]  |
| 104  Áo Sơ Mi Lụa Cổ V    Đen Tuyền    M      680.000 đ      22 cái       [Sửa] [Nhập]  |
| 105  Quần Tây Suông Đen   Đen          L      720.000 đ       8 cái       [Sửa] [Nhập]  |
|-----------------------------------------------------------------------------------------|
| Hiển thị 1 - 5 của 48 biến thể                             [< Trang trước] [1] 2 3 [Sau>]|
+-----------------------------------------------------------------------------------------+
```

#### Sơ đồ Xử lý Đổi Trả Đơn Hàng (Admin Refund Handling):
```
+-------------------------------------------------------------------+
| XỬ LÝ YÊU CẦU ĐỔI / TRẢ HÀNG #REF-88                          [X] |
+-------------------------------------------------------------------+
| Khách hàng: Lê Thu Hà (ID: 15)  •  Mã đơn hàng: #ORD-10012        |
| Mục hoàn trả: 1x Váy Midi Xếp Ly (Be/S)                           |
| Lý do: "Đường may khóa kéo phía sau bị kẹt cứng không kéo lên được"|
| Ảnh đính kèm: [Xem ảnh phóng to (minh-chung-loi.jpg)]             |
| Trạng thái hiện tại: PENDING                                      |
|                                                                   |
| Ghi chú phản hồi cho khách hàng:                                  |
| [ Shop đồng ý thu hồi sản phẩm. Shipper sẽ liên hệ trong 24h tới. ]|
|                                                                   |
| [ TỪ CHỐI (REJECTED) ]                           [ DUYỆT (ACCEPTED) ]|
|                                                                   |
| Khi đã nhận lại hàng tại kho:                                     |
| [ XÁC NHẬN HOÀN TẤT & NHẬP LẠI KHO (DONE - Auto Stock Restore) ]  |
+-------------------------------------------------------------------+
```

---

## 5. THIẾT KẾ TRẢI NGHIỆM NGƯỜI DÙNG, XỬ LÝ LỖI & VIẾT NỘI DUNG (UX & MICROCOPY)

Tuân thủ nghiêm ngặt chỉ dẫn viết văn bản trong `FE-DESIGN-SKILL.md`: "Words appear in a design for one reason: to make it easier to understand and use. Write from the end user's perspective, active voice as default."

### 5.1. Quy tắc Ngôn từ Giao diện (Microcopy Guidelines)
- **Đặt tên theo góc nhìn người dùng:**
  - Dùng "Áp dụng xu tích lũy" thay vì "Tính toán coin deduction".
  - Dùng "Địa chỉ nhận hàng" thay vì "Shipping address payload".
  - Dùng "Yêu cầu đổi / trả hàng" thay vì "Tạo refund request record".
- **Hành động chủ động (Active Voice CTAs):**
  - Nút bấm: "Lưu thay đổi", "Thêm vào giỏ", "Tiến hành đặt hàng", "Xác nhận giao hàng".
  - Đồng bộ trạng thái: Nút bấm ghi "Hủy đơn hàng" -> Hộp thoại thông báo hiển thị "Đã hủy đơn hàng thành công và hoàn trả 50.000 xu vào ví của bạn".
- **Trạng thái rỗng mang tính định hướng (Actionable Empty States):**
  - *Giỏ hàng rỗng:* "Giỏ hàng của bạn đang trống. Khám phá những thiết kế mới nhất của mùa này để tìm trang phục phù hợp." kèm nút `[Khám phá sản phẩm]`.
  - *Chưa có đơn hàng:* "Bạn chưa có đơn hàng nào đang xử lý. Xem lịch sử mua sắm hoặc quay lại cửa hàng." kèm nút `[Bắt đầu mua sắm]`.
  - *Không có yêu cầu đổi trả:* "Hiện tại bạn không có yêu cầu đổi trả nào đang chờ xử lý."
- **Thông báo lỗi có nguyên nhân và giải pháp (Constructive Error Messages):**
  - *Lỗi tồn kho:* Thay vì báo "Action unavailable", hiển thị cụ thể: *"Sản phẩm size M màu Trắng chỉ còn 2 chiếc trong kho. Vui lòng điều chỉnh lại số lượng đặt mua."*
  - *Lỗi hết hạn thanh toán:* *"Đơn hàng này đã quá thời hạn thanh toán 24 giờ và đã tự động đóng. Vui lòng tạo lại đơn hàng mới."*
  - *Lỗi không đủ xu:* *"Số dư xu của bạn hiện tại là 120.000 xu, không đủ để áp dụng 200.000 xu. Đã tự động điều chỉnh về mức tối đa."*

---

## 6. BẢNG CHECKLIST CÔNG VIỆC TRIỂN KHAI FRONTEND (IMPLEMENTATION CHECKLIST)

Bảng checklist dưới đây phân rã chi tiết toàn bộ các tác vụ cần thực hiện để hoàn thiện Frontend, đóng vai trò tiêu chuẩn nghiệm thu (Acceptance Criteria) cho các đợt rà soát tiếp theo.

### 6.1. Hạ tầng Cốt lõi, Design Tokens & Routing
- [x] Tích hợp bộ font `Playfair Display` (hoặc `Syne`) và `Plus Jakarta Sans` vào `index.html` và cấu hình `@theme` trong Tailwind v4.
- [x] Thiết lập bảng màu 6 tokens (`Ink Obsidian #121316`, `Canvas Alabaster #F9F9F8`, `Hairline Cashmere #E6E4DF`, `Crimson Atelier #8C2B2B`, ...) trong cấu hình style.
- [x] Xây dựng bộ component nguyên tử dùng chung (Common UI Kit):
  - [x] `Button.jsx`: Các biến thể `primary`, `secondary`, `outline`, `ghost`, `danger` với góc bo `rounded-[2px]`.
  - [x] `Input.jsx` & `Select.jsx`: Đường viền hairline tinh tế, trạng thái focus sắc nét, hiển thị lỗi chuẩn.
  - [x] `Badge.jsx`: Nhãn trạng thái `PENDING`, `PAID`, `DELIVERIED`, `CANCEL` phong cách tối giản.
  - [x] `Drawer.jsx`: Ngăn kéo trượt mượt mà có backdrop blur.
  - [x] `Modal.jsx`: Hộp thoại xác nhận có bẫy focus và hỗ trợ phím Escape.
  - [x] `Pagination.jsx`: Hỗ trợ cả 2 tham số `size` và `pageSize`, xử lý phân trang 1-indexed an toàn.
  - [x] `Skeleton.jsx`: Khối placeholder chờ nạp dữ liệu.
- [x] Cấu hình Axios Client (`apiClient.js`):
  - [x] Tự động gắn Bearer Token vào header request.
  - [x] Hàng đợi xử lý refresh token tự động khi gặp mã lỗi 401 (`POST /auth/refresh`).
  - [x] Điều hướng êm ái về trang đăng nhập khi refresh token hết hạn.
- [x] Xây dựng `AuthContext` và `ProtectedRoute` phân quyền nghiêm ngặt (`PUBLIC`, `ROLE_USER`, `ROLE_ADMIN`).

### 6.2. Module Xác Thực (Authentication)
- [x] Trang Đăng nhập (`LoginPage.jsx`):
  - [x] Form đăng nhập (Username/Password) kết nối `POST /auth/login`.
  - [x] Lưu trữ token, cập nhật trạng thái người dùng vào `AuthContext`.
  - [x] Tự động điều hướng theo quyền hạn (Admin chuyển sang `/admin`, User chuyển sang trang trước đó hoặc `/home`).
- [x] Trang Đăng ký (`RegisterPage.jsx`):
  - [x] Form đăng ký đầy đủ thông tin kết nối `POST /auth/register`.
  - [x] Xử lý mã phản hồi `201 Created` và thông báo đăng ký thành công.
- [x] Chức năng Đăng xuất: Kết nối `POST /auth/logout`, dọn dẹp sạch token và điều hướng an toàn.

### 6.3. Khối Khách Hàng - Mua Sắm & Đặt Hàng (Storefront & Shopping)
- [x] Trang Chủ (`HomePage.jsx`):
  - [x] Thanh thông báo Marquee đầu trang.
  - [x] Header điều hướng responsive kèm giỏ hàng mini badge và tìm kiếm nhanh.
  - [x] Khối Hero Banner Lookbook kết nối sự kiện giảm giá đang diễn ra (`GET /events?status=AVAILABLE`).
  - [x] Lưới danh sách sản phẩm mới (`GET /products`), hiển thị thẻ sản phẩm chuẩn tỷ lệ 3:4.
  - [x] Danh sách sự kiện khuyến mãi dạng thẻ banner.
- [x] Trang Danh Mục & Tìm Kiếm (`ProductCatalogPage.jsx`):
  - [x] Bộ lọc đa tiêu chí: Từ khóa, Danh mục, Khoảng giá (Min/Max), Sắp xếp.
  - [x] Tích hợp phân trang an toàn bảo vệ index (`Math.max(0, page - 1)`).
- [x] Trang Chi Tiết Sản Phẩm (`ProductDetailPage.jsx`):
  - [x] Gallery hình ảnh sản phẩm chất lượng cao (ảnh lớn + thumbnails).
  - [x] Bộ chọn biến thể Ma trận (Size & Màu) tích hợp kiểm tra số lượng tồn kho theo thời gian thực.
  - [x] Cảnh báo tồn kho thấp ("Chỉ còn X chiếc") khi `quantity <= 5`.
  - [x] Form nhập số lượng với nút tăng/giảm (+ / -).
  - [x] Nút "Thêm vào giỏ hàng" và "Mua ngay".
  - [x] Khu vực Đánh giá & Bình luận:
    - [x] Danh sách đánh giá lấy từ `GET /products/{id}/comments`.
    - [x] Form gửi đánh giá và chấm sao `POST /products/{id}/comments`.
- [x] Ngăn Kéo Giỏ Hàng (`CartDrawer.jsx` & `CartContext`):
  - [x] Lấy danh sách mục giỏ hàng từ `GET /cart`.
  - [x] Thay đổi số lượng gọi `PUT /cart/items/{id}` kèm cập nhật giao diện tức thì (Optimistic UI).
  - [x] Chọn từng mục hoặc chọn tất cả để thanh toán.
  - [x] Xóa mục đã chọn gọi `DELETE /cart/items`.
  - [x] Nút chuyển sang trang thanh toán.
- [x] Trang Thanh Toán & Trừ Xu (`CheckoutPage.jsx`):
  - [x] Form thông tin người nhận (`receiverName`, `receiverPhone`, `receiverAddress`).
  - [x] Khối kiểm tra và áp dụng Xu thưởng (`coinUsed`), giới hạn không vượt quá số xu đang có hoặc tổng tiền hàng.
  - [x] Tạo đơn hàng thành công qua `POST /orders` (xử lý mã `201 Created` kèm header `Location`).
  - [x] Nút xác nhận thanh toán trực tiếp qua `POST /orders/{id}/pay`.

### 6.4. Khối Khách Hàng - Quản Lý Cá Nhân & Đổi Trả (Customer Portal)
- [x] Trang Hồ Sơ Cá Nhân (`ProfilePage.jsx`):
  - [x] Xem & cập nhật thông tin cá nhân qua `PUT /users/user`.
  - [x] Đổi mật khẩu qua `PUT /users/change-pass`.
  - [x] Hiển thị số dư xu tích lũy khả dụng.
- [x] Trang Đơn Hàng Của Tôi (`OrdersHistoryPage.jsx`):
  - [x] Danh sách đơn hàng nạp từ `GET /orders/my-orders`.
  - [x] Tab lọc theo trạng thái (`PENDING`, `PAID`, `DELIVERIED`, `CANCEL`).
  - [x] Nút "Hủy đơn hàng" cho đơn `PENDING` kết nối `POST /orders/{id}/cancel` (tự động cộng hoàn xu và tồn kho).
  - [x] Nút "Thanh toán ngay" cho đơn `PENDING` kết nối `POST /orders/{id}/pay`.
- [x] Luồng Đổi / Trả Hàng (Returns Flow):
  - [x] Lấy danh sách các mặt hàng đã mua từ `GET /orders/bought-items`.
  - [x] Modal tạo yêu cầu đổi trả (`RefundModal.jsx`):
    - [x] Nhập số lượng muốn hoàn trả (validate không vượt quá số lượng đã mua trừ đi đã yêu cầu).
    - [x] Nhập lý do đổi trả chi tiết.
    - [x] Upload ảnh đính kèm lỗi sản phẩm qua `POST /uploads`.
    - [x] Gửi yêu cầu qua `POST /refund-requests` (nhận `201 Created`).
  - [x] Trang theo dõi tiến độ đổi trả cá nhân (`MyRefundRequestsPage.jsx`) kết nối `GET /refund-requests/my-requests`.

### 6.5. Khối Quản Trị Viên (Admin Management Suite)
- [x] Bảng Điều Khiển Tổng Quan (`DashboardPage.jsx`):
  - [x] Thẻ thống kê tổng quan doanh thu, đơn hàng, người dùng từ `/report/summary`.
  - [x] Biểu đồ doanh số theo ngày dùng thư viện Recharts từ `/report/sale-figure`.
  - [x] Biểu đồ tròn cơ cấu danh mục từ `/report/sale-with-category`.
  - [x] Danh sách Top khách hàng chi tiêu từ `/report/top-spending`.
  - [x] Danh sách Top sản phẩm bán chạy từ `/report/trend-products`.
- [x] Quản Lý Sản Phẩm (`ProductsManagePage.jsx`):
  - [x] Bảng dữ liệu sản phẩm phân trang, tìm kiếm theo từ khóa và danh mục.
  - [x] Modal / Drawer Tạo mới sản phẩm `POST /products` (nhận `201 Created`).
  - [x] Modal Cập nhật sản phẩm `PUT /products/{id}`.
- [x] Quản Lý Kho Hàng & Biến Thể (`WarehouseManagePage.jsx`):
  - [x] Danh sách biến thể toàn hệ thống từ `GET /product-variants`.
  - [x] Cảnh báo nổi bật biến thể sắp hết hàng (`quantity <= 5`) hoặc đã hết (`quantity === 0`).
  - [x] Chức năng Nhập kho nhanh: Chọn biến thể, nhập số lượng và giá nhập gọi `POST /warehouse/import`.
  - [x] Chỉnh sửa biến thể (giá bán, tồn kho) qua `PUT /product-variants/{id}`.
- [x] Quản Lý Đơn Hàng Toàn Hệ Thống (`OrdersManagePage.jsx`):
  - [x] Bảng danh sách đơn hàng nạp từ `GET /orders` kèm bộ lọc đa tiêu chí (SĐT, tên, trạng thái, ngày).
  - [x] Xem chi tiết đơn hàng kèm danh sách sản phẩm và xu đã dùng.
  - [x] Cập nhật trạng thái giao hàng thành công `DELIVERIED` qua `PUT /orders/{id}/delivery`.
- [x] Quản Lý Sự Kiện Khuyến Mãi (`EventsManagePage.jsx`):
  - [x] Danh sách sự kiện nạp từ `GET /events`.
  - [x] Form tạo mới sự kiện `POST /events` (nhận `201 Created`).
  - [x] Form cập nhật sự kiện và gán sản phẩm áp dụng qua `PUT /events/{id}`.
- [x] Quản Lý & Duyệt Đổi Trả (`RefundsManagePage.jsx`):
  - [x] Bảng danh sách yêu cầu hoàn hàng từ `GET /refund-requests`.
  - [x] Modal xem xét chi tiết yêu cầu, xem ảnh minh chứng phóng to của khách.
  - [x] Nút Duyệt (`ACCEPTED`), Từ chối (`REJECTED`) và Hoàn tất (`DONE`) qua `PUT /refund-requests/{id}`.
  - [x] Xác nhận tự động phục hồi tồn kho khi chuyển trạng thái sang `DONE`.
- [x] Quản Lý Người Dùng (`UsersManagePage.jsx`):
  - [x] Tra cứu người dùng qua `GET /users` với bộ lọc username, quyền hạn.
  - [x] Xem chi tiết người dùng, số dư xu tích lũy và trạng thái tài khoản.

---
*Tài liệu trên được thiết kế đầy đủ, chi tiết và đồng bộ 100% với hệ thống Backend RESTful API hiện hành.*

