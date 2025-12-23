# Shoe Shop - Kịch bản kiểm thử

## Mô tả dự án

Hệ thống quản lý và bán giày thể thao online với đầy đủ chức năng cho người dùng và quản trị viên.

## Công nghệ sử dụng

- **Backend**: Node.js, Express, MySQL
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: MySQL

## Cài đặt

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Kịch bản kiểm thử

### 1. Quản lý Danh mục (Categories)

#### TC001: Tạo danh mục mới

- **Bước 1**: Đăng nhập với tài khoản admin
- **Bước 2**: Vào menu "Danh mục"
- **Bước 3**: Click nút "+ Thêm danh mục"
- **Bước 4**: Nhập tên danh mục (ví dụ: "Giày Bóng Rổ")
- **Bước 5**: Nhập mô tả (tùy chọn)
- **Bước 6**: Click "Lưu"
- **Kết quả mong đợi**: Hiển thị toast "Tạo danh mục thành công", danh mục xuất hiện trong danh sách

#### TC002: Xóa danh mục có sản phẩm

- **Bước 1**: Chọn danh mục có sản phẩm
- **Bước 2**: Click nút "Xóa"
- **Bước 3**: Xác nhận xóa
- **Kết quả mong đợi**: Hiển thị toast lỗi "Không thể xóa danh mục này vì còn X sản phẩm"

#### TC003: Xóa danh mục không có sản phẩm

- **Bước 1**: Chọn danh mục không có sản phẩm
- **Bước 2**: Click nút "Xóa"
- **Bước 3**: Xác nhận xóa
- **Kết quả mong đợi**: Hiển thị toast "Xóa danh mục thành công", danh mục biến mất khỏi danh sách

### 2. Quản lý Sản phẩm (Products)

#### TC004: Tạo sản phẩm mới

- **Bước 1**: Vào menu "Sản phẩm"
- **Bước 2**: Click "+ Thêm sản phẩm"
- **Bước 3**: Điền đầy đủ thông tin (tên, SKU, giá, danh mục, ảnh)
- **Bước 4**: Click "Lưu"
- **Kết quả mong đợi**: Sản phẩm được tạo thành công, hiển thị trong danh sách

#### TC005: Xóa sản phẩm có đơn hàng

- **Bước 1**: Chọn sản phẩm đã có trong đơn hàng
- **Bước 2**: Click "Xóa"
- **Bước 3**: Xác nhận
- **Kết quả mong đợi**: Hiển thị toast lỗi "Không thể xóa sản phẩm này vì đã có đơn hàng sử dụng"

#### TC006: Xóa sản phẩm có biến thể

- **Bước 1**: Chọn sản phẩm có biến thể
- **Bước 2**: Click "Xóa"
- **Bước 3**: Xác nhận
- **Kết quả mong đợi**: Hiển thị toast lỗi "Không thể xóa sản phẩm này vì còn biến thể"

### 3. Quản lý Biến thể (Variants)

#### TC007: Tạo biến thể mới

- **Bước 1**: Vào menu "Biến thể"
- **Bước 2**: Click "+ Thêm biến thể"
- **Bước 3**: Chọn sản phẩm, nhập size, màu, giá, số lượng
- **Bước 4**: Click "Lưu"
- **Kết quả mong đợi**: Biến thể được tạo, stock của sản phẩm tự động cập nhật

#### TC008: Xóa biến thể có đơn hàng

- **Bước 1**: Chọn biến thể đã có trong đơn hàng
- **Bước 2**: Click "Xóa"
- **Bước 3**: Xác nhận
- **Kết quả mong đợi**: Hiển thị toast lỗi "Không thể xóa biến thể này vì đã có đơn hàng sử dụng"

#### TC009: Xóa biến thể thành công

- **Bước 1**: Chọn biến thể không có đơn hàng
- **Bước 2**: Click "Xóa"
- **Bước 3**: Xác nhận
- **Kết quả mong đợi**: Hiển thị toast "Xóa biến thể thành công", stock sản phẩm tự động cập nhật

### 4. Quản lý Đơn hàng (Orders)

#### TC010: Xem chi tiết đơn hàng

- **Bước 1**: Vào menu "Đơn hàng"
- **Bước 2**: Click "Xem" trên một đơn hàng
- **Kết quả mong đợi**: Modal hiển thị đầy đủ thông tin: mã đơn, khách hàng, sản phẩm (tên, ảnh, màu, size), tổng tiền

#### TC011: Cập nhật trạng thái đơn hàng

- **Bước 1**: Chọn đơn hàng có trạng thái "pending"
- **Bước 2**: Click "Sửa trạng thái"
- **Bước 3**: Chọn trạng thái mới (ví dụ: "processing")
- **Bước 4**: Click "Lưu thay đổi"
- **Kết quả mong đợi**: Hiển thị toast "Cập nhật trạng thái đơn hàng thành công", trạng thái được cập nhật

#### TC012: Không thể đổi trạng thái đơn đã completed/cancelled

- **Bước 1**: Chọn đơn hàng có trạng thái "completed" hoặc "cancelled"
- **Bước 2**: Click "Sửa trạng thái"
- **Kết quả mong đợi**: Không có nút "Sửa trạng thái" hoặc hiển thị lỗi khi cố gắng đổi

#### TC013: Xóa đơn hàng chưa completed/cancelled

- **Bước 1**: Chọn đơn hàng có trạng thái "pending" hoặc "processing"
- **Bước 2**: Click "Xóa"
- **Bước 3**: Xác nhận
- **Kết quả mong đợi**: Hiển thị toast "Xóa đơn hàng thành công"

### 5. Quản lý Khách hàng (Customers)

#### TC014: Xem thông tin khách hàng

- **Bước 1**: Vào menu "Khách hàng"
- **Bước 2**: Click "Xem" trên một khách hàng
- **Kết quả mong đợi**: Modal hiển thị đầy đủ thông tin khách hàng

#### TC015: Xóa khách hàng

- **Bước 1**: Mở modal khách hàng
- **Bước 2**: Click "Xóa người dùng"
- **Bước 3**: Xác nhận
- **Kết quả mong đợi**: Hiển thị toast "Xóa người dùng thành công"

### 6. Quản lý Đánh giá (Reviews)

#### TC016: Xem đánh giá

- **Bước 1**: Vào menu "Đánh giá"
- **Bước 2**: Click "Xem" trên một đánh giá
- **Kết quả mong đợi**: Modal hiển thị chi tiết đánh giá

#### TC017: Xóa đánh giá

- **Bước 1**: Chọn một đánh giá
- **Bước 2**: Click "Xóa"
- **Bước 3**: Xác nhận
- **Kết quả mong đợi**: Hiển thị toast "Xóa đánh giá thành công"

### 7. Trang chủ và Sản phẩm (User)

#### TC018: Xem danh sách sản phẩm

- **Bước 1**: Vào trang chủ
- **Bước 2**: Xem danh sách sản phẩm
- **Kết quả mong đợi**: Hiển thị tất cả sản phẩm với ảnh, tên, giá

#### TC019: Lọc sản phẩm theo danh mục

- **Bước 1**: Click vào một danh mục trong sidebar
- **Kết quả mong đợi**: Chỉ hiển thị sản phẩm thuộc danh mục đó

#### TC020: Click category trong grid

- **Bước 1**: Scroll xuống phần CategoryShowcase grid
- **Bước 2**: Click vào một category (ví dụ: "Giày Bóng Rổ")
- **Kết quả mong đợi**: Tự động scroll xuống và hiển thị sản phẩm của category đó

#### TC021: Tìm kiếm sản phẩm

- **Bước 1**: Nhập từ khóa vào ô tìm kiếm
- **Bước 2**: Nhấn Enter hoặc click tìm kiếm
- **Kết quả mong đợi**: Hiển thị kết quả tìm kiếm phù hợp

#### TC022: Xem chi tiết sản phẩm

- **Bước 1**: Click vào một sản phẩm
- **Kết quả mong đợi**: Hiển thị trang chi tiết với đầy đủ thông tin, màu sắc, size

#### TC023: Chọn màu/size hết hàng

- **Bước 1**: Vào trang chi tiết sản phẩm
- **Bước 2**: Chọn màu/size đã hết hàng
- **Kết quả mong đợi**: Màu/size bị disable, hiển thị "(Hết hàng)", không thể thêm vào giỏ

#### TC024: Thêm vào giỏ hàng

- **Bước 1**: Chọn màu và size còn hàng
- **Bước 2**: Click "Thêm vào giỏ"
- **Kết quả mong đợi**: Hiển thị toast "Đã thêm vào giỏ hàng!", sản phẩm xuất hiện trong giỏ

### 8. Giỏ hàng (Cart)

#### TC025: Xem giỏ hàng

- **Bước 1**: Click vào icon giỏ hàng
- **Kết quả mong đợi**: Hiển thị danh sách sản phẩm trong giỏ với đầy đủ thông tin

#### TC026: Cập nhật số lượng

- **Bước 1**: Vào giỏ hàng
- **Bước 2**: Click nút "+" hoặc "-" để thay đổi số lượng
- **Kết quả mong đợi**: Số lượng và tổng tiền được cập nhật

#### TC027: Xóa sản phẩm khỏi giỏ

- **Bước 1**: Vào giỏ hàng
- **Bước 2**: Click "Xóa" trên một sản phẩm
- **Kết quả mong đợi**: Sản phẩm biến mất khỏi giỏ hàng

#### TC028: Đặt hàng

- **Bước 1**: Điền đầy đủ thông tin nhận hàng (tên, SĐT, địa chỉ)
- **Bước 2**: Click "Đặt hàng"
- **Kết quả mong đợi**: Hiển thị toast "Đặt hàng thành công", tự động chuyển đến trang thanh toán

### 9. Thanh toán (Payment)

#### TC029: Chọn phương thức COD

- **Bước 1**: Vào trang thanh toán
- **Bước 2**: Chọn "Thanh toán khi nhận hàng (COD)"
- **Bước 3**: Click "Xác nhận phương thức"
- **Kết quả mong đợi**: Tạo payment thành công, không hiển thị QR

#### TC030: Chọn phương thức online (Bank/MoMo/ZaloPay)

- **Bước 1**: Vào trang thanh toán
- **Bước 2**: Chọn một trong các phương thức online
- **Bước 3**: Click "Xác nhận phương thức"
- **Kết quả mong đợi**: Hiển thị popup QR code với thông tin thanh toán

#### TC031: Hoàn tất thanh toán

- **Bước 1**: Sau khi chọn phương thức và xem QR
- **Bước 2**: Click "Đã thanh toán xong"
- **Kết quả mong đợi**: Cập nhật trạng thái payment thành "paid", order thành "processing"

### 10. Đơn hàng của tôi (User Orders)

#### TC032: Xem danh sách đơn hàng

- **Bước 1**: Đăng nhập với tài khoản user
- **Bước 2**: Vào "Đơn hàng của tôi"
- **Kết quả mong đợi**: Hiển thị tất cả đơn hàng của user với thông tin đầy đủ

#### TC033: Xem chi tiết đơn hàng

- **Bước 1**: Click "Xem chi tiết" trên một đơn hàng
- **Kết quả mong đợi**: Modal hiển thị chi tiết: sản phẩm (tên, ảnh, màu, size), số lượng, giá

#### TC034: Hủy đơn hàng pending

- **Bước 1**: Chọn đơn hàng có trạng thái "pending"
- **Bước 2**: Click "Hủy đơn"
- **Bước 3**: Xác nhận
- **Kết quả mong đợi**: Trạng thái đơn chuyển thành "cancelled"

#### TC035: Không thể hủy đơn đã completed/cancelled

- **Bước 1**: Chọn đơn hàng "completed" hoặc "cancelled"
- **Kết quả mong đợi**: Không có nút "Hủy đơn"

### 11. Dashboard Admin

#### TC036: Xem thống kê tổng quan

- **Bước 1**: Đăng nhập admin
- **Bước 2**: Vào Dashboard
- **Kết quả mong đợi**: Hiển thị số liệu thực từ database: tổng danh mục, khách hàng, sản phẩm, biến thể, đơn hàng, đánh giá

#### TC037: Xem đơn hàng mới

- **Bước 1**: Vào Dashboard
- **Bước 2**: Xem phần "Đơn hàng mới"
- **Kết quả mong đợi**: Hiển thị 5 đơn hàng gần nhất với mã đơn, khách hàng, tổng tiền, trạng thái

#### TC038: Xem sản phẩm bán chạy

- **Bước 1**: Vào Dashboard
- **Bước 2**: Xem phần "Sản phẩm bán chạy"
- **Kết quả mong đợi**: Hiển thị top 5 sản phẩm với số lượng đã bán và doanh thu

### 12. Xử lý lỗi

#### TC039: Xóa item có ràng buộc

- **Mục đích**: Kiểm tra xử lý lỗi khi xóa item có foreign key constraint
- **Bước 1**: Thử xóa sản phẩm/biến thể/danh mục có ràng buộc
- **Kết quả mong đợi**: Hiển thị toast lỗi rõ ràng, app không crash

#### TC040: Xử lý lỗi từ backend

- **Mục đích**: Kiểm tra app không crash khi backend trả lỗi
- **Bước 1**: Gây lỗi từ backend (ví dụ: xóa item không tồn tại)
- **Kết quả mong đợi**: Hiển thị toast lỗi, app vẫn hoạt động bình thường

### 13. Format giá tiền

#### TC041: Hiển thị giá đúng format

- **Mục đích**: Kiểm tra format giá tiền nhất quán
- **Bước 1**: Xem giá ở các trang khác nhau (sản phẩm, giỏ hàng, đơn hàng, admin)
- **Kết quả mong đợi**: Tất cả hiển thị format "X.XXX.XXX vn₫" (không có phần thập phân)

### 14. Trường hợp ngoại lệ (Edge Cases)

#### TC042: Tạo sản phẩm với giá trị null/undefined

- **Mục đích**: Kiểm tra xử lý khi thiếu dữ liệu bắt buộc
- **Bước 1**: Tạo sản phẩm mới không điền tên hoặc giá
- **Kết quả mong đợi**: Hiển thị lỗi validation, không cho phép tạo

#### TC043: Nhập giá trị âm cho giá/số lượng

- **Mục đích**: Kiểm tra validation giá trị âm
- **Bước 1**: Nhập giá âm (ví dụ: -1000) hoặc số lượng âm
- **Kết quả mong đợi**: Hiển thị lỗi hoặc tự động chuyển về 0, không cho phép lưu giá trị âm

#### TC044: Nhập giá trị quá lớn

- **Mục đích**: Kiểm tra xử lý giá trị vượt quá giới hạn
- **Bước 1**: Nhập giá rất lớn (ví dụ: 999999999999) hoặc số lượng rất lớn
- **Kết quả mong đợi**: Hiển thị lỗi hoặc giới hạn giá trị hợp lý

#### TC045: Nhập chuỗi rỗng hoặc chỉ có khoảng trắng

- **Mục đích**: Kiểm tra validation chuỗi rỗng
- **Bước 1**: Nhập tên sản phẩm/danh mục chỉ có khoảng trắng " "
- **Kết quả mong đợi**: Hiển thị lỗi validation, không cho phép lưu

#### TC046: Nhập ký tự đặc biệt và SQL injection

- **Mục đích**: Kiểm tra bảo mật chống SQL injection
- **Bước 1**: Nhập tên sản phẩm: `'; DROP TABLE products; --`
- **Kết quả mong đợi**: Dữ liệu được escape đúng cách, không thực thi SQL, có thể lưu như text thông thường hoặc từ chối

#### TC047: Nhập XSS script

- **Mục đích**: Kiểm tra bảo mật chống XSS
- **Bước 1**: Nhập mô tả: `<script>alert('XSS')</script>`
- **Kết quả mong đợi**: Script không được thực thi, hiển thị như text thông thường

#### TC048: Upload file ảnh quá lớn

- **Mục đích**: Kiểm tra giới hạn kích thước file
- **Bước 1**: Upload file ảnh > 10MB
- **Kết quả mong đợi**: Hiển thị lỗi "File quá lớn", không cho phép upload

#### TC049: Upload file không phải ảnh

- **Mục đích**: Kiểm tra validation loại file
- **Bước 1**: Upload file .pdf hoặc .exe thay vì ảnh
- **Kết quả mong đợi**: Hiển thị lỗi "Chỉ chấp nhận file ảnh", không cho phép upload

#### TC050: Đặt hàng với giỏ hàng trống

- **Mục đích**: Kiểm tra validation giỏ hàng trống
- **Bước 1**: Xóa hết sản phẩm trong giỏ, sau đó click "Đặt hàng"
- **Kết quả mong đợi**: Hiển thị toast "Giỏ hàng trống", không cho phép đặt hàng

#### TC051: Đặt hàng khi chưa đăng nhập

- **Mục đích**: Kiểm tra yêu cầu đăng nhập
- **Bước 1**: Đăng xuất, thêm sản phẩm vào giỏ, click "Đặt hàng"
- **Kết quả mong đợi**: Hiển thị toast "Bạn cần đăng nhập để đặt hàng", chuyển đến trang login

#### TC052: Thêm vào giỏ khi stock = 0

- **Mục đích**: Kiểm tra validation stock = 0
- **Bước 1**: Chọn variant có stock = 0, click "Thêm vào giỏ"
- **Kết quả mong đợi**: Nút bị disable hoặc hiển thị "Đã hết hàng", không cho phép thêm

#### TC053: Tìm kiếm với từ khóa rỗng

- **Mục đích**: Kiểm tra xử lý tìm kiếm rỗng
- **Bước 1**: Nhập khoảng trắng hoặc để trống, nhấn Enter
- **Kết quả mong đợi**: Hiển thị tất cả sản phẩm hoặc không có kết quả, không crash

#### TC054: Xóa item không tồn tại

- **Mục đích**: Kiểm tra xử lý khi xóa ID không hợp lệ
- **Bước 1**: Thử xóa sản phẩm/biến thể với ID không tồn tại (ví dụ: ID = 99999)
- **Kết quả mong đợi**: Hiển thị toast "Không tìm thấy", app không crash

#### TC055: Cập nhật với dữ liệu không hợp lệ

- **Mục đích**: Kiểm tra validation khi cập nhật
- **Bước 1**: Cập nhật sản phẩm với giá = 0 hoặc tên rỗng
- **Kết quả mong đợi**: Hiển thị lỗi validation, không cho phép cập nhật

### 15. Kiểm tra tương tác giữa các chức năng

#### TC056: Xóa category có CASCADE

- **Mục đích**: Kiểm tra khi xóa category, sản phẩm có bị xóa theo không
- **Bước 1**: Tạo category, tạo sản phẩm thuộc category đó
- **Bước 2**: Xóa category (nếu được phép)
- **Kết quả mong đợi**:
  - Nếu có validation: Không cho xóa category có sản phẩm
  - Nếu có CASCADE: Sản phẩm cũng bị xóa theo (cần kiểm tra database)

#### TC057: Xóa variant và stock tự động cập nhật

- **Mục đích**: Kiểm tra stock sản phẩm có tự động cập nhật khi xóa variant
- **Bước 1**: Tạo sản phẩm với 2 variants (stock: 10 và 20)
- **Bước 2**: Xóa variant có stock = 10
- **Kết quả mong đợi**: Stock sản phẩm tự động cập nhật thành 20 (tổng stock các variant còn lại)

#### TC058: Tạo variant và stock tự động cập nhật

- **Mục đích**: Kiểm tra stock sản phẩm có tự động cập nhật khi tạo variant
- **Bước 1**: Tạo sản phẩm với 1 variant (stock: 10)
- **Bước 2**: Tạo variant mới với stock = 15
- **Kết quả mong đợi**: Stock sản phẩm tự động cập nhật thành 25

#### TC059: Cập nhật variant và stock tự động cập nhật

- **Mục đích**: Kiểm tra stock sản phẩm có tự động cập nhật khi cập nhật variant
- **Bước 1**: Có sản phẩm với variant stock = 10
- **Bước 2**: Cập nhật variant stock thành 20
- **Kết quả mong đợi**: Stock sản phẩm tự động cập nhật theo tổng stock mới

#### TC060: Đặt hàng và stock tự động giảm

- **Mục đích**: Kiểm tra stock có giảm khi đặt hàng
- **Bước 1**: Tạo variant với stock = 10
- **Bước 2**: Đặt hàng với số lượng = 3
- **Kết quả mong đợi**: Stock variant giảm còn 7, stock sản phẩm tự động cập nhật

#### TC061: Hủy đơn và stock tự động tăng lại

- **Mục đích**: Kiểm tra stock có tăng lại khi hủy đơn
- **Bước 1**: Đặt hàng với số lượng = 3 (stock giảm từ 10 xuống 7)
- **Bước 2**: Hủy đơn hàng đó
- **Kết quả mong đợi**: Stock variant tăng lại thành 10, stock sản phẩm tự động cập nhật

#### TC062: Xóa đơn hàng và stock không bị ảnh hưởng

- **Mục đích**: Kiểm tra khi admin xóa đơn hàng, stock có bị ảnh hưởng không
- **Bước 1**: Đặt hàng với số lượng = 3 (stock giảm từ 10 xuống 7)
- **Bước 2**: Admin xóa đơn hàng
- **Kết quả mong đợi**: Stock không tự động tăng lại (vì đơn đã được xử lý), hoặc có logic riêng để xử lý

#### TC063: Tạo đơn hàng và payment tự động tạo

- **Mục đích**: Kiểm tra payment có được tạo khi đặt hàng
- **Bước 1**: Đặt hàng thành công
- **Bước 2**: Vào trang thanh toán
- **Kết quả mong đợi**: Payment record được tạo với status "pending"

#### TC064: Cập nhật order status và payment không bị ảnh hưởng

- **Mục đích**: Kiểm tra payment có độc lập với order status không
- **Bước 1**: Cập nhật order status từ "pending" sang "processing"
- **Bước 2**: Kiểm tra payment
- **Kết quả mong đợi**: Payment status không tự động thay đổi, vẫn giữ nguyên

#### TC065: Xóa user và orders có bị ảnh hưởng

- **Mục đích**: Kiểm tra CASCADE khi xóa user
- **Bước 1**: User có đơn hàng
- **Bước 2**: Admin xóa user
- **Kết quả mong đợi**:
  - Nếu có CASCADE: Orders và payments cũng bị xóa
  - Nếu không: Orders vẫn tồn tại nhưng customer_name có thể null

#### TC066: Xóa sản phẩm và variants có bị ảnh hưởng

- **Mục đích**: Kiểm tra CASCADE khi xóa sản phẩm
- **Bước 1**: Sản phẩm có nhiều variants
- **Bước 2**: Xóa sản phẩm (nếu được phép)
- **Kết quả mong đợi**:
  - Nếu có CASCADE: Tất cả variants cũng bị xóa
  - Nếu có validation: Không cho xóa nếu còn variants

#### TC067: Tạo review và rating trung bình tự động cập nhật

- **Mục đích**: Kiểm tra rating_avg có tự động cập nhật không
- **Bước 1**: Sản phẩm có rating_avg = 4.0
- **Bước 2**: Tạo review mới với rating = 5
- **Kết quả mong đợi**: Rating_avg tự động cập nhật (hoặc không nếu chưa implement)

#### TC068: Xóa review và rating trung bình tự động cập nhật

- **Mục đích**: Kiểm tra rating_avg có tự động cập nhật khi xóa review
- **Bước 1**: Xóa một review
- **Bước 2**: Kiểm tra rating_avg của sản phẩm
- **Kết quả mong đợi**: Rating_avg tự động cập nhật lại (hoặc không nếu chưa implement)

#### TC069: Tìm kiếm và lọc category cùng lúc

- **Mục đích**: Kiểm tra tìm kiếm và lọc có conflict không
- **Bước 1**: Chọn một category trong sidebar
- **Bước 2**: Nhập từ khóa tìm kiếm
- **Kết quả mong đợi**:
  - Tìm kiếm ưu tiên hơn lọc category, hoặc
  - Lọc category ưu tiên hơn tìm kiếm, hoặc
  - Kết hợp cả hai (sản phẩm vừa thuộc category vừa match từ khóa)

#### TC070: Đặt nhiều đơn hàng liên tiếp

- **Mục đích**: Kiểm tra xử lý khi đặt nhiều đơn liên tiếp
- **Bước 1**: Đặt đơn hàng thứ nhất
- **Bước 2**: Ngay lập tức đặt đơn hàng thứ hai với cùng sản phẩm
- **Kết quả mong đợi**: Cả hai đơn đều được tạo thành công, stock được trừ đúng

#### TC071: Cập nhật variant stock và product stock đồng bộ

- **Mục đích**: Kiểm tra đồng bộ stock giữa variant và product
- **Bước 1**: Có sản phẩm với 2 variants (stock: 10 và 20)
- **Bước 2**: Cập nhật variant 1 stock thành 15
- **Kết quả mong đợi**: Product stock tự động cập nhật thành 35 (15 + 20)

#### TC072: Xóa tất cả variants và product stock = 0

- **Mục đích**: Kiểm tra khi xóa hết variants, product stock có = 0 không
- **Bước 1**: Sản phẩm có 2 variants
- **Bước 2**: Xóa tất cả variants
- **Kết quả mong đợi**: Product stock tự động = 0

#### TC073: Tạo order và order_items đồng bộ

- **Mục đích**: Kiểm tra order_items có được tạo đúng với order không
- **Bước 1**: Đặt hàng với 3 sản phẩm khác nhau
- **Bước 2**: Kiểm tra trong database
- **Kết quả mong đợi**: Có 3 records trong order_items, tất cả đều có id_order đúng

#### TC074: Payment và order status độc lập

- **Mục đích**: Kiểm tra payment status và order status có độc lập không
- **Bước 1**: Tạo payment với status "pending"
- **Bước 2**: Cập nhật order status thành "processing"
- **Kết quả mong đợi**: Payment status vẫn là "pending", không tự động đổi

#### TC075: Dashboard cập nhật real-time

- **Mục đích**: Kiểm tra dashboard có cập nhật khi có thay đổi không
- **Bước 1**: Xem dashboard, ghi nhận số liệu
- **Bước 2**: Tạo sản phẩm mới, xóa đơn hàng, v.v.
- **Bước 3**: Refresh trang dashboard
- **Kết quả mong đợi**: Số liệu được cập nhật theo dữ liệu mới nhất

## Ghi chú kiểm thử

- Tất cả các thao tác xóa đều có confirm dialog
- Tất cả các thao tác thành công/thất bại đều hiển thị toast notification
- App không crash khi có lỗi từ backend
- Format giá tiền nhất quán trên toàn bộ ứng dụng
- Validation đầy đủ cho các trường hợp đặc biệt (hết hàng, ràng buộc, v.v.)
- Xử lý lỗi an toàn với try-catch đầy đủ
- Kiểm tra null/undefined trước khi thực hiện thao tác
- Stock tự động đồng bộ giữa variant và product
- Foreign key constraints được kiểm tra trước khi xóa
