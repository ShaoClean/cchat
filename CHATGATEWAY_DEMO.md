# ChatGateway 使用示例

这个文档展示了如何在前端和后端使用 ChatGateway 进行实时聊天通信。

## 后端 (NestJS + Socket.IO)

### 1. ChatGateway 实现

`packages/backend/src/chat/chat.gateway.ts` 已经实现了基本的聊天网关：

```typescript
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    client.join(data.room);
    client.to(data.room).emit('user-joined', { userId: client.id });
  }

  @SubscribeMessage('send-message')
  handleMessage(@MessageBody() data: { room: string; message: string; username: string }) {
    this.server.to(data.room).emit('receive-message', {
      message: data.message,
      username: data.username,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.room);
    client.to(data.room).emit('user-left', { userId: client.id });
  }
}
```

### 2. 后端启动

```bash
cd packages/backend
pnpm start:dev
```

服务将在 `http://localhost:3001` 启动。

## 前端 (React + Socket.IO Client)

### 1. 安装依赖

需要安装 socket.io-client：

```bash
cd packages/frontend
pnpm add socket.io-client
```

### 2. 前端聊天组件示例

```typescript
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  message: string;
  username: string;
  timestamp: Date;
}

export default function ChatDemo() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 连接到后端 WebSocket
    const newSocket = io('http://localhost:3001');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // 监听接收消息
    newSocket.on('receive-message', (data: Message) => {
      setMessages(prev => [...prev, data]);
    });

    // 监听用户加入
    newSocket.on('user-joined', (data: { userId: string }) => {
      console.log('User joined:', data.userId);
    });

    // 监听用户离开
    newSocket.on('user-left', (data: { userId: string }) => {
      console.log('User left:', data.userId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = () => {
    if (socket && username && room) {
      socket.emit('join-room', { room });
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() && username && room) {
      socket.emit('send-message', {
        room,
        message: inputMessage,
        username
      });
      setInputMessage('');
    }
  };

  const leaveRoom = () => {
    if (socket && room) {
      socket.emit('leave-room', { room });
      setMessages([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ChatGateway Demo</h1>
      
      {/* 连接状态 */}
      <div className="mb-4">
        状态: {isConnected ? (
          <span className="text-green-600">已连接</span>
        ) : (
          <span className="text-red-600">未连接</span>
        )}
      </div>

      {/* 用户设置 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="房间名"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={joinRoom}
          disabled={!username || !room}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          加入房间
        </button>
        <button
          onClick={leaveRoom}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          离开房间
        </button>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-blue-600">{msg.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800">{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="输入消息..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!username || !room}
          className="flex-1 border px-3 py-2 rounded disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || !username || !room}
          className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          发送
        </button>
      </div>
    </div>
  );
}
```

### 3. 前端启动

```bash
cd packages/frontend
pnpm dev
```

前端将在 `http://localhost:3000` 启动。

## API 说明

### 客户端发送的事件

1. **join-room**: 加入聊天室
   ```typescript
   socket.emit('join-room', { room: 'room-name' });
   ```

2. **send-message**: 发送消息
   ```typescript
   socket.emit('send-message', {
     room: 'room-name',
     message: 'Hello World',
     username: 'user123'
   });
   ```

3. **leave-room**: 离开聊天室
   ```typescript
   socket.emit('leave-room', { room: 'room-name' });
   ```

### 服务器发送的事件

1. **receive-message**: 接收消息
   ```typescript
   socket.on('receive-message', (data) => {
     console.log(data.message, data.username, data.timestamp);
   });
   ```

2. **user-joined**: 用户加入通知
   ```typescript
   socket.on('user-joined', (data) => {
     console.log('User joined:', data.userId);
   });
   ```

3. **user-left**: 用户离开通知
   ```typescript
   socket.on('user-left', (data) => {
     console.log('User left:', data.userId);
   });
   ```

## 完整启动流程

1. **启动后端**:
   ```bash
   cd packages/backend
   pnpm start:dev
   ```

2. **启动前端**:
   ```bash
   cd packages/frontend
   pnpm add socket.io-client  # 如果还没安装
   pnpm dev
   ```

3. **使用**:
   - 打开浏览器访问 `http://localhost:3000`
   - 输入用户名和房间名
   - 点击"加入房间"
   - 开始发送消息
   - 可以打开多个标签页测试多用户聊天

## 注意事项

- 确保后端先启动，前端才能成功连接
- 默认 CORS 配置只允许 `http://localhost:3000` 访问
- 消息目前只在内存中，服务重启后会丢失
- 可以根据需要扩展消息存储到数据库