# 聊天应用 (CChat)

一个类似微信的实时聊天应用，采用前后端分离架构。

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client
- React Router

### 后端
- NestJS
- TypeScript
- TypeORM
- SQLite
- Socket.IO
- JWT认证
- bcryptjs

## 项目结构

```
cchat/
├── packages/
│   ├── frontend/          # React前端应用
│   └── backend/           # NestJS后端API
├── package.json           # 根package.json
└── pnpm-workspace.yaml    # pnpm工作区配置
```

## 安装依赖

```bash
# 安装所有依赖
pnpm install
```

## 开发

```bash
# 同时启动前端和后端开发服务器
pnpm dev

# 或分别启动
pnpm --filter frontend dev    # 前端 - http://localhost:3000
pnpm --filter backend start:dev  # 后端 - http://localhost:3001
```

## 构建

```bash
# 构建所有项目
pnpm build
```

## 功能特性

- [x] 用户注册和登录
- [x] JWT身份认证
- [x] 实时聊天 (Socket.IO)
- [x] 房间系统
- [x] SQLite数据库
- [ ] 消息持久化
- [ ] 文件上传
- [ ] 群聊功能
- [ ] 用户头像

## API接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户
- `GET /api/users/profile` - 获取用户信息

### WebSocket事件
- `join-room` - 加入聊天室
- `send-message` - 发送消息
- `receive-message` - 接收消息
- `leave-room` - 离开聊天室

## 开发注意事项

- 前端端口: 3000
- 后端端口: 3001
- 数据库文件: `packages/backend/database.sqlite`
- JWT密钥: 生产环境请修改为安全密钥