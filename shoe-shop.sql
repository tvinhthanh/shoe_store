-- Tạo database (nếu cần)
CREATE DATABASE IF NOT EXISTS `shop_giay`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `shop_giay`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ========================================
-- BẢNG DANHMUC (Category)
-- ========================================
CREATE TABLE `DanhMuc` (
  `categoryId`    int(11) NOT NULL AUTO_INCREMENT,
  `tenDanhMuc`    varchar(255) NOT NULL,
  `moTa`          text DEFAULT NULL,
  `hinhAnh`       varchar(255) DEFAULT NULL,
  `trangThai`     varchar(50) DEFAULT 'active',
  `createdAt`     timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`     timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG HANGHOA (Product / Product + Variant)
-- Mỗi dòng là 1 sản phẩm (có thể coi là 1 variant nếu anh dùng size/màu tách riêng)
-- ========================================
CREATE TABLE `HangHoa` (
  `productId`        int(11) NOT NULL AUTO_INCREMENT,
  `categoryId`       int(11) NOT NULL,
  `sku`              varchar(100) NOT NULL,
  `tenSanPham`       varchar(255) NOT NULL,
  `moTaNgan`         text DEFAULT NULL,
  `moTaChiTiet`      text DEFAULT NULL,
  `giaNhap`          decimal(10,2) DEFAULT 0.00,
  `giaBan`           decimal(10,2) NOT NULL,
  `giaKhuyenMai`     decimal(10,2) DEFAULT NULL,
  `soLuongTon`       int(11) NOT NULL DEFAULT 0,
  `soLuongDaBan`     int(11) NOT NULL DEFAULT 0,
  `trongLuong`       decimal(10,2) DEFAULT NULL,
  `trangThai`        varchar(50) DEFAULT 'active',
  `createdAt`        timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`        timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`),
  UNIQUE KEY `UK_HangHoa_sku` (`sku`),
  KEY `FK_HangHoa_DanhMuc` (`categoryId`),
  CONSTRAINT `FK_HangHoa_DanhMuc`
    FOREIGN KEY (`categoryId`) REFERENCES `DanhMuc` (`categoryId`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG NGUOIDUNG (User)
-- ========================================
CREATE TABLE `NguoiDung` (
  `userId`        int(11) NOT NULL AUTO_INCREMENT,
  `hoTen`         varchar(100) NOT NULL,
  `email`         varchar(100) NOT NULL,
  `soDienThoai`   varchar(20) DEFAULT NULL,
  `matKhau`       varchar(255) NOT NULL,
  `vaiTro`        enum('admin','seller','customer') DEFAULT 'customer',
  `trangThai`     varchar(50) DEFAULT 'active',
  `createdAt`     timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`     timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `UK_NguoiDung_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG GIOHANG (Cart)
-- ========================================
CREATE TABLE `GioHang` (
  `cartId`       int(11) NOT NULL AUTO_INCREMENT,
  `userId`       int(11) NOT NULL,
  `trangThai`    enum('active','ordered','abandoned') DEFAULT 'active',
  `tongSoLuong`  int(11) NOT NULL DEFAULT 0,
  `tongTien`     decimal(10,2) NOT NULL DEFAULT 0.00,
  `lastUpdated`  timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cartId`),
  KEY `FK_GioHang_NguoiDung` (`userId`),
  CONSTRAINT `FK_GioHang_NguoiDung`
    FOREIGN KEY (`userId`) REFERENCES `NguoiDung` (`userId`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG GIOHANGITEM (Cart Items)
-- ========================================
CREATE TABLE `GioHangItem` (
  `cartItemId`     int(11) NOT NULL AUTO_INCREMENT,
  `cartId`         int(11) NOT NULL,
  `productId`      int(11) NOT NULL,
  `soLuong`        int(11) NOT NULL DEFAULT 1,
  `donGia`         decimal(10,2) NOT NULL,
  `thanhTien`      decimal(10,2) NOT NULL,
  `createdAt`      timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cartItemId`),
  KEY `FK_GioHangItem_GioHang` (`cartId`),
  KEY `FK_GioHangItem_HangHoa` (`productId`),
  CONSTRAINT `FK_GioHangItem_GioHang`
    FOREIGN KEY (`cartId`) REFERENCES `GioHang` (`cartId`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_GioHangItem_HangHoa`
    FOREIGN KEY (`productId`) REFERENCES `HangHoa` (`productId`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG DONHANG (Order)
-- ========================================
CREATE TABLE `DonHang` (
  `orderId`       int(11) NOT NULL AUTO_INCREMENT,
  `userId`        int(11) NOT NULL,
  `maDonHang`     varchar(50) NOT NULL,
  `tongSoLuong`   int(11) NOT NULL DEFAULT 0,
  `tongTien`      decimal(10,2) NOT NULL DEFAULT 0.00,
  `trangThai`     enum('pending','confirmed','shipping','completed','cancelled')
                    DEFAULT 'pending',
  `tenNguoiNhan`  varchar(100) NOT NULL,
  `soDienThoai`   varchar(20) NOT NULL,
  `diaChiNhan`    varchar(255) NOT NULL,
  `ghiChu`        text DEFAULT NULL,
  `ngayDat`       timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngayCapNhat`   timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`orderId`),
  UNIQUE KEY `UK_DonHang_maDonHang` (`maDonHang`),
  KEY `FK_DonHang_NguoiDung` (`userId`),
  CONSTRAINT `FK_DonHang_NguoiDung`
    FOREIGN KEY (`userId`) REFERENCES `NguoiDung` (`userId`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG CHITIETDONHANG (Order Details)
-- ========================================
CREATE TABLE `ChiTietDonHang` (
  `orderDetailId`  int(11) NOT NULL AUTO_INCREMENT,
  `orderId`        int(11) NOT NULL,
  `productId`      int(11) NOT NULL,
  `soLuong`        int(11) NOT NULL,
  `donGia`         decimal(10,2) NOT NULL,
  `thanhTien`      decimal(10,2) NOT NULL,
  PRIMARY KEY (`orderDetailId`),
  KEY `FK_ChiTietDonHang_DonHang` (`orderId`),
  KEY `FK_ChiTietDonHang_HangHoa` (`productId`),
  CONSTRAINT `FK_ChiTietDonHang_DonHang`
    FOREIGN KEY (`orderId`) REFERENCES `DonHang` (`orderId`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ChiTietDonHang_HangHoa`
    FOREIGN KEY (`productId`) REFERENCES `HangHoa` (`productId`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG THANHTOAN (Payment)
-- ========================================
CREATE TABLE `ThanhToan` (
  `paymentId`      int(11) NOT NULL AUTO_INCREMENT,
  `orderId`        int(11) NOT NULL,
  `soTien`         decimal(10,2) NOT NULL,
  `phuongThuc`     enum('COD','VNPAY','MOMO','BANK') DEFAULT 'COD',
  `trangThai`      enum('pending','success','failed','refunded') DEFAULT 'pending',
  `maGiaoDich`     varchar(100) DEFAULT NULL,
  `ghiChu`         text DEFAULT NULL,
  `thoiGian`       timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`paymentId`),
  UNIQUE KEY `UK_ThanhToan_orderId` (`orderId`),
  KEY `FK_ThanhToan_DonHang` (`orderId`),
  CONSTRAINT `FK_ThanhToan_DonHang`
    FOREIGN KEY (`orderId`) REFERENCES `DonHang` (`orderId`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- BẢNG DANHGIA (Review)
-- ========================================
CREATE TABLE `DanhGia` (
  `reviewId`    int(11) NOT NULL AUTO_INCREMENT,
  `productId`   int(11) NOT NULL,
  `userId`      int(11) NOT NULL,
  `rating`      int(11) NOT NULL,
  `noiDung`     text DEFAULT NULL,
  `createdAt`   timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewId`),
  KEY `FK_DanhGia_HangHoa` (`productId`),
  KEY `FK_DanhGia_NguoiDung` (`userId`),
  CONSTRAINT `FK_DanhGia_HangHoa`
    FOREIGN KEY (`productId`) REFERENCES `HangHoa` (`productId`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_DanhGia_NguoiDung`
    FOREIGN KEY (`userId`) REFERENCES `NguoiDung` (`userId`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
