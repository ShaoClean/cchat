import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
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
    handleJoinRoom(@MessageBody() data: { room: string; userName: string }, @ConnectedSocket() client: Socket) {
        client.join(data.room);
        client.to(data.room).emit('user-joined', { userId: client.id, userName: data.userName });
    }

    @SubscribeMessage('send-message')
    handleMessage(@MessageBody() data: { room: string; message: string; userName: string }) {
        this.server.to(data.room).emit('receive-message', {
            message: data.message,
            userName: data.userName,
            timestamp: new Date(),
        });
    }

    @SubscribeMessage('leave-room')
    handleLeaveRoom(@MessageBody() data: { room: string; userName: string }, @ConnectedSocket() client: Socket) {
        client.leave(data.room);
        client.to(data.room).emit('user-left', { userId: client.id, userName: data.userName });
    }
}
