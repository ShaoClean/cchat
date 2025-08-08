#!/usr/bin/env node

const ChatClient = require('./nodejs-chat-client');

// 简单的多用户测试脚本
async function createMultipleClients() {
    const numClients = parseInt(process.argv[2]) || 3;
    const serverUrl = process.argv[3] || 'http://localhost:3001';

    console.log(`🤖 创建 ${numClients} 个自动聊天客户端...`);
    console.log(`🔗 服务器: ${serverUrl}`);
    console.log('='.repeat(50));

    const clients = [];
    const messages = ['大家好！', '今天天气不错啊', '有人在吗？', '这个聊天室很棒', '我是机器人用户', '测试消息发送', '聊天功能正常', 'WebSocket连接稳定'];

    for (let i = 0; i < numClients; i++) {
        const client = new ChatClient();

        // 重写一些方法以实现自动化
        client.promptForUsername = function () {
            this.username = `Bot${i + 1}`;
            console.log(`🤖 Bot${i + 1} 设置用户名: ${this.username}`);
            this.promptForRoom();
        };

        client.promptForRoom = function () {
            this.currentRoom = 'test-room';
            console.log(`🤖 Bot${i + 1} 加入房间: ${this.currentRoom}`);
            this.joinRoom();
        };

        client.startChatLoop = function () {
            // 自动发送消息
            let messageIndex = 0;
            const sendInterval = setInterval(
                () => {
                    if (!this.isInRoom || !this.isConnected) {
                        clearInterval(sendInterval);
                        return;
                    }

                    const message = `${messages[messageIndex % messages.length]} (来自 Bot${i + 1})`;
                    this.sendMessage(message);
                    messageIndex++;

                    // 发送5条消息后停止
                    if (messageIndex >= 5) {
                        clearInterval(sendInterval);
                        setTimeout(() => {
                            this.quit();
                        }, 2000);
                    }
                },
                (i + 1) * 1000 + Math.random() * 2000,
            ); // 随机间隔
        };

        // 连接客户端
        client.connect(serverUrl);
        clients.push(client);

        // 延迟连接下一个客户端
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 10秒后清理所有客户端
    setTimeout(() => {
        console.log('\n🧹 清理所有客户端...');
        clients.forEach(client => {
            if (client.socket && client.socket.connected) {
                client.quit();
            }
        });
    }, 15000);
}

// 如果作为主程序运行
if (require.main === module) {
    createMultipleClients().catch(console.error);
}

module.exports = { createMultipleClients };
