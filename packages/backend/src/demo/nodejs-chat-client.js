const { io } = require('socket.io-client');
const readline = require('readline');

class ChatClient {
    constructor() {
        this.socket = null;
        this.username = '';
        this.currentRoom = '';
        this.isConnected = false;
        this.isInRoom = false;

        // 创建readline接口
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    connect(serverUrl = 'http://localhost:3001') {
        console.log(`🔄 正在连接到服务器: ${serverUrl}`);

        this.socket = io(serverUrl);

        // 连接事件
        this.socket.on('connect', () => {
            console.log('✅ 已连接到服务器');
            console.log(`📡 连接ID: ${this.socket.id}`);
            this.isConnected = true;
            this.promptForUsername();
        });

        this.socket.on('disconnect', () => {
            console.log('❌ 与服务器断开连接');
            this.isConnected = false;
            this.isInRoom = false;
        });

        this.socket.on('connect_error', error => {
            console.log('🚫 连接失败:', error.message);
            console.log('请确保后端服务正在运行 (pnpm --filter backend start:dev)');
            process.exit(1);
        });

        // 聊天事件
        this.socket.on('receive-message', data => {
            const timestamp = new Date(data.timestamp).toLocaleTimeString('zh-CN');
            console.log(`\n💬 [${timestamp}] ${data.username}: ${data.message}`);
            this.showPrompt();
        });

        this.socket.on('user-joined', data => {
            console.log(`\n👋 用户 ${data.userId} 加入了房间`);
            this.showPrompt();
        });

        this.socket.on('user-left', data => {
            console.log(`\n👋 用户 ${data.userId} 离开了房间`);
            this.showPrompt();
        });
    }

    promptForUsername() {
        this.rl.question('👤 请输入用户名: ', username => {
            if (!username.trim()) {
                console.log('❗ 用户名不能为空');
                this.promptForUsername();
                return;
            }
            this.username = username.trim();
            this.promptForRoom();
        });
    }

    promptForRoom() {
        this.rl.question(`🏠 请输入房间名 (默认: general): `, room => {
            this.currentRoom = room.trim() || 'general';
            this.joinRoom();
        });
    }

    joinRoom() {
        if (!this.socket || !this.isConnected) {
            console.log('❗ 未连接到服务器');
            return;
        }

        console.log(`🚪 正在加入房间: ${this.currentRoom}`);
        this.socket.emit('join-room', { room: this.currentRoom });
        this.isInRoom = true;

        console.log('\n🎉 成功加入聊天室!');
        console.log('💡 使用说明:');
        console.log('  - 直接输入消息并按回车发送');
        console.log('  - 输入 /help 查看所有命令');
        console.log('  - 输入 /quit 退出程序');
        console.log(`\n💬 房间: #${this.currentRoom} | 用户: ${this.username}`);
        console.log('='.repeat(50));

        this.startChatLoop();
    }

    startChatLoop() {
        this.showPrompt();

        this.rl.on('line', input => {
            const message = input.trim();

            if (!message) {
                this.showPrompt();
                return;
            }

            // 处理命令
            if (message.startsWith('/')) {
                this.handleCommand(message);
            } else {
                // 发送普通消息
                this.sendMessage(message);
            }

            this.showPrompt();
        });
    }

    handleCommand(command) {
        const [cmd, ...args] = command.split(' ');

        switch (cmd.toLowerCase()) {
            case '/help':
                this.showHelp();
                break;

            case '/quit':
            case '/exit':
                this.quit();
                break;

            case '/leave':
                this.leaveRoom();
                break;

            case '/join':
                if (args.length > 0) {
                    this.leaveRoom();
                    setTimeout(() => {
                        this.currentRoom = args[0];
                        this.joinRoom();
                    }, 100);
                } else {
                    console.log('❗ 用法: /join <房间名>');
                }
                break;

            case '/room':
                console.log(`📍 当前房间: #${this.currentRoom}`);
                break;

            case '/user':
                console.log(`👤 当前用户: ${this.username}`);
                break;

            case '/status':
                console.log(`📊 状态信息:`);
                console.log(`  - 连接状态: ${this.isConnected ? '✅ 已连接' : '❌ 未连接'}`);
                console.log(`  - 房间状态: ${this.isInRoom ? '✅ 已加入' : '❌ 未加入'}`);
                console.log(`  - 当前房间: #${this.currentRoom}`);
                console.log(`  - 用户名: ${this.username}`);
                console.log(`  - Socket ID: ${this.socket?.id || 'N/A'}`);
                break;

            default:
                console.log(`❗ 未知命令: ${cmd}`);
                console.log('💡 输入 /help 查看可用命令');
        }
    }

    sendMessage(message) {
        if (!this.isInRoom) {
            console.log('❗ 请先加入房间');
            return;
        }

        this.socket.emit('send-message', {
            room: this.currentRoom,
            message: message,
            username: this.username,
        });
    }

    leaveRoom() {
        if (this.isInRoom && this.socket) {
            console.log(`🚪 正在离开房间: ${this.currentRoom}`);
            this.socket.emit('leave-room', { room: this.currentRoom });
            this.isInRoom = false;
            console.log('✅ 已离开房间');
        }
    }

    showHelp() {
        console.log('\n📖 可用命令:');
        console.log('  /help          - 显示帮助信息');
        console.log('  /quit, /exit   - 退出程序');
        console.log('  /leave         - 离开当前房间');
        console.log('  /join <房间名>  - 加入指定房间');
        console.log('  /room          - 显示当前房间');
        console.log('  /user          - 显示当前用户名');
        console.log('  /status        - 显示连接状态信息');
        console.log('');
    }

    showPrompt() {
        if (this.isInRoom) {
            process.stdout.write(`[${this.username}@${this.currentRoom}] `);
        }
    }

    quit() {
        console.log('\n👋 正在退出...');
        if (this.isInRoom) {
            this.leaveRoom();
        }
        if (this.socket) {
            this.socket.close();
        }
        this.rl.close();
        console.log('✅ 再见!');
        process.exit(0);
    }
}

// 主程序
function main() {
    console.log('🚀 ChatGateway Node.js 客户端');
    console.log('='.repeat(50));

    const client = new ChatClient();

    // 处理程序退出
    process.on('SIGINT', () => {
        client.quit();
    });

    process.on('SIGTERM', () => {
        client.quit();
    });

    // 连接到服务器
    const serverUrl = process.argv[2] || 'http://localhost:3001';
    client.connect(serverUrl);
}

async function mySocket() {
    const socket = io(process.argv[2] || 'http://localhost:3001');
    socket.on('receive-message', data => {
        const timestamp = new Date(data.timestamp).toLocaleTimeString('zh-CN');
        console.log(`\n💬 [${timestamp}] ${data.userName}: ${data.message}`);
    });
    socket.on('user-joined', data => {
        console.log(`\n👋 用户 ${data.userName} 加入了房间`);
    });
    const userName = 'clean-node';
    const roomUid = 'general';
    socket.emit('join-room', { room: roomUid, userName });
    socket.emit('send-message', {
        room: roomUid,
        message: 'hello',
        userName,
    });

    socket.emit('leave-room', { room: roomUid, userName });
}

// 如果直接运行此文件
if (require.main === module) {
    // main();
    mySocket();
}

module.exports = ChatClient;
