# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-12-XX

### Added
- **Protocol column**: Added protocol column (TCP) to the ports table
- **View Details feature**: Added detail view dialog with eye icon button to see full port information
- **Process path/description**: Added full process path display under process name in table and detail dialog
- **Desktop app styling**: Redesigned UI to look more like a desktop app (VS Code style) instead of web app
  - Compact table design with smaller padding and spacing
  - Icon-based action buttons (View and Kill)
  - Improved title bar with proper window controls
  - Better pagination with compact design

### Changed
- **UI/UX improvements**:
  - Title bar: Increased window control button width (46px), settings icon with smaller padding
  - Table: Compact design, centered columns (Port, Protocol, Action), reduced column widths
  - Search bar: Added top padding to prevent sticking to top edge
  - Pagination: More compact design with icon-only navigation buttons
  - Stats: Smaller, more compact display
- **Kill button**: Changed from text button to icon button (X icon) for cleaner UI
- **Table layout**: Improved column alignment and spacing for better readability

### Technical
- Added `process_path` field to `PortInfo` struct in Rust backend
- Updated TypeScript interfaces to include process path information
- Enhanced process information retrieval to include full executable path

## [0.1.0] - 2024-XX-XX

### Added
- Initial release
- List listening TCP ports (IPv4 and IPv6)
- Display port, PID, and process name
- Search and filter functionality
- Kill process functionality
- Auto-refresh every 2 seconds
- Multi-language support (English, Vietnamese)
- Theme support (Light, Dark, System)
- Modern UI with shadcn/ui and Tailwind CSS

