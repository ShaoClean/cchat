import { io, Socket } from 'socket.io-client';
export type Config = {
    serverUrl: string;
    userName: string;
    roomName: string;
    roomUid: string;
};
export enum ClientEvents {
    CONNECT = 'connect',
    RECEIVE_MESSAGE = 'receive-message',
    USER_JOIN = 'user-joined',
    USER_LEAVE = 'user-left',
}

export enum ServerEvents {
    JOIN_ROOM = 'join-room',
    LEAVE_ROOM = 'leave-room',
    SEND_MESSAGE = 'send-message',
}
export class CleanSocket {
    private config?: Partial<Config>;
    private socket?: Socket;
    private socketEvents = new Map();
    constructor(config?: Config) {
        if (config) {
            this.config = config;
        }
    }

    setConfig(config: Partial<Config>) {
        if (config) {
            this.config = {
                ...this.config,
                ...config,
            };
        } else {
            this.config = config;
        }
    }

    connect() {
        if (!this.config) return false;
        this.socket = io(this.config.serverUrl);

        for (const [eventName, cb] of this.socketEvents.entries()) {
            this.socket.on(eventName, (data: any) => {
                cb?.(data);
            });
        }
        return this.socket;
    }

    registerEvents(event: ClientEvents | ServerEvents, listener: (socket: Socket) => void) {
        this.socketEvents.set(event, listener);
    }

    joinRoom(roomUid?: string, userName?: string) {
        if (!this.socket || !this.config) return false;
        console.log('roomUid', roomUid || this.config.roomUid);
        return this.socket.emit(ServerEvents.JOIN_ROOM, { room: roomUid || this.config.roomUid, userName: userName || this.config.userName });
    }

    leaveRoom(roomUid?: string, userName?: string) {
        if (!this.socket || !this.config) return false;
        console.log('roomUid', roomUid || this.config.roomUid);
        return this.socket.emit(ServerEvents.LEAVE_ROOM, { room: roomUid || this.config.roomUid, userName: userName || this.config.userName });
    }

    sendMessage(message: string) {
        if (!this.socket || !this.config) return false;
        return this.socket.emit(ServerEvents.SEND_MESSAGE, { message, room: this.config.roomUid, userName: this.config.userName });
    }
}

// const cs = new Index();
// cs.setConfig({ serverUrl: 'http://localhost:3001', roomUid: '1', roomName: 'room1', userName: 'clean-web' });
// cs.registerEvents(ClientEvents.CONNECT, a => {
//     console.log('Connected to server', a);
// });
// cs.registerEvents(ClientEvents.USER_JOIN, a => {
//     console.log('join room ', a);
// });
// cs.registerEvents(ClientEvents.RECEIVE_MESSAGE, a => {
//     console.log('receive message ', a);
// });
// cs.connect();
// cs.joinRoom();
// cs.sendMessage('hihihi');
