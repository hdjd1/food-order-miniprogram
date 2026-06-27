# 饭店扫码点单小程序 - 设计指南

## 品牌定位
- **应用类型**：饭店扫码点单小程序
- **设计风格**：温暖、食欲感、干净精致、烟火气
- **目标用户**：到店就餐顾客，快速浏览菜单并下单

## 配色方案

### 主色板
| 用途 | Tailwind 类名 | 色值 |
|------|--------------|------|
| 主色-默认 | `bg-red-600` / `text-red-600` | `#e84c3d` |
| 主色-浅 | `bg-red-50` / `text-red-500` | `#ff6b5a` |
| 主色-深 | `bg-red-700` | `#c0392b` |
| 辅色-暖橙 | `bg-orange-500` / `text-orange-500` | `#ff8c42` |
| 辅色-浅橙 | `bg-orange-50` | `#fff3e6` |

### 中性色
| 用途 | Tailwind 类名 | 色值 |
|------|--------------|------|
| 页面背景 | `bg-amber-50` | `#faf6f0` |
| 卡片背景 | `bg-white` | `#ffffff` |
| 文字主色 | `text-gray-900` | `#2d2d2d` |
| 文字辅色 | `text-gray-500` | `#8c8c8c` |
| 分割线 | `border-gray-100` | `#f0f0f0` |

### 语义色
| 用途 | Tailwind 类名 | 色值 |
|------|--------------|------|
| 成功/已上菜 | `text-green-500` / `bg-green-50` | `#52c41a` |
| 待处理 | `text-orange-500` / `bg-orange-50` | `#ff8c42` |
| 已完成 | `text-gray-400` / `bg-gray-50` | `#bfbfbf` |

## 间距系统
- **页面边距**：`px-4`（左右16px）
- **卡片内边距**：`p-4`
- **列表项间距**：`gap-3`（卡片间距）
- **分类标签间距**：`gap-2`
- **底部安全区**：底部固定栏加 `pb-12` 避开 TabBar

## 组件选型原则（CRITICAL）
所有通用 UI 组件优先使用 `@/components/ui/*` 中的组件：
- **Button** → `@/components/ui/button`
- **Card** → `@/components/ui/card`（卡片容器）
- **Badge** → `@/components/ui/badge`（数量/状态标签）
- **Input** → `@/components/ui/input`（搜索输入框）
- **Dialog** → `@/components/ui/dialog`（下单确认弹窗）
- **Toast/Sonner** → `@/components/ui/sonner`（操作反馈）
- **Tabs** → `@/components/ui/tabs`（分类切换）
- **Skeleton** → `@/components/ui/skeleton`（加载占位）
- **Separator** → `@/components/ui/separator`（分割线）
- **Progress** → `@/components/ui/progress`（订单进度）

## 容器样式
- **菜品卡片**：`bg-white rounded-2xl shadow-sm overflow-hidden`
- **分类标签（选中）**：`bg-red-600 text-white px-4 py-2 rounded-full`
- **分类标签（未选）**：`bg-gray-100 text-gray-600 px-4 py-2 rounded-full`
- **购物车底部栏**：`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg z-50`
- **价格文本**：`text-red-600 font-bold text-lg`

## 导航结构
- **首页**（`pages/index/index`）：菜单浏览 + 点单（扫码落地页）
- **订单页**（`pages/orders/index`）：我的订单列表
- **订单详情**（`pages/order-detail/index`）：订单明细

不使用 TabBar（扫码点单是单一任务流，通常从首页开始点单）

## 状态展示原则
- **加载态**：使用 Skeleton 组件展示卡片骨架
- **空状态**：居中展示"暂无菜品"或"暂无订单"文案 + 图标
- **错误态**：Toast/Sonner 轻提示，不阻塞操作