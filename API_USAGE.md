# API使用说明

## 概述

项目现在支持在Mock数据和真实API之间切换，无需修改代码。

## API配置

### 配置文件位置
- `src/config/api.js` - API配置文件

### 主要配置项
```javascript
export const API_CONFIG = {
  // 是否使用mock数据 (true: 使用mock, false: 使用真实API)
  USE_MOCK: true,
  
  // 真实API基础URL
  BASE_URL: 'http://localhost:8080/v1',
  
  // API端点配置
  ENDPOINTS: {
    USERS_PAGINATION: '/user/pagination',
    USER_BY_ID: '/user',
    CREATE_USER: '/user',
    DELETE_USER: '/user',
  },
};
```

## API端点映射

| 功能         | Mock方法                | 真实API端点                           | HTTP方法 |
| ------------ | ----------------------- | ------------------------------------- | -------- |
| 获取用户列表 | `getUsersFromMock()`    | `GET /user/pagination?page=0&size=10` | GET      |
| 获取单个用户 | `getUserByIdFromMock()` | `GET /user/:id`                       | GET      |
| 创建用户     | `createUserFromMock()`  | `POST /user`                          | POST     |
| 删除用户     | `deleteUserFromMock()`  | `DELETE /user/:id`                    | DELETE   |

## 切换方式

### 方式1: 修改配置文件
在 `src/config/api.js` 中修改 `USE_MOCK` 的值：
```javascript
// 使用Mock数据
USE_MOCK: true

// 使用真实API
USE_MOCK: false
```

### 方式2: 浏览器控制台命令
打开浏览器开发者工具，在控制台中输入：

```javascript
// 切换到Mock数据模式
useMockData()

// 切换到真实API模式
useRealApi()

// 查看当前模式
getCurrentMode()
```

## 真实API数据格式

### 获取用户列表响应格式
```javascript
{
  "content": [
    {
      "id": "1",
      "staff_id": "12345678",
      "first_name": "John",
      "last_name": "Doe",
      "location": "US",
      "created_at": "2024-01-01T00:00:00Z",
      "is_active": true
    }
  ],
  "totalElements": 100,
  "number": 0,
  "size": 10
}
```

### 获取单个用户响应格式
```javascript
{
  "id": "1",
  "staff_id": "12345678",
  "first_name": "John",
  "last_name": "Doe",
  "location": "US",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "updated_by": "admin",
  "is_active": true
}
```

### 创建用户请求格式
```javascript
{
  "staff_id": "12345678",
  "first_name": "John",
  "last_name": "Doe",
  "location": "US",
  "is_active": true
}
```

## 错误处理

真实API的错误会被自动转换为与Mock数据相同的格式，确保前端代码的一致性。

## 开发建议

1. **开发阶段**: 使用Mock数据 (`USE_MOCK: true`)
2. **测试阶段**: 切换到真实API (`USE_MOCK: false`)
3. **演示阶段**: 可以随时切换，展示不同的数据源

## 注意事项

- Mock数据保留在项目中，不会被删除
- 切换模式后需要刷新页面才能生效
- 真实API需要确保CORS配置正确
- 建议在生产环境中移除控制台切换命令