# Hướng dẫn Cài đặt Môi trường Phát triển

## Yêu cầu Hệ thống

### 1. Node.js và npm

- Tải và cài đặt Node.js 18+ từ: https://nodejs.org/
- Kiểm tra cài đặt: `node --version` và `npm --version`

### 2. Rust

- Tải và cài đặt Rust từ: https://rustup.rs/
- Chạy lệnh cài đặt và làm theo hướng dẫn
- Kiểm tra cài đặt: `rustc --version` và `cargo --version`

### 3. Microsoft Visual C++ Build Tools (BẮT BUỘC cho Windows)

Rust trên Windows cần MSVC linker để biên dịch. Có 2 cách cài đặt:

#### Cách 1: Visual Studio Build Tools (Khuyến nghị)

1. **Tải Visual Studio Build Tools:**

   - Truy cập: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
   - Tải "Build Tools for Visual Studio 2022"

2. **Cài đặt:**

   - Chạy installer
   - Chọn "Desktop development with C++" workload
   - Đảm bảo các components sau được chọn:
     - ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools
     - ✅ Windows 10/11 SDK (chọn phiên bản mới nhất)
     - ✅ C++ CMake tools for Windows
   - Nhấn "Install"

3. **Khởi động lại:**
   - Đóng tất cả terminal/PowerShell
   - Mở lại terminal mới
   - Chạy `npm run tauri:dev` để kiểm tra

#### Cách 2: Visual Studio Community (Đầy đủ hơn)

Nếu bạn muốn cài đặt Visual Studio đầy đủ:

1. Tải Visual Studio Community từ: https://visualstudio.microsoft.com/vs/community/
2. Trong quá trình cài đặt, chọn "Desktop development with C++"
3. Các components tương tự như Cách 1

#### Cách 3: GNU Toolchain (Thay thế, không khuyến nghị)

Nếu không muốn cài Visual Studio Build Tools:

```powershell
# Cài đặt GNU toolchain
rustup toolchain install stable-x86_64-pc-windows-gnu

# Đặt làm mặc định
rustup default stable-x86_64-pc-windows-gnu

# Thêm target
rustup target add x86_64-pc-windows-gnu
```

**Lưu ý:** GNU toolchain có thể gặp vấn đề tương thích với một số crate Windows-specific.

## Kiểm tra Cài đặt

Sau khi cài đặt tất cả, chạy các lệnh sau để kiểm tra:

```powershell
# Kiểm tra Node.js
node --version
npm --version

# Kiểm tra Rust
rustc --version
cargo --version

# Kiểm tra MSVC (nếu đã cài)
where link.exe
```

## Cài đặt Dependencies

Sau khi đã cài đặt tất cả yêu cầu:

```powershell
# Cài đặt npm packages
npm install

# Chạy ứng dụng
npm run tauri:dev
```

## Khắc phục Sự cố

### Lỗi "link.exe not found"

- Đảm bảo đã cài Visual Studio Build Tools với C++ workload
- Khởi động lại terminal sau khi cài đặt
- Kiểm tra PATH có chứa Visual Studio tools

### Lỗi "cargo not found"

- Đảm bảo Rust đã được cài đặt
- Khởi động lại terminal
- Kiểm tra PATH: `$env:PATH -split ';' | Select-String rust`

### Lỗi "npm not found"

- Đảm bảo Node.js đã được cài đặt
- Khởi động lại terminal
- Kiểm tra PATH có chứa Node.js

## Liên kết Hữu ích

- Rust Installation: https://rustup.rs/
- Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
- Tauri Documentation: https://tauri.app/
- Node.js: https://nodejs.org/
