# Cấu trúc Frontend

## Tổng quan

Frontend đã được tái cấu trúc với shadcn/ui components và Tailwind CSS, tuân theo best practices của React.

## Cấu trúc Thư mục

```
src/
├── api/                    # API layer - Tauri commands
│   └── ports.ts
├── components/
│   ├── ui/                 # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   └── skeleton.tsx
│   ├── features/           # Feature-specific components
│   │   └── ports/
│   │       ├── PortTable.tsx
│   │       ├── PortList.tsx
│   │       ├── SearchBar.tsx
│   │       ├── KillDialog.tsx
│   │       └── PortStats.tsx
│   └── layout/             # Layout components
│       └── Header.tsx
├── hooks/                  # Custom React hooks
│   ├── usePorts.ts
│   └── useAutoRefresh.ts
├── lib/                    # Utility functions
│   └── utils.ts
├── types/                  # TypeScript type definitions
│   └── ports.ts
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── index.css               # Global styles với Tailwind
```

## Components

### UI Components (shadcn/ui)

Các components cơ bản từ [shadcn/ui](https://ui.shadcn.com):

- **Button**: Nút với nhiều variants (default, destructive, outline, ghost, etc.)
- **Input**: Input field với styling nhất quán
- **Card**: Container component với header, content, footer
- **Table**: Table component với header, body, rows, cells
- **Dialog**: Modal dialog component
- **Alert**: Alert/notification component
- **Badge**: Badge component cho labels
- **Skeleton**: Loading skeleton component

### Feature Components

#### PortTable

Hiển thị danh sách ports trong bảng với:

- Loading state (skeleton)
- Empty state
- Kill button cho mỗi port

#### PortList

Container component quản lý:

- Search/filter logic
- PortTable rendering
- Stats display

#### SearchBar

Search input với:

- Icon search
- Refresh button
- Loading state

#### KillDialog

Confirmation dialog để kill process với:

- Process info display
- Warning message
- Confirm/Cancel buttons

#### PortStats

Hiển thị thống kê:

- Total ports
- Filtered count
- Filter indicator

### Layout Components

#### Header

App header với:

- Title và icon
- Description

## Hooks

### usePorts

Custom hook quản lý port state:

- `ports`: Danh sách ports
- `loading`: Loading state
- `error`: Error state
- `killingPid`: PID đang được kill
- `loadPorts()`: Load ports từ API
- `killProcess(pid)`: Kill process

### useAutoRefresh

Hook để auto-refresh với interval:

- `callback`: Function để gọi
- `interval`: Interval time (mặc định 2000ms)

## Utilities

### lib/utils.ts

- `cn()`: Utility để merge Tailwind classes với clsx và tailwind-merge

## Styling

### Tailwind CSS

- Sử dụng Tailwind CSS với custom theme từ shadcn/ui
- CSS variables cho theming
- Dark mode support (sẵn sàng)

### Design System

- Colors: Primary, secondary, destructive, muted, accent
- Spacing: Consistent spacing scale
- Typography: System font stack
- Border radius: Customizable với CSS variables

## Cách sử dụng

### Thêm Component mới

1. **UI Component**: Thêm vào `src/components/ui/`
2. **Feature Component**: Thêm vào `src/components/features/[feature]/`
3. **Layout Component**: Thêm vào `src/components/layout/`

### Thêm Hook mới

Thêm vào `src/hooks/` và export custom hook.

### Import Paths

Sử dụng path aliases:

```typescript
import { Button } from "@/components/ui/button";
import { usePorts } from "@/hooks/usePorts";
import { cn } from "@/lib/utils";
```

## Best Practices

1. **Component Separation**: Mỗi component có một trách nhiệm rõ ràng
2. **Reusability**: UI components có thể tái sử dụng
3. **Type Safety**: Sử dụng TypeScript strict mode
4. **Consistent Styling**: Sử dụng shadcn/ui components và Tailwind utilities
5. **State Management**: Sử dụng custom hooks để quản lý state
6. **Error Handling**: Xử lý errors ở hook level

## Cài đặt Dependencies

Sau khi clone, chạy:

```bash
npm install
```

Dependencies chính:

- `react` & `react-dom`: React framework
- `@tauri-apps/api`: Tauri API
- `lucide-react`: Icons
- `class-variance-authority`: Component variants
- `clsx` & `tailwind-merge`: Class utilities
- `tailwindcss` & `tailwindcss-animate`: Styling

## Tài liệu Tham khảo

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Hooks Documentation](https://react.dev/reference/react)
