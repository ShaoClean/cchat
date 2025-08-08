#!/usr/bin/env node

const ChatClient = require('./nodejs-chat-client');

// 单个客户端测试脚本
async function testSingleClient() {
  console.log('🧪 自动化单客户端测试');
  console.log('=' .repeat(50));
  
  const client = new ChatClient();
  
  // 重写方法实现自动化
  client.promptForUsername = function() {
    this.username = 'TestUser';
    console.log(`👤 设置用户名: ${this.username}`);
    this.promptForRoom();
  };
  
  client.promptForRoom = function() {
    this.currentRoom = 'test-room';
    console.log(`🏠 加入房间: ${this.currentRoom}`);
    this.joinRoom();
  };
  
  client.startChatLoop = function() {
    console.log('🤖 开始自动化测试...');
    
    // 测试各种命令
    setTimeout(() => this.sendMessage('Hello World!'), 1000);
    setTimeout(() => this.handleCommand('/status'), 2000);
    setTimeout(() => this.handleCommand('/room'), 3000);
    setTimeout(() => this.handleCommand('/user'), 4000);
    setTimeout(() => this.sendMessage('测试中文消息'), 5000);
    setTimeout(() => this.handleCommand('/help'), 6000);
    
    // 测试房间切换
    setTimeout(() => {
      console.log('🔄 测试房间切换...');
      this.handleCommand('/join general');
    }, 7000);
    
    setTimeout(() => this.sendMessage('我在general房间'), 8000);
    
    // 退出测试
    setTimeout(() => {
      console.log('✅ 测试完成，正在退出...');
      this.quit();
    }, 10000);
  };
  
  // 连接并开始测试
  client.connect('http://localhost:3001');
}

if (require.main === module) {
  testSingleClient().catch(console.error);
}

module.exports = testSingleClient;