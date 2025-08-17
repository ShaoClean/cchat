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
    handleJoinRoom(@MessageBody() data: { room: string; username: string }, @ConnectedSocket() client: Socket) {
        client.join(data.room);
        client.to(data.room).emit('user-joined', { userId: client.id, username: data.username });
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
    handleLeaveRoom(@MessageBody() data: { roomUid: string; username: string; userId: string; roomName: string }, @ConnectedSocket() client: Socket) {
        client.leave(data.roomUid);
        client.to(data.roomUid).emit('user-left', { userId: data.userId, username: data.username });
    }
}
