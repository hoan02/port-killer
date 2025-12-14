# Script để tạo GitHub Release
# Sử dụng: .\scripts\create-release.ps1 -Version "v0.1.0"

param(
    [Parameter(Mandatory=$false)]
    [string]$Version,
    
    [string]$Title,
    [string]$Repo = "hoan02/port-killer"
)

# Nếu không có version, đọc từ package.json
if (-not $Version) {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $Version = "v$($packageJson.version)"
    Write-Host "📦 Sử dụng version từ package.json: $Version" -ForegroundColor Cyan
}

# Nếu không có title, tạo từ version
if (-not $Title) {
    $Title = "Port Killer $Version"
}

Write-Host "🚀 Tạo GitHub Release: $Version" -ForegroundColor Cyan

# Kiểm tra GitHub CLI
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Cài đặt: winget install --id GitHub.cli" -ForegroundColor Yellow
    Write-Host "Hoặc tải từ: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra đã đăng nhập
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Chưa đăng nhập GitHub CLI!" -ForegroundColor Red
    Write-Host "Chạy: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra files build có tồn tại
$msiPath = "src-tauri\target\release\bundle\msi\port-killer_0.1.0_x64_en-US.msi"
$nsisPath = "src-tauri\target\release\bundle\nsis\port-killer_0.1.0_x64-setup.exe"
$exePath = "src-tauri\target\release\port-killer.exe"

$files = @()
if (Test-Path $msiPath) {
    $files += $msiPath
    Write-Host "✅ Tìm thấy MSI installer" -ForegroundColor Green
} else {
    Write-Host "⚠️  Không tìm thấy MSI installer: $msiPath" -ForegroundColor Yellow
}

if (Test-Path $nsisPath) {
    $files += $nsisPath
    Write-Host "✅ Tìm thấy NSIS installer" -ForegroundColor Green
} else {
    Write-Host "⚠️  Không tìm thấy NSIS installer: $nsisPath" -ForegroundColor Yellow
}

if (Test-Path $exePath) {
    $files += $exePath
    Write-Host "✅ Tìm thấy Portable executable" -ForegroundColor Green
} else {
    Write-Host "⚠️  Không tìm thấy Portable executable: $exePath" -ForegroundColor Yellow
}

if ($files.Count -eq 0) {
    Write-Host "❌ Không tìm thấy file build nào!" -ForegroundColor Red
    Write-Host "Chạy: npm run tauri:build" -ForegroundColor Yellow
    exit 1
}

# Tạo release notes
$releaseNotes = @"
## 🎉 Port Killer $Version

### ✨ Tính năng
- Liệt kê tất cả các cổng TCP đang lắng nghe
- Hiển thị thông tin tiến trình (Port, PID, Process Name)
- Tìm kiếm và lọc cổng theo số, tên tiến trình hoặc PID
- Kết thúc tiến trình với xác nhận
- Tự động làm mới danh sách mỗi 2 giây
- Giao diện hiện đại với shadcn/ui và Tailwind CSS

### 📥 Cài đặt

**MSI Installer** (Khuyến nghị):
- Tải file \`.msi\` và chạy installer

**NSIS Installer**:
- Tải file \`.exe\` và chạy installer

**Portable**:
- Tải \`port-killer.exe\` và chạy trực tiếp

### ⚠️ Lưu ý
- Ứng dụng yêu cầu **quyền Quản trị viên** để kết thúc tiến trình
- Nhấp chuột phải vào file → "Run as administrator"

### 📋 Yêu cầu
- Windows 10/11
- Quyền Quản trị viên
"@

# Tạo release
Write-Host "`n📤 Đang tạo release..." -ForegroundColor Cyan

# Tạo file tạm cho release notes để tránh lỗi parsing
$tempNotesFile = [System.IO.Path]::GetTempFileName()
$releaseNotes | Out-File -FilePath $tempNotesFile -Encoding UTF8 -NoNewline

try {
    # Tạo array arguments cho gh release create
    $ghArgs = @(
        "release", "create", $Version,
        "--title", $Title,
        "--notes-file", $tempNotesFile
    )
    $ghArgs += $files

    Write-Host "Chạy lệnh: gh release create $Version ..." -ForegroundColor Gray
    & gh $ghArgs
} finally {
    # Xóa file tạm
    if (Test-Path $tempNotesFile) {
        Remove-Item $tempNotesFile -Force
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Release đã được tạo thành công!" -ForegroundColor Green
    Write-Host "🔗 Xem tại: https://github.com/$Repo/releases/tag/$Version" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Có lỗi xảy ra khi tạo release!" -ForegroundColor Red
    exit 1
}

