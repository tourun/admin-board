# Loading Components

## GlobalLoader

统一的全局加载组件，用于所有需要显示加载状态的场景。

### 特性
- 全屏覆盖
- 模糊背景效果
- 白色卡片容器设计
- 旋转 spinner 动画
- 可自定义加载消息

### 使用方法

```jsx
import GlobalLoader from '../Loading/GlobalLoader';

// 基本使用
<GlobalLoader />

// 自定义消息
<GlobalLoader message="Loading user data..." />
```

### 适用场景
- 页面路由切换
- 数据加载
- API 请求等待
- 任何需要全局加载状态的场景

### 在 Suspense 中使用
```jsx
<Suspense fallback={<GlobalLoader message="Loading..." />}>
  <YourComponent />
</Suspense>
```

### 样式
- 使用 `GlobalLoader.css` 进行样式定制
- 支持响应式设计
- 包含动画效果