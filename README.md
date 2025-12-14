# Port Killer

Ứng dụng desktop Windows dành cho các nhà phát triển để phát hiện và giải quyết xung đột cổng. Được xây dựng bằng Tauri, React, TypeScript và Rust.

## 📥 Tải về & Cài đặt Nhanh

### Tải về

- **MSI Installer** (Khuyến nghị): [port-killer_0.1.0_x64_en-US.msi](https://github.com/hoan02/port-killer/releases/latest/download/port-killer_0.1.0_x64_en-US.msi)
- **NSIS Installer**: [port-killer_0.1.0_x64-setup.exe](https://github.com/hoan02/port-killer/releases/latest/download/port-killer_0.1.0_x64-setup.exe)
- **Portable Executable**: [port-killer.exe](https://github.com/hoan02/port-killer/releases/latest/download/port-killer.exe)
- **Xem tất cả releases**: [Releases](https://github.com/hoan02/port-killer/releases)

### Cài đặt Nhanh

1. **Tải file cài đặt** từ [Releases](https://github.com/hoan02/port-killer/releases/latest)
2. **Chạy installer** hoặc giải nén file portable
3. **Chạy với quyền Quản trị viên** (nhấp chuột phải → "Run as administrator")
4. **Sử dụng ngay!** Ứng dụng sẽ tự động hiển thị danh sách các cổng đang lắng nghe

> ⚠️ **Lưu ý**: Ứng dụng yêu cầu quyền Quản trị viên để có thể kết thúc các tiến trình.

### Cài đặt từ Source Code (Dành cho Developers)

Nếu bạn muốn build từ source code:

```bash
# 1. Clone repository
git clone https://github.com/hoan02/port-killer.git
cd port-killer

# 2. Cài đặt dependencies
npm install

# 3. Chạy ở chế độ development
npm run tauri:dev

# 4. Build cho production
npm run tauri:build
```

**Yêu cầu cho Development:**

- Node.js 18+ và npm
- Rust (cài đặt từ https://rustup.rs/)
- Visual Studio Build Tools với C++ workload (xem [SETUP.md](./SETUP.md) để biết chi tiết)

---

## ✨ Tính năng

- **Liệt kê Cổng Đang Lắng Nghe**: Xem tất cả các cổng TCP ở trạng thái LISTENING cùng với các tiến trình liên quan
- **Thông tin Tiến trình**: Xem số cổng, PID và tên tiến trình cho mỗi cổng đang lắng nghe
- **Tìm kiếm & Lọc**: Nhanh chóng tìm cổng theo số, tên tiến trình hoặc PID
- **Kết thúc Tiến trình**: Chấm dứt các tiến trình đang sử dụng cổng cụ thể
- **Tự động Làm mới**: Tự động cập nhật danh sách cổng mỗi 2 giây
- **Giao diện Hiện đại**: Giao diện sạch sẽ, thân thiện với nhà phát triển được xây dựng bằng shadcn/ui và Tailwind CSS

## 📋 Yêu cầu Hệ thống

- **Windows 10/11** (chỉ hỗ trợ Windows)
- **Quyền Quản trị viên** (bắt buộc để kết thúc tiến trình)

---

## 🚀 Hướng dẫn Sử dụng

### Cách sử dụng Cơ bản

1. **Khởi động ứng dụng** (với quyền Quản trị viên)
2. **Xem danh sách cổng**: Danh sách tự động làm mới mỗi 2 giây
3. **Tìm kiếm**: Sử dụng ô tìm kiếm để lọc cổng theo số, tên tiến trình hoặc PID
4. **Kết thúc tiến trình**: Nhấp "Kill" bên cạnh một tiến trình và xác nhận trong hộp thoại

### Chạy với Quyền Quản trị viên

**Quan trọng**: Ứng dụng yêu cầu quyền Quản trị viên để kết thúc tiến trình.

**Cách 1: Chạy một lần**

1. Nhấp chuột phải vào file thực thi
2. Chọn **"Chạy với tư cách quản trị viên"**

**Cách 2: Luôn chạy với quyền Admin**

1. Nhấp chuột phải vào file thực thi → Properties
2. Chuyển đến tab "Compatibility"
3. Tích vào "Run this program as an administrator"
4. Nhấn OK

---

## 💻 Phát triển

### Chạy ở chế độ Development

```bash
npm run tauri:dev
```

Lệnh này sẽ:

- Khởi động Vite dev server tại `http://localhost:1420`
- Biên dịch Rust backend
- Mở cửa sổ ứng dụng Tauri

### Cài đặt Dependencies

```bash
# Cài đặt npm packages
npm install

# Cài đặt Rust (nếu chưa có)
# Truy cập https://rustup.rs/ và làm theo hướng dẫn
```

### Cài đặt Môi trường Phát triển

Xem [SETUP.md](./SETUP.md) để biết hướng dẫn chi tiết về:

- Cài đặt Node.js và npm
- Cài đặt Rust
- Cài đặt Visual Studio Build Tools (bắt buộc cho Windows)

### Build cho Production

```bash
npm run tauri:build
```

**Kết quả Build:**

- File thực thi: `src-tauri/target/release/port-killer.exe`
- Installer: MSI hoặc NSIS (trong `src-tauri/target/release/bundle/`)

---

## 🏗️ Kiến trúc

### Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Rust với Tauri commands
- **Tích hợp Hệ thống**: Windows API (IP Helper API, Process Management)

### Cấu trúc Dự án

```
port-killer/
├── src/                    # Frontend React
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── features/      # Feature components
│   │   └── layout/        # Layout components
│   ├── hooks/             # Custom React hooks
│   ├── api/               # Tauri API layer
│   └── lib/               # Utilities
├── src-tauri/             # Rust backend
│   └── src/main.rs        # Tauri commands & Windows API
└── ...
```

Xem [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md) để biết chi tiết về cấu trúc frontend.

---

## 🔒 Lưu ý Bảo mật

- ⚠️ Ứng dụng yêu cầu quyền Quản trị viên để chấm dứt tiến trình
- ⚠️ Việc chấm dứt tiến trình **không thể hoàn tác** - sử dụng cẩn thận
- ⚠️ Một số tiến trình hệ thống có thể được bảo vệ và không thể chấm dứt
- ✅ Ứng dụng chỉ liệt kê và quản lý các cổng TCP ở trạng thái LISTENING
- ✅ Không thu thập hoặc gửi dữ liệu ra ngoài

---

## 🔧 Khắc phục Sự cố

### Lỗi "Access Denied"

- Đảm bảo bạn đang chạy ứng dụng với quyền Quản trị viên
- Một số tiến trình hệ thống không thể chấm dứt ngay cả với quyền Quản trị viên

### Danh sách Cổng Không Cập nhật

- Kiểm tra ứng dụng có quyền phù hợp
- Xác minh Windows Firewall không chặn ứng dụng
- Thử khởi động lại ứng dụng

### Lỗi Build

- Đảm bảo Rust đã được cài đặt đúng: `rustc --version`
- Cập nhật Rust toolchain: `rustup update`
- Xóa build cache: `cd src-tauri && cargo clean`

### Lỗi "linker `link.exe` not found"

Lỗi này xảy ra khi thiếu Microsoft Visual C++ Build Tools. Có 2 cách khắc phục:

**Cách 1: Cài đặt Visual Studio Build Tools (Khuyến nghị)**

1. Tải Visual Studio Build Tools từ: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. Chạy installer và chọn "Desktop development with C++" workload
3. Đảm bảo các components sau được chọn:
   - MSVC v143 - VS 2022 C++ x64/x86 build tools
   - Windows 10/11 SDK
   - C++ CMake tools for Windows
4. Sau khi cài đặt, khởi động lại terminal và chạy lại `npm run tauri:dev`

**Cách 2: Sử dụng GNU Toolchain (Thay thế)**

```bash
rustup toolchain install stable-x86_64-pc-windows-gnu
rustup default stable-x86_64-pc-windows-gnu
```

Lưu ý: Cách này có thể gặp một số vấn đề tương thích với một số crate Windows.

---

## 📜 Scripts Phát triển

| Lệnh                  | Mô tả                               |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Chỉ khởi động Vite dev server       |
| `npm run tauri:dev`   | Khởi động Tauri ở chế độ phát triển |
| `npm run tauri:build` | Build cho production                |
| `npm run build`       | Chỉ build frontend                  |

---

## 📚 Tài liệu Thêm

- [SETUP.md](./SETUP.md) - Hướng dẫn cài đặt môi trường phát triển chi tiết
- [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md) - Cấu trúc và kiến trúc frontend

---

## 📄 Giấy phép

[Thêm giấy phép của bạn ở đây]

## 🤝 Đóng góp

[Thêm hướng dẫn đóng góp ở đây]

---

## ⭐ Star & Support

Nếu dự án này hữu ích với bạn, hãy cho một ⭐ trên GitHub!
