# Script để tạo GitHub Release
# Sử dụng: .\scripts\create-release.ps1 -Version "v0.2.0"

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
# Lấy version number từ $Version (bỏ "v" prefix nếu có)
$versionNumber = $Version -replace "^v", ""
$msiPath = "src-tauri\target\release\bundle\msi\port-killer_${versionNumber}_x64_en-US.msi"
$nsisPath = "src-tauri\target\release\bundle\nsis\port-killer_${versionNumber}_x64-setup.exe"
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

# Tạo checksum files nếu có file
if ($files.Count -gt 0) {
    Write-Host "`n📝 Đang tạo checksum files..." -ForegroundColor Cyan
    $checksumFile = "src-tauri\target\release\SHA256SUMS.txt"
    $checksumContent = @()
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            $hash = Get-FileHash -Path $file -Algorithm SHA256
            $fileName = Split-Path $file -Leaf
            $checksumContent += "$($hash.Hash)  $fileName"
            Write-Host "✅ Checksum cho $fileName" -ForegroundColor Green
        }
    }
    
    if ($checksumContent.Count -gt 0) {
        $checksumContent | Out-File -FilePath $checksumFile -Encoding UTF8
        $files += $checksumFile
        Write-Host "✅ Tạo checksum file: $checksumFile" -ForegroundColor Green
    }
}

# Tạo source code zip (sử dụng git archive nếu có git)
$sourceZipPath = "port-killer-${versionNumber}-source.zip"
if (Test-Path $sourceZipPath) {
    Remove-Item $sourceZipPath -Force
}

Write-Host "`n📦 Đang tạo source code archive..." -ForegroundColor Cyan
if (Get-Command git -ErrorAction SilentlyContinue) {
    try {
        # Sử dụng git archive để tạo source zip (loại trừ node_modules, dist, target)
        $gitArchiveCmd = "git archive --format=zip --output=$sourceZipPath HEAD"
        Invoke-Expression $gitArchiveCmd
        if (Test-Path $sourceZipPath) {
            $files += $sourceZipPath
            Write-Host "✅ Tạo source code archive: $sourceZipPath" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Không thể tạo source code archive với git: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Git không có sẵn, bỏ qua source code archive" -ForegroundColor Yellow
}

if ($files.Count -eq 0) {
    Write-Host "❌ Không tìm thấy file build nào!" -ForegroundColor Red
    Write-Host "Chạy: npm run tauri:build" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📊 Tổng số file assets: $($files.Count)" -ForegroundColor Cyan

# Kiểm tra và xử lý tag
Write-Host "`n🏷️  Kiểm tra tag $Version..." -ForegroundColor Cyan
$tagExistsLocal = $false
$tagExistsRemote = $false

# Kiểm tra tag local
if (Get-Command git -ErrorAction SilentlyContinue) {
    $localTags = git tag -l $Version 2>&1
    if ($localTags -match $Version) {
        $tagExistsLocal = $true
        Write-Host "✅ Tag $Version tồn tại locally" -ForegroundColor Green
    }
    
    # Kiểm tra tag trên remote
    try {
        $remoteTags = git ls-remote --tags origin $Version 2>&1
        if ($remoteTags -match $Version) {
            $tagExistsRemote = $true
            Write-Host "✅ Tag $Version đã tồn tại trên remote" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Không thể kiểm tra tag trên remote" -ForegroundColor Yellow
    }
    
    # Xử lý tag
    if ($tagExistsLocal -and -not $tagExistsRemote) {
        Write-Host "📤 Đang push tag $Version lên remote..." -ForegroundColor Cyan
        git push origin $Version 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Đã push tag $Version lên remote" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Không thể push tag, sẽ tạo tag mới từ commit hiện tại" -ForegroundColor Yellow
        }
    } elseif ($tagExistsLocal -and $tagExistsRemote) {
        Write-Host "ℹ️  Tag $Version đã tồn tại trên remote" -ForegroundColor Yellow
        Write-Host "🔄 Xóa tag cũ và tạo tag mới từ commit hiện tại..." -ForegroundColor Cyan
        # Xóa tag local
        git tag -d $Version 2>&1 | Out-Null
        # Xóa tag trên remote
        git push origin :refs/tags/$Version 2>&1 | Out-Null
        # Tạo tag mới từ commit hiện tại
        git tag $Version 2>&1 | Out-Null
        git push origin $Version 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Đã tạo lại tag $Version" -ForegroundColor Green
        }
    } elseif (-not $tagExistsLocal) {
        # Tạo tag mới từ commit hiện tại
        Write-Host "🏷️  Tạo tag mới $Version từ commit hiện tại..." -ForegroundColor Cyan
        git tag $Version 2>&1 | Out-Null
        git push origin $Version 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Đã tạo và push tag $Version" -ForegroundColor Green
        }
    }
}

# Tạo release notes
$releaseNotes = @"
## 🎉 Port Killer $Version

### ✨ Tính năng mới
- **Hỗ trợ IPv6**: Hiển thị cả cổng IPv4 và IPv6 đang lắng nghe
- **Port Detail Dialog**: Xem chi tiết thông tin cổng với đầy đủ thông tin tiến trình
- **TitleBar tùy chỉnh**: Giao diện desktop app với title bar hiện đại
- **Protocol column**: Hiển thị giao thức (TCP) trong bảng
- **Process path**: Hiển thị đường dẫn đầy đủ của tiến trình
- **Desktop app styling**: Giao diện được thiết kế lại giống desktop app (VS Code style)

### 🎨 Cải tiến UI/UX
- Compact table design với padding và spacing nhỏ hơn
- Icon-based action buttons (View và Kill) cho giao diện gọn gàng hơn
- Title bar với window controls được cải thiện
- Pagination compact hơn với icon-only navigation
- Stats display nhỏ gọn hơn

### ✨ Tính năng cơ bản
- Liệt kê tất cả các cổng TCP đang lắng nghe (IPv4 và IPv6)
- Hiển thị thông tin tiến trình (Port, PID, Process Name, Process Path)
- Tìm kiếm và lọc cổng theo số, tên tiến trình hoặc PID
- Kết thúc tiến trình với xác nhận
- Tự động làm mới danh sách mỗi 2 giây
- Giao diện hiện đại với shadcn/ui và Tailwind CSS
- Hỗ trợ đa ngôn ngữ (English, Vietnamese)
- Hỗ trợ theme (Light, Dark, System)

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

# Kiểm tra release đã tồn tại chưa
Write-Host "`n🔍 Kiểm tra release $Version..." -ForegroundColor Cyan
$releaseExists = $false
try {
    $existingRelease = gh release view $Version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $releaseExists = $true
        Write-Host "⚠️  Release $Version đã tồn tại" -ForegroundColor Yellow
        Write-Host "🗑️  Đang xóa release cũ..." -ForegroundColor Cyan
        gh release delete $Version --yes 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Đã xóa release cũ" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Không thể xóa release cũ, sẽ thử tạo lại" -ForegroundColor Yellow
        }
    }
} catch {
    # Release chưa tồn tại, tiếp tục
    Write-Host "✅ Release $Version chưa tồn tại, sẽ tạo mới" -ForegroundColor Green
}

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

