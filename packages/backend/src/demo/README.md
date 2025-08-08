# Node.js ChatGateway 客户端 Demo

这个文件夹包含了用于测试 ChatGateway 的 Node.js 客户端演示程序。

## 📁 文件说明

1. **`nodejs-chat-client.js`** - 完整的 Node.js 聊天客户端
2. **`multi-client-test.js`** - 多用户自动化测试脚本
3. **`single-client-test.js`** - 单用户自动化测试脚本

## 🚀 使用方法

### 前提条件

确保后端服务正在运行：
```bash
# 在项目根目录
pnpm --filter backend start:dev
```

### 1. 单个客户端使用

```bash
# 进入后端目录
cd packages/backend

# 交互式聊天客户端
node src/demo/nodejs-chat-client.js

# 或者指定服务器地址
node src/demo/nodejs-chat-client.js http://localhost:3001

# 单客户端自动化测试
node src/demo/single-client-test.js
```

### 2. 多客户端测试

```bash
# 创建 3 个自动聊天机器人（默认）
node src/demo/multi-client-test.js

# 创建 5 个机器人
node src/demo/multi-client-test.js 5

# 指定服务器地址
node src/demo/multi-client-test.js 3 http://localhost:3001
```

## 🎮 交互命令

单个客户端支持以下命令：

- **基本聊天**: 直接输入消息并按回车
- **`/help`** - 显示帮助信息
- **`/quit` 或 `/exit`** - 退出程序
- **`/leave`** - 离开当前房间
- **`/join <房间名>`** - 加入指定房间
- **`/room`** - 显示当前房间
- **`/user`** - 显示当前用户名
- **`/status`** - 显示连接状态信息

## 📱 使用示例

### 单用户聊天会话示例
```
🚀 ChatGateway Node.js 客户端
==================================================
🔄 正在连接到服务器: http://localhost:3001
✅ 已连接到服务器
📡 连接ID: abc123

👤 请输入用户名: Alice
🏠 请输入房间名 (默认: general): lobby

🚪 正在加入房间: lobby
🎉 成功加入聊天室!
💡 使用说明:
  - 直接输入消息并按回车发送
  - 输入 /help 查看所有命令
  - 输入 /quit 退出程序

💬 房间: #lobby | 用户: Alice
==================================================
[Alice@lobby] 大家好！

💬 [14:30:25] Bob: 你好 Alice!
[Alice@lobby] 很高兴见到你

[Alice@lobby] /join general
🚪 正在离开房间: lobby
✅ 已离开房间
🚪 正在加入房间: general

[Alice@general] /status
📊 状态信息:
  - 连接状态: ✅ 已连接
  - 房间状态: ✅ 已加入
  - 当前房间: #general
  - 用户名: Alice
  - Socket ID: abc123

[Alice@general] /quit
👋 正在退出...
🚪 正在离开房间: general
✅ 已离开房间
✅ 再见!
```

## 🤖 多客户端测试示例

多客户端测试会创建多个自动聊天机器人，用于测试并发连接和消息传输：

```bash
node src/demo/multi-client-test.js 3
```

输出示例：
```
🤖 创建 3 个自动聊天客户端...
🔗 服务器: http://localhost:3001
==================================================
🔄 Bot1 正在连接...
✅ Bot1 已连接到服务器
🤖 Bot1 设置用户名: Bot1
🤖 Bot1 加入房间: test-room

🔄 Bot2 正在连接...
✅ Bot2 已连接到服务器
🤖 Bot2 设置用户名: Bot2
🤖 Bot2 加入房间: test-room

💬 Bot1 发送: 大家好！(来自 Bot1)
💬 Bot2 发送: 今天天气不错啊(来自 Bot2)
...

🧹 清理所有客户端...
```

## 🔧 技术特点

### 单客户端特性
- **交互式命令行界面** - 使用 readline 实现
- **实时消息显示** - 即时显示其他用户的消息
- **房间管理** - 支持加入/离开不同房间
- **连接状态监控** - 实时显示连接状态
- **优雅退出** - 处理 Ctrl+C 和程序退出

### 多客户端测试特性
- **并发连接测试** - 同时创建多个客户端
- **自动消息发送** - 机器人自动发送测试消息
- **负载测试** - 验证服务器处理多用户的能力
- **自动清理** - 测试完成后自动断开连接

## 🐛 故障排除

### 连接失败
```
🚫 连接失败: connect ECONNREFUSED 127.0.0.1:3001
请确保后端服务正在运行 (pnpm --filter backend start:dev)
```

**解决方案**: 确保后端服务正在运行

### 依赖缺失
如果出现模块找不到的错误：
```bash
cd packages/backend
npm install socket.io-client
```

## 📈 性能测试

使用多客户端测试可以验证：
- WebSocket 连接数量限制
- 消息广播性能
- 房间隔离功能
- 内存使用情况

建议的测试步骤：
1. 先用单客户端确认基本功能
2. 使用 3-5 个机器人测试基本并发
3. 逐步增加客户端数量测试性能极限