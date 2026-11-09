# TÀI LIỆU ĐẶC TẢ CHI TIẾT CÁC ENDPOINT HỆ THỐNG BACKEND (API SPECIFICATION)
## DỰ ÁN: CLOTHING SHOP (BTL THỰC TẬP CƠ SỞ)
### Căn cứ thực tế: Source code hiện hành tại `back-end/shop`

---

## 1. TỔNG QUAN VÀ QUY ƯỚC CHUNG (GENERAL CONVENTIONS)

- **Base URL:** `http://localhost:8080/api` (hoặc context root mặc định `http://localhost:8080`)
- **Định dạng dữ liệu:** `application/json; charset=UTF-8`
- **Cơ chế xác thực (Authentication):** Hiện tại mô phỏng qua `AuthService.getAuthenticatedUserId()` (giá trị mặc định `2`); kế hoạch hoàn thiện JWT Bearer Token qua header `Authorization: Bearer <token>`.
- **Cấu trúc phản hồi chuẩn (Standard Response Envelope):**
  Tất cả các API trả về đối tượng `ApiResponse<T>` với định dạng thống nhất:
  ```json
  {
    "code": 200,
    "message": "Thông điệp kết quả",
    "data": { ... }
  }
  ```
- **Xử lý ngoại lệ toàn cục (`ExceptionController`):**
  - `400 Bad Request`: `ActionUnavalibleException` (thao tác không hợp lệ / vi phạm ràng buộc nghiệp vụ) hoặc `MethodArgumentNotValidException` (lỗi Bean Validation trên DTO).
  - `404 Not Found`: `NotFoundException` (không tìm thấy tài nguyên theo ID hoặc bộ lọc).
  - `500 Internal Server Error`: `RuntimeException` (lỗi hệ thống chưa được kiểm soát).

---

## 2. DANH MỤC ĐẶC TẢ CHI TIẾT TỪNG ENDPOINT THEO MODULE

```mermaid
mindmap
  root((Backend API Endpoints))
    Auth
      POST /auth/register
    User
      PUT /user (change password)
      GET /user (admin search)
      GET /user/profile
      PUT /user/profile
    Product
      POST /product
      PUT /product/{id}
      GET /product
      GET /product/{id}/detail
    ProductVariant
      POST /variant
      GET /variant
      GET /variant/{id}
      PUT /variant/{id}
    Cart
      POST /cart/item/{variantId}
      DELETE /cart/item
      GET /cart
    Order
      POST /order
      GET /order/price/{orderId}
      GET /order/{orderId}
      PUT /order/{orderId}/detail
      PUT /order/{orderId}/detail/cancel
      GET /order
      GET /order/my-orders
      GET /order/bought-items
      PUT /order/set-sending/{orderId}
    Event
      POST /event
      PUT /event/{id}
      GET /event
      GET /event/{id}
    Comment
      POST /product/{productId}/comment
      GET /product/{productId}/comment
    Refund
      POST /refund
      GET /refund
      GET /refund/my-refunds
      GET /refund/{id}
      PUT /refund/{id}
```

---

### MODULE 1: AUTHENTICATION (`/auth`)

#### 1.1. Đăng ký tài khoản người dùng mới
- **HTTP Method:** `POST`
- **Path:** `/auth/register`
- **Quyền truy cập:** Public
- **Mô tả:** Đăng ký tài khoản khách hàng mới vào hệ thống. Tự động kiểm tra trùng lặp `username` và `email`.
- **Request Body:**
  ```json
  {
    "username": "customer01",
    "email": "customer01@example.com",
    "password": "Password@123"
  }
  ```
  - `username` (`String`, Bắt buộc): Không được để trống.
  - `email` (`String`, Bắt buộc): Đúng định dạng email hợp lệ.
  - `password` (`String`, Bắt buộc): Độ dài từ 8 đến 30 ký tự, phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt.
- **Response thành công (HTTP 201 Created):**
  ```json
  {
    "code": 201,
    "message": "Thao tác thành công!",
    "data": ""
  }
  ```
- **Mã lỗi thường gặp:**
  - `400 Bad Request`: Username hoặc Email đã tồn tại trong hệ thống (`ActionUnavalibleException`) hoặc dữ liệu gửi lên không đúng định dạng (`MethodArgumentNotValidException`).

---

### MODULE 2: USER PROFILE & CUSTOMER MANAGEMENT (`/user`)

#### 2.1. Đổi mật khẩu tài khoản
- **HTTP Method:** `PUT`
- **Path:** `/user`
- **Quyền truy cập:** Authenticated User
- **Mô tả:** Người dùng đang đăng nhập đổi mật khẩu tài khoản của mình.
- **Request Body:**
  ```json
  {
    "email": "customer01@example.com",
    "oldPassword": "Password@123",
    "newPassword": "NewPassword@456"
  }
  ```
  - `email` (`String`, Bắt buộc): Email định danh người dùng.
  - `oldPassword` (`String`, Bắt buộc): Mật khẩu hiện tại cần xác minh.
  - `newPassword` (`String`, Bắt buộc): Mật khẩu mới (không được trùng mật khẩu cũ).
- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "code": 200,
    "message": "Thao tác thành công!",
    "data": null
  }
  ```
- **Mã lỗi thường gặp:**
  - `400 Bad Request`: Email không khớp tài khoản, mật khẩu cũ sai, hoặc mật khẩu mới trùng mật khẩu cũ.

#### 2.2. Tìm kiếm danh sách người dùng (Dành cho Admin)
- **HTTP Method:** `GET`
- **Path:** `/user`
- **Quyền truy cập:** Admin
- **Mô tả:** Lấy danh sách tài khoản khách hàng (loại trừ tài khoản role `ADMIN`), có hỗ trợ tìm kiếm theo `keyword`, phân trang và sắp xếp động. Sử dụng Spring Data Projection `UserInfoWithoutPassProjection`.
- **Query Parameters:**
  - `keyword` (`String`, Tùy chọn, mặc định: `""`): Từ khóa tìm theo username.
  - `page` (`Integer`, Tùy chọn, mặc định: `1`): Trang hiện tại (1-indexed).
  - `size` (`Integer`, Tùy chọn, mặc định: `10`): Số bản ghi trên 1 trang.
  - `sortBy` (`List<String>`, Tùy chọn): Thuộc tính sắp xếp (ví dụ: `id`, `username`, `email`).
  - `sortDir` (`List<String>`, Tùy chọn): Hướng sắp xếp (`asc` hoặc `desc`).
- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "code": 200,
    "message": "Lấy danh sách user thành công!",
    "data": {
      "content": [
        {
          "id": 2,
          "username": "customer01",
          "email": "customer01@example.com",
          "phone": "0987654321",
          "address": "Hà Nội",
          "avatar": "https://example.com/avatar.png",
          "status": "ACTIVE",
          "role": "USER",
          "coin": 50000
        }
      ],
      "pageable": { ... },
      "totalElements": 1,
      "totalPages": 1,
      "size": 10,
      "number": 0
    }
  }
  ```

#### 2.3. Xem thông tin cá nhân (Profile)
- **HTTP Method:** `GET`
- **Path:** `/user/profile`
- **Quyền truy cập:** Authenticated User
- **Mô tả:** Trả về thông tin cá nhân của người dùng hiện đang đăng nhập (loại bỏ mật khẩu) thông qua `UserInfoWithoutPassProjection`.
- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "code": 200,
    "message": "Lấy thông tin cá nhân thành công!",
    "data": {
      "id": 2,
      "username": "customer01",
      "email": "customer01@example.com",
      "phone": "0987654321",
      "address": "123 Cầu Giấy, Hà Nội",
      "avatar": "https://example.com/avatar.png",
      "status": "ACTIVE",
      "role": "USER",
      "coin": 50000
    }
  }
  ```
- **Mã lỗi thường gặp:**
  - `404 Not Found`: Không tìm thấy thông tin tài khoản người dùng.

#### 2.4. Cập nhật thông tin cá nhân
- **HTTP Method:** `PUT`
- **Path:** `/user/profile`
- **Quyền truy cập:** Authenticated User
- **Mô tả:** Cập nhật thông tin liên lạc (`phone`, `address`, `avatar`) của người dùng hiện tại.
- **Request Body:**
  ```json
  {
    "phone": "0912345678",
    "address": "Số 10 Trịnh Văn Bô, Nam Từ Liêm, Hà Nội",
    "avatar": "https://example.com/new-avatar.png"
  }
  ```
- **Response thành công (HTTP 200 OK):** Trả về đối tượng `UserInfoWithoutPassProjection` đã cập nhật.

---

### MODULE 3: PRODUCT CATALOG (`/product`)

#### 3.1. Thêm sản phẩm cha mới (Admin)
- **HTTP Method:** `POST`
- **Path:** `/product`
- **Quyền truy cập:** Admin
- **Mô tả:** Tạo một sản phẩm mới trong hệ thống.
- **Request Body:**
  ```json
  {
    "productName": "Áo Sơ Mi Oxford Dài Tay",
    "description": "Chất liệu cotton 100% thoáng mát, form dáng thanh lịch",
    "category": "SHIRT",
    "imageUrl": "https://example.com/oxford.jpg"
  }
  ```
  - `productName` (`String`, Bắt buộc): Tên sản phẩm không trùng lặp.
  - `category` (`String`, Bắt buộc): Một trong các giá trị enum (`PANTS`, `SHIRT`, `DRESS`, `SET`, `SPORTSWEAR`).
  - `imageUrl` (`String`, Bắt buộc): Đường dẫn ảnh đại diện.
- **Response thành công (HTTP 200 OK - Cần xem xét chuẩn hóa 201):**
  ```json
  {
    "code": 201,
    "message": "Thao tác thành công!",
    "data": null
  }
  ```
- **Mã lỗi thường gặp:**
  - `400 Bad Request`: Tên sản phẩm đã tồn tại trong hệ thống.

#### 3.2. Cập nhật thông tin sản phẩm cha
- **HTTP Method:** `PUT`
- **Path:** `/product/{productId}`
- **Quyền truy cập:** Admin
- **Path Variables:**
  - `productId` (`Integer`, Bắt buộc): Mã sản phẩm cha cần cập nhật.
- **Request Body:**
  ```json
  {
    "productName": "Áo Sơ Mi Oxford Dài Tay Trắng",
    "description": "Chất vải dệt cao cấp cải tiến",
    "category": "SHIRT",
    "imageUrl": "https://example.com/oxford-white.jpg"
  }
  ```
- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "code": 200,
    "message": "Thao tác thành công!",
    "data": null
  }
  ```

#### 3.3. Tìm kiếm và phân trang sản phẩm
- **HTTP Method:** `GET`
- **Path:** `/product`
- **Quyền truy cập:** Public
- **Mô tả:** Tìm kiếm danh sách sản phẩm nhanh chóng bằng `ProductSpecification` kết hợp `ProductProjection`.
- **Query Parameters:**
  - `productName` (`String`, Tùy chọn): Từ khóa tìm kiếm theo tên.
  - `category` (`String`, Tùy chọn): Lọc theo danh mục.
  - `page` (`Integer`, Tùy chọn, mặc định: `1`): Trang cần lấy.
  - `size` (`Integer`, Tùy chọn, mặc định: `10`): Số sản phẩm / trang.
  - `sortBy` (`List<String>`, Tùy chọn): Tiêu chí sắp xếp.
  - `sortDir` (`List<String>`, Tùy chọn): Hướng sắp xếp (`asc`/`desc`).
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<ProductProjection>>`.

#### 3.4. Xem chi tiết sản phẩm kèm danh sách biến thể & đánh giá
- **HTTP Method:** `GET`
- **Path:** `/product/{productId}/detail`
- **Quyền truy cập:** Public
- **Mô tả:** Trả về toàn bộ thông tin chi tiết của sản phẩm gồm các biến thể màu sắc, kích cỡ, tồn kho, giá bán và bình luận của khách hàng thông qua `ProductWithVariantsAndComments` đã tối ưu `@EntityGraph`.
- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "code": 200,
    "message": "Thao tác thành công!",
    "data": {
      "id": 1,
      "name": "Áo Sơ Mi Oxford",
      "description": "Chất liệu cao cấp",
      "category": "SHIRT",
      "image": "https://example.com/oxford.jpg",
      "productVariants": [
        {
          "id": 10,
          "size": "L",
          "purchasePrice": 250000,
          "quantity": 100,
          "image": "",
          "color": { "id": 1, "name": "Trắng" }
        }
      ],
      "comments": [ ... ]
    }
  }
  ```

---

### MODULE 4: PRODUCT VARIANT & INVENTORY (`/variant`)

#### 4.1. Nhập kho hoặc tạo mới biến thể sản phẩm (SKU)
- **HTTP Method:** `POST`
- **Path:** `/variant?productId={productId}`
- **Quyền truy cập:** Admin
- **Mô tả:** Nếu biến thể (Màu + Kích cỡ) chưa tồn tại, hệ thống tạo mới biến thể với số lượng nhập và lưu lịch sử nhập hàng (`ImportHistory`). Nếu biến thể đã tồn tại, hệ thống tăng tồn kho nguyên tử qua `increaseStock`.
- **Query Parameters:**
  - `productId` (`Integer`, Bắt buộc): Mã sản phẩm cha.
- **Request Body (`ImportVariantRequest`):**
  ```json
  {
    "colorName": "Xanh Navy",
    "size": "XL",
    "quantity": 50,
    "importCost": 180000
  }
  ```
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

#### 4.2. Tìm kiếm và lọc biến thể sản phẩm
- **HTTP Method:** `GET`
- **Path:** `/variant`
- **Quyền truy cập:** Public / Admin
- **Mô tả:** Tra cứu biến thể theo tên sản phẩm, màu sắc, kích cỡ, trạng thái (`AVALIBLE`, `DISABLE`), mã sản phẩm bằng `ProductVariantSpecification` + `ProductVariantProjection`.
- **Query Parameters:**
  - `productName` (`String`, Tùy chọn)
  - `color` (`String`, Tùy chọn)
  - `size` (`String`, Tùy chọn)
  - `status` (`String`, Tùy chọn)
  - `productId` (`Integer`, Tùy chọn)
  - `page` (`Integer`, mặc định: 1), `pageSize` (`Integer`, mặc định: 10), `sortBy`, `sortDir`.
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<ProductVariantProjection>>`.

#### 4.3. Xem chi tiết 1 biến thể sản phẩm
- **HTTP Method:** `GET`
- **Path:** `/variant/{id}`
- **Quyền truy cập:** Public
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<ProductVariantProjection>` kèm thông tin `name` được ghép tự động (Tên SP + Màu + Size).

#### 4.4. Cập nhật thông tin biến thể sản phẩm
- **HTTP Method:** `PUT`
- **Path:** `/variant/{id}`
- **Quyền truy cập:** Admin
- **Mô tả:** Cập nhật trạng thái kinh doanh (`status`), giá bán (`purchasedPrice`) và số lượng tồn kho với cơ chế Pessimistic Lock (`findVariantByIdWithPresLock`) chống xung đột.
- **Request Body (`UpdateVariantRequest`):**
  ```json
  {
    "status": "AVALIBLE",
    "purchasedPrice": 299000,
    "quantity": 45
  }
  ```
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

---

### MODULE 5: CART MANAGEMENT (`/cart`)

#### 5.1. Thêm biến thể sản phẩm vào giỏ hàng
- **HTTP Method:** `POST`
- **Path:** `/cart/item/{productVariantId}`
- **Quyền truy cập:** Authenticated User
- **Mô tả:** Thêm một mục hàng vào giỏ hàng của người dùng đang đăng nhập với số lượng mặc định là 1. Nếu đã có trong giỏ, trả về lỗi 400.
- **Response thành công (HTTP 201 Created):** `ApiResponse<String>`.

#### 5.2. Xóa các mục khỏi giỏ hàng
- **HTTP Method:** `DELETE`
- **Path:** `/cart/item`
- **Quyền truy cập:** Authenticated User
- **Query Parameters:**
  - `ids` (`Set<Integer>`, Bắt buộc): Danh sách ID các dòng giỏ hàng cần xóa (ví dụ: `?ids=1&ids=2` hoặc `?ids=1,2`).
- **Mô tả:** Hệ thống tự động kiểm tra quyền sở hữu `userId`, chỉ xóa những mục thuộc giỏ hàng của chính người dùng hiện tại (chống lỗ hổng IDOR).
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

#### 5.3. Xem danh sách các mục trong giỏ hàng
- **HTTP Method:** `GET`
- **Path:** `/cart`
- **Quyền truy cập:** Authenticated User
- **Query Parameters:**
  - `page` (`Integer`, Tùy chọn, mặc định: 1)
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<CartItemWithProductVariant>>`.

---

### MODULE 6: ORDER PROCESSING & CHECKOUT (`/order`)

#### 6.1. Tạo đơn đặt hàng mới từ giỏ hàng
- **HTTP Method:** `POST`
- **Path:** `/order`
- **Quyền truy cập:** Authenticated User
- **Mô tả:** Tạo đơn hàng từ danh sách các mục giỏ hàng được chọn. Hệ thống tự động tính chiết khấu sự kiện còn hiệu lực, kiểm tra tồn kho và trừ kho an toàn, xóa các mục tương ứng khỏi giỏ hàng.
- **Request Body (`CreateOrderRequest`):**
  ```json
  {
    "reciverName": "Nguyễn Văn A",
    "reciverPhone": "0987654321",
    "reciverAddress": "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    "orderItems": [
      {
        "cartItemId": 12,
        "quantity": 2
      }
    ]
  }
  ```
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

#### 6.2. Tính tổng giá trị đơn hàng
- **HTTP Method:** `GET`
- **Path:** `/order/price/{orderId}`
- **Quyền truy cập:** Authenticated User / Admin
- **Mô tả:** Tính toán tổng tiền phải thanh toán của đơn hàng theo công thức đã chuẩn hóa: `SUM(oi.quantity * oi.price) - o.coinUsed`.
- **Response thành công (HTTP 200 OK):**
  ```json
  {
    "code": 200,
    "message": "Lấy giá đơn hàng thành công!",
    "data": 450000
  }
  ```

#### 6.3. Cập nhật thông tin giao hàng & Áp dụng xu giảm giá
- **HTTP Method:** `PUT`
- **Path:** `/order/{orderId}/detail`
- **Quyền truy cập:** Authenticated User (chủ đơn hàng)
- **Mô tả:** Cập nhật địa chỉ, tên, số điện thoại người nhận và áp dụng xu giảm giá. Trừ xu bằng cơ chế Atomic Conditional Update `deductCoin(userId, coin)` chống Race Condition. Đơn hàng phải đang ở trạng thái `PENDING`.
- **Request Body (`UpdateOrderInfoRequest`):**
  ```json
  {
    "reciverName": "Nguyễn Văn B",
    "reciverPhone": "0912345678",
    "reciverAddress": "Địa chỉ mới",
    "coinBeingUsed": 20000
  }
  ```
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

#### 6.4. Hủy đơn hàng
- **HTTP Method:** `PUT`
- **Path:** `/order/{orderId}/detail/cancel`
- **Quyền truy cập:** Authenticated User (chủ đơn hàng)
- **Mô tả:** Khách hàng hủy đơn hàng đang ở trạng thái `PENDING`. Hệ thống chuyển trạng thái đơn sang `CANCEL`, hoàn lại 100% số lượng tồn kho của các biến thể và tự động hoàn trả số `coinUsed` vào tài khoản người dùng.
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

#### 6.5. Xem chi tiết đơn hàng (kèm danh sách mặt hàng và biến thể)
- **HTTP Method:** `GET`
- **Path:** `/order/{orderId}`
- **Quyền truy cập:** Authenticated User / Admin
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<OrderWithItems>`.

#### 6.6. Tra cứu tất cả đơn hàng (Dành cho Admin)
- **HTTP Method:** `GET`
- **Path:** `/order`
- **Quyền truy cập:** Admin
- **Query Parameters:** `address`, `reciverName`, `phone`, `status`, `startAt`, `endAt`, `page`, `size`, `sortBy`, `sortDir`.
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<OrderProjection>>`.

#### 6.7. Xem danh sách đơn hàng của tôi
- **HTTP Method:** `GET`
- **Path:** `/order/my-orders`
- **Quyền truy cập:** Authenticated User
- **Query Parameters:**
  - `status` (`String`, Tùy chọn): Lọc theo `PENDING`, `PAID`, `DELIVERIED`, `CANCEL`, `EXPRIED`.
  - `startAt` (`LocalDate`, Tùy chọn): Ngày bắt đầu lọc.
  - `endAt` (`LocalDate`, Tùy chọn): Ngày kết thúc lọc.
  - `page` (`Integer`, mặc định: 1), `pageSize` (`Integer`, mặc định: 10).
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<OrderProjection>>`.

#### 6.8. Xem danh sách các mặt hàng đã mua thành công
- **HTTP Method:** `GET`
- **Path:** `/order/bought-items`
- **Quyền truy cập:** Authenticated User
- **Mô tả:** Trả về danh sách các sản phẩm từ các đơn hàng đã giao thành công (`DELIVERIED`) phục vụ tính năng đánh giá sản phẩm hoặc yêu cầu đổi trả, sử dụng `BoughtItemProjection`.
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<BoughtItemProjection>>`.

#### 6.9. Admin xác nhận gửi hàng
- **HTTP Method:** `PUT`
- **Path:** `/order/set-sending/{orderId}`
- **Quyền truy cập:** Admin
- **Mô tả:** Chuyển trạng thái đơn hàng sang `DELIVERIED`.
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

---

### MODULE 7: MARKETING & DISCOUNT EVENTS (`/event`)

#### 7.1. Tạo sự kiện giảm giá mới
- **HTTP Method:** `POST`
- **Path:** `/event`
- **Quyền truy cập:** Admin
- **Request Body (`CreateNewEventRequest`):**
  ```json
  {
    "title": "Khuyến Mãi Mùa Hè 2026",
    "description": "Giảm giá đặc biệt cho các mẫu áo sơ mi và váy hè",
    "startAt": "2026-06-01",
    "endAt": "2026-06-15",
    "discount": 20,
    "image": "https://example.com/summer-banner.jpg"
  }
  ```
- **Response thành công (HTTP 201 Created):** `ApiResponse<String>`.

#### 7.2. Cập nhật sự kiện giảm giá & gán sản phẩm áp dụng
- **HTTP Method:** `PUT`
- **Path:** `/event/{eventId}`
- **Quyền truy cập:** Admin
- **Request Body (`UpdateEventRequest`):**
  ```json
  {
    "title": "Khuyến Mãi Mùa Hè 2026 Cực Lớn",
    "description": "Mở rộng danh sách sản phẩm",
    "startAt": "2026-06-01",
    "endAt": "2026-06-20",
    "discount": 25,
    "productIds": [1, 2, 5, 8]
  }
  ```
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

#### 7.3. Tìm kiếm và phân trang sự kiện
- **HTTP Method:** `GET`
- **Path:** `/event`
- **Quyền truy cập:** Public
- **Query Parameters:** `keyword`, `status` (`AVAILABLE`, `COMING`, `ENDED`), `startDate`, `endDate`, `page`, `size`, `sortBy`, `sortDir`.
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<EventProjection>>`.

#### 7.4. Xem chi tiết sự kiện kèm danh sách sản phẩm áp dụng
- **HTTP Method:** `GET`
- **Path:** `/event/{eventId}`
- **Quyền truy cập:** Public
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<EventWithAppliedProducts>`.

---

### MODULE 8: PRODUCT REVIEWS & COMMENTS (`/product/{productId}/comment`)

#### 8.1. Đăng đánh giá và bình luận sản phẩm
- **HTTP Method:** `POST`
- **Path:** `/product/{productId}/comment`
- **Quyền truy cập:** Authenticated User
- **Path Variables:** `productId` (`Integer`, Bắt buộc)
- **Request Body (`PostNewCommentRequest`):**
  ```json
  {
    "content": "Chất vải rất mịn, mặc mát, giao hàng nhanh!",
    "star": 5
  }
  ```
- **Response thành công (HTTP 201 Created):** `ApiResponse<String>`.

#### 8.2. Lấy danh sách đánh giá của sản phẩm
- **HTTP Method:** `GET`
- **Path:** `/product/{productId}/comment`
- **Quyền truy cập:** Public
- **Query Parameters:** `sortBy` (`star`, `createdAt`), `sortDir` (`asc`, `desc`).
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<List<CommentWithUser>>`.

---

### MODULE 9: REFUND & RETURN REQUESTS (`/refund`)

#### 9.1. Khách hàng gửi yêu cầu đổi / trả hàng
- **HTTP Method:** `POST`
- **Path:** `/refund`
- **Quyền truy cập:** Authenticated User
- **Mô tả:** Tạo yêu cầu hoàn hàng cho một mục sản phẩm trong đơn đã giao thành công (`DELIVERIED`). Kiểm tra số lượng hoàn trả không được vượt quá số lượng mua trừ đi số lượng đã yêu cầu trước đó.
- **Request Body (`CreateRefundRequest`):**
  ```json
  {
    "orderItemId": 15,
    "reason": "Sản phẩm bị lỗi đường may tại vai áo",
    "quantity": 1,
    "image": "https://example.com/refund-proof.jpg"
  }
  ```
- **Response thành công (HTTP 201 Created):** `ApiResponse<String>`.

#### 9.2. Tìm kiếm danh sách yêu cầu hoàn hàng (Admin)
- **HTTP Method:** `GET`
- **Path:** `/refund`
- **Quyền truy cập:** Admin
- **Query Parameters:** `status` (`PENDING`, `ACCEPTED`, `REJECTED`, `DONE`), `keyword`, `userId`, `page`, `pageSize`.
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<RefundRequestProjection>>`.

#### 9.3. Xem danh sách yêu cầu hoàn hàng của tôi
- **HTTP Method:** `GET`
- **Path:** `/refund/my-refunds`
- **Quyền truy cập:** Authenticated User
- **Query Parameters:** `status`, `keyword`, `page`, `pageSize`.
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<Page<RefundRequestProjection>>`.

#### 9.4. Xem chi tiết yêu cầu hoàn hàng
- **HTTP Method:** `GET`
- **Path:** `/refund/{id}`
- **Quyền truy cập:** Authenticated User / Admin
- **Response thành công (HTTP 200 OK):** Trả về `ApiResponse<RefundRequestProjection>`.

#### 9.5. Admin cập nhật trạng thái yêu cầu hoàn hàng
- **HTTP Method:** `PUT`
- **Path:** `/refund/{id}`
- **Quyền truy cập:** Admin
- **Mô tả:** Admin duyệt (`ACCEPTED`), từ chối (`REJECTED`) hoặc xác nhận hoàn tất đổi hàng (`DONE`). Khi đổi sang `DONE`, hệ thống tự động hoàn lại số lượng sản phẩm vào kho.
- **Request Body (`UpdateRefundRequest`):**
  ```json
  {
    "status": "ACCEPTED",
    "responseNote": "Đã chấp thuận, shipper sẽ đến thu hồi sản phẩm trong 2 ngày tới"
  }
  ```
- **Response thành công (HTTP 200 OK):** `ApiResponse<String>`.

---

## 3. ĐÁNH GIÁ VÀ NHẬN XÉT VỀ THIẾT KẾ API HIỆN TẠI (API DESIGN EVALUATION)

Dưới đây là phân tích chuyên sâu về mặt kiến trúc API, tính nhất quán (consistency), tuân thủ tiêu chuẩn RESTful và trải nghiệm lập trình viên (Developer Experience):

### 3.1. Các điểm đã làm tốt (Strengths)
1. **Kiến trúc Projection & Specification tối ưu:** Việc áp dụng JPA Specification lambda linh hoạt kết hợp với Spring Data Projections (Interface-based) giải quyết triệt để vấn đề N+1 queries, chỉ select các trường cần thiết dưới Database và không làm phát sinh hàng loạt DTO Mapper thủ công.
2. **Cấu trúc ApiResponse bao đóng thống nhất:** Toàn bộ hệ thống đều đóng gói kết quả qua `ApiResponse<T>` với mã trạng thái, thông điệp rõ ràng và dữ liệu trả về, giúp Frontend dễ dàng chuẩn hóa tầng Axios/Fetch client.
3. **Quản lý ngoại lệ tập trung:** Sử dụng `@RestControllerAdvice` (`ExceptionController`) bắt gọn các ngoại lệ nghiệp vụ và chuyển hóa thành HTTP status tương ứng (400, 404, 500) kèm message mô tả chi tiết.
4. **Kiểm soát đồng thời và toàn vẹn dữ liệu tốt:** Đã triển khai Pessimistic Locking khi cập nhật biến thể và Atomic Conditional Update (`UPDATE ... WHERE coin >= :coin`) khi trừ xu, chống lại Race Condition.

---

### 3.2. Các hạn chế và điểm cần cải thiện (Weaknesses & Deficiencies)

#### 1. Vi phạm nguyên tắc RESTful về danh từ số nhiều (Plural Resources)
- Chuẩn RESTful khuyến nghị dùng danh từ số nhiều cho collection URI (`/orders`, `/products`, `/users`, `/cart-items`, `/events`, `/refund-requests`).
- Hệ thống hiện tại đang sử dụng hoàn toàn danh từ số ít: `/order`, `/product`, `/user`, `/variant`, `/cart`, `/event`, `/refund`.

#### 2. Lạm dụng động từ trong URI (RPC-style URLs)
- Một số endpoint mang phong cách Remote Procedure Call (RPC) thay vì RESTful:
  - `PUT /order/set-sending/{orderId}`: Chứa động từ `set-sending`. Chuẩn REST nên là `PATCH /orders/{id}/status` hoặc `PUT /orders/{id}/delivery`.
  - `PUT /order/{orderId}/detail/cancel`: Chứa động từ `cancel` lồng dưới `detail`. Chuẩn REST nên là `POST /orders/{id}/cancel` hoặc `PATCH /orders/{id}` với payload trạng thái.
  - `GET /order/price/{orderId}`: Đặt `price` trước `{orderId}`. Chuẩn REST nên là `GET /orders/{orderId}/price`.
  - `POST /cart/item/{productVariantId}`: Gán trực tiếp ID tài nguyên vào đường dẫn POST và fix cứng số lượng là 1. Chuẩn REST nên là `POST /cart/items` với body `{ "productVariantId": 10, "quantity": 1 }`.

#### 3. Bất nhất về tên tham số phân trang (Pagination Parameter Inconsistency)
- Nhóm Controller 1 (`ProductController`, `OrderController`, `EventController`, `UserController`): Sử dụng `@RequestParam(name = "size") Integer size`.
- Nhóm Controller 2 (`ProductVariantController`, `OrderController.getMyOrders`, `RefundRequestController`): Sử dụng `@RequestParam(name = "pageSize") Integer pageSize`.
- **Hệ quả:** Frontend phải viết 2 cơ chế phân trang khác nhau tùy thuộc vào từng màn hình, rất dễ gây nhầm lẫn và lỗi logic phân trang.

#### 4. Bất nhất về HTTP Status Code khi tạo mới tài nguyên (POST)
- Endpoint `POST /product` và `POST /order`: Trả về HTTP `200 OK` (mặc dù bên trong đối tượng `ApiResponse` ghi `code: 201`).
- Endpoint `POST /auth/register`, `POST /event`, `POST /cart/item`, `POST /refund`: Trả về đúng chuẩn HTTP `201 CREATED`.
- Theo chuẩn RFC 7231, mọi thao tác tạo mới tài nguyên thành công đều phải trả về HTTP `201 Created` và lý tưởng nhất là trả kèm ID hoặc thông tin của tài nguyên vừa tạo thay vì trả về chuỗi rỗng `""`.

#### 5. Lỗi chính tả trong DTO Request & Tên phương thức
- DTO `CreateOrderRequest` và `UpdateOrderInfoRequest`: Trường thông tin người nhận bị sai chính tả thành `reciverName`, `reciverPhone`, `reciverAddress` (thiếu chữ 'e', chuẩn tiếng Anh là `receiverName`, `receiverPhone`, `receiverAddress`).
- Tên phương thức trong Controller/Service có typo: `serachProducts` (trong `ProductController`), `finOrderWithItemsById` (trong `OrderService`), `searchlUser` (trong `UserService`), `ActionUnavalibleException` (thiếu chữ 'i' trong `Unavailable`).

#### 6. Thiếu cơ chế phân quyền (Authorization) thực tế tại tầng Controller
- Tất cả các endpoint quản trị viên (Admin) như thêm/sửa sản phẩm, nhập kho, duyệt đổi trả, xem tất cả đơn hàng đều chưa được bảo vệ bằng `@PreAuthorize("hasRole('ADMIN')")`.
- `AuthService` hiện tại đang là mock cố định (`return 2;`). Cần tích hợp Spring Security và JWT Authentication Filter hoàn chỉnh để tự động trích xuất `userId` và `role` từ SecurityContext.

#### 7. Thiếu API cho một số luồng nghiệp vụ quan trọng
- Chưa có API cho phép người dùng xem chi tiết 1 sản phẩm chỉ định kèm số lượng tồn kho theo từng màu/size mà không cần nạp full comment (Simple detail API).
- Chưa có API cập nhật số lượng của mục hàng trong giỏ hàng (`PUT /cart/items/{id}` với `quantity`) mà hiện tại chỉ có thêm mới và xóa.
- Chưa có API hoàn tất thanh toán (`POST /order/{id}/pay` hoặc cổng thanh toán giả lập).

---

## 4. CHECKLIST ĐỀ XUẤT CẢI THIỆN THIẾT KẾ API (DÀNH CHO AGENT THỰC HIỆN LẦN SAU)

Bảng checklist dưới đây tổng hợp toàn bộ các hạng mục cần nâng cấp, chuẩn hóa để đạt chuẩn kiến trúc RESTful cấp độ 2 và 3 (Richardson Maturity Model):

### 4.1. Chuẩn hóa Định dạng URI & Resource Naming (RESTful Standards)
- [x] Chuyển đổi toàn bộ tiền tố URI số ít sang số nhiều:
  - `/product` -> `/products`
  - `/variant` -> `/product-variants` (hoặc `/products/variants`)
  - `/order` -> `/orders`
  - `/user` -> `/users`
  - `/cart` -> `/cart` (giữ nguyên cho singleton cart của user) và `/cart/items` cho danh sách mục
  - `/event` -> `/events`
  - `/refund` -> `/refund-requests`
- [x] Loại bỏ động từ trong URI:
  - Đổi `PUT /order/set-sending/{orderId}` thành `PATCH /orders/{orderId}/status` (hoặc `PUT /orders/{orderId}/delivery`)
  - Đổi `PUT /order/{orderId}/detail/cancel` thành `POST /orders/{orderId}/cancel`
  - Đổi `GET /order/price/{orderId}` thành `GET /orders/{orderId}/price`
  - Đổi `POST /cart/item/{productVariantId}` thành `POST /cart/items` nhận request body `{ productVariantId, quantity }`
  - Đổi `GET /order/bought-items` thành `GET /orders/bought-items` (hoặc `/users/me/bought-items`)
  - Đổi `GET /order/my-orders` thành `GET /orders/my-orders` (hoặc `/users/me/orders`)
  - Đổi `GET /refund/my-refunds` thành `GET /refund-requests/my-requests`

### 4.2. Đồng bộ hóa Tham số Phân trang & Sắp xếp (Pagination & Sorting)
- [x] Chuẩn hóa toàn bộ tham số số lượng bản ghi trên trang thành `size` (thay vì nơi dùng `size`, nơi dùng `pageSize`).
- [x] Đảm bảo tính phòng vệ cho `page`: Sử dụng `Math.max(0, page - 1)` trên tất cả Controller để tránh ném `IllegalArgumentException` khi client truyền `page = 0`.
- [x] Chuẩn hóa tham số sắp xếp: Cung cấp giá trị mặc định cho `sortBy` (ví dụ: `id` hoặc `createdAt`) và `sortDir` (`desc`).

### 4.3. Chuẩn hóa HTTP Status Codes & Response Payloads
- [x] Đổi HTTP Status trả về của `POST /product` (tạo sản phẩm) từ `200 OK` thành `201 CREATED`.
- [x] Đổi HTTP Status trả về của `POST /order` (tạo đơn hàng) từ `200 OK` thành `201 CREATED`.
- [x] Khi tạo mới thành công (`POST`), trả về ID hoặc đối tượng vừa tạo trong trường `data` thay vì trả về chuỗi rỗng `""`.
- [x] Bổ sung Header `Location` chỉ đến URI của tài nguyên vừa tạo cho các API `POST` (chuẩn RESTful).

### 4.4. Sửa đổi Lỗi chính tả & Refactor DTOs
- [x] Sửa các trường `reciverName`, `reciverPhone`, `reciverAddress` thành `receiverName`, `receiverPhone`, `receiverAddress` trong:
  - `CreateOrderRequest.java`
  - `UpdateOrderInfoRequest.java`
  - `Order.java` (nếu có mapping column)
  - `OrderService.java`
- [x] Sửa lỗi chính tả phương thức:
  - `serachProducts` -> `searchProducts` trong `ProductController`
  - `finOrderWithItemsById` -> `findOrderWithItemsById` trong `OrderService` và `OrderController`
  - `searchlUser` -> `searchUser` trong `UserService`
  - `ActionUnavalibleException` -> `ActionUnavailableException`
- [x] Bổ sung DTO cập nhật số lượng giỏ hàng: `UpdateCartItemRequest` (`quantity`).

### 4.5. Bổ sung các Endpoint còn thiếu theo yêu cầu nghiệp vụ
- [x] Bổ sung `PUT /cart/items/{cartItemId}`: Cho phép khách hàng thay đổi số lượng (+ / -) của một mặt hàng trong giỏ.
- [x] Bổ sung `POST /orders/{orderId}/pay`: Xác nhận thanh toán đơn hàng (chuyển trạng thái từ `PENDING` sang `PAID`, ghi nhận `paidAt = LocalDateTime.now()`).
- [x] Tích hợp API Đăng nhập (`POST /auth/login`), Đăng xuất (`POST /auth/logout`) và Làm mới Token (`POST /auth/refresh`).

### 4.6. Tích hợp Bảo mật & Phân quyền (Security & Role-based Access Control)
- [x] Hoàn thiện `JwtTokenProvider` và `JwtAuthenticationFilter` để giải mã token từ Header `Authorization: Bearer <token>`.
- [x] Cập nhật `AuthService.getAuthenticatedUserId()` để lấy `userId` trực tiếp từ `SecurityContextHolder`.
- [x] Thêm `@PreAuthorize("hasRole('ADMIN')")` cho toàn bộ các endpoint quản trị:
  - Quản lý sản phẩm (`POST`, `PUT` `/products`)
  - Quản lý biến thể & nhập kho (`POST`, `PUT` `/product-variants`)
  - Quản trị đơn hàng (`GET /orders`, `PUT /orders/{id}/delivery`)
  - Quản lý sự kiện khuyến mãi (`POST`, `PUT` `/events`)
  - Quản lý & phê duyệt đổi trả (`GET /refund-requests`, `PUT /refund-requests/{id}`)
  - Tra cứu danh sách người dùng (`GET /users`)
- [x] Thêm `@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")` cho các endpoint của người dùng cá nhân (giỏ hàng, đặt hàng, profile).

