# Hướng dẫn Tạo GitHub Release

## Tạo Release qua GitHub Web Interface

### Bước 1: Tạo Release

1. Truy cập repository trên GitHub
2. Click vào tab **"Releases"** (hoặc truy cập: `https://github.com/hoan02/port-killer/releases`)
3. Click **"Create a new release"** hoặc **"Draft a new release"**

### Bước 2: Điền thông tin Release

- **Tag version**: `v0.1.0` (hoặc version bạn muốn)
  - Chọn **"Create new tag: v0.1.0"** nếu tag chưa tồn tại
- **Release title**: `Port Killer v0.1.0` (hoặc tên bạn muốn)
- **Description**: Copy nội dung từ template bên dưới

### Bước 3: Upload Files

1. Kéo thả hoặc click **"Attach binaries"** để upload:

   - `port-killer_0.1.0_x64_en-US.msi` (MSI installer)
   - `port-killer_0.1.0_x64-setup.exe` (NSIS installer)
   - `port-killer.exe` (Portable executable - optional)

2. Đường dẫn file build:
   ```
   src-tauri/target/release/bundle/msi/port-killer_0.1.0_x64_en-US.msi
   src-tauri/target/release/bundle/nsis/port-killer_0.1.0_x64-setup.exe
   src-tauri/target/release/port-killer.exe
   ```

### Bước 4: Publish

- Click **"Publish release"** (hoặc **"Save draft"** nếu muốn chỉnh sửa sau)

---

## Tạo Release qua GitHub CLI (gh)

### Cài đặt GitHub CLI

```powershell
# Cài đặt qua winget
winget install --id GitHub.cli

# Hoặc tải từ: https://cli.github.com/
```

### Tạo Release

```powershell
# 1. Đăng nhập GitHub CLI
gh auth login

# 2. Tạo release với files
gh release create v0.1.0 `
  --title "Port Killer v0.1.0" `
  --notes "## 🎉 Port Killer v0.1.0

### Tính năng
- Liệt kê các cổng TCP đang lắng nghe
- Xem thông tin tiến trình (PID, tên)
- Tìm kiếm và lọc cổng
- Kết thúc tiến trình
- Auto-refresh mỗi 2 giây
- Giao diện hiện đại với shadcn/ui

### Cài đặt
1. Tải file installer (MSI hoặc NSIS)
2. Chạy installer
3. Chạy ứng dụng với quyền Quản trị viên

### Yêu cầu
- Windows 10/11
- Quyền Quản trị viên" `
  "src-tauri\target\release\bundle\msi\port-killer_0.1.0_x64_en-US.msi" `
  "src-tauri\target\release\bundle\nsis\port-killer_0.1.0_x64-setup.exe" `
  "src-tauri\target\release\port-killer.exe"
```

---

## Template Release Notes

```markdown
## 🎉 Port Killer v0.1.0

### ✨ Tính năng mới

- Liệt kê tất cả các cổng TCP đang lắng nghe
- Hiển thị thông tin tiến trình (Port, PID, Process Name)
- Tìm kiếm và lọc cổng theo số, tên tiến trình hoặc PID
- Kết thúc tiến trình với xác nhận
- Tự động làm mới danh sách mỗi 2 giây
- Giao diện hiện đại với shadcn/ui và Tailwind CSS

### 📥 Cài đặt

**MSI Installer** (Khuyến nghị):

- Tải `port-killer_0.1.0_x64_en-US.msi`
- Chạy installer và làm theo hướng dẫn

**NSIS Installer**:

- Tải `port-killer_0.1.0_x64-setup.exe`
- Chạy installer và làm theo hướng dẫn

**Portable**:

- Tải `port-killer.exe`
- Chạy trực tiếp (không cần cài đặt)

### ⚠️ Lưu ý

- Ứng dụng yêu cầu **quyền Quản trị viên** để kết thúc tiến trình
- Nhấp chuột phải vào file → "Run as administrator"

### 📋 Yêu cầu

- Windows 10/11
- Quyền Quản trị viên

### 🔗 Tài liệu

- [README.md](https://github.com/hoan02/port-killer/blob/main/README.md)
- [SETUP.md](https://github.com/hoan02/port-killer/blob/main/SETUP.md)

### 🐛 Báo lỗi

Nếu gặp vấn đề, vui lòng tạo [Issue](https://github.com/hoan02/port-killer/issues) trên GitHub.
```

---

## Tự động hóa với GitHub Actions (Tùy chọn)

Tạo file `.github/workflows/release.yml` để tự động tạo release khi push tag:

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable

      - name: Install dependencies
        run: npm install

      - name: Build Tauri
        run: npm run tauri:build

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            src-tauri/target/release/bundle/msi/*.msi
            src-tauri/target/release/bundle/nsis/*.exe
            src-tauri/target/release/port-killer.exe
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Cập nhật README với Link Release

Sau khi tạo release, cập nhật README.md:

```markdown
### Tải về

- **Windows Installer**: [Tải về phiên bản mới nhất](https://github.com/hoan02/port-killer/releases/latest)
- **Portable Executable**: [port-killer.exe](https://github.com/hoan02/port-killer/releases/latest/download/port-killer.exe)
```

Thay `hoan02` bằng username GitHub của bạn.

---

## Tips

1. **Versioning**: Sử dụng [Semantic Versioning](https://semver.org/) (v0.1.0, v0.2.0, v1.0.0)
2. **Release Notes**: Viết rõ ràng về tính năng mới, bug fixes
3. **Assets**: Đảm bảo upload đúng file cho platform (Windows)
4. **Changelog**: Có thể tạo file CHANGELOG.md để theo dõi các thay đổi
