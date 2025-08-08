import { MessageCircle } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="flex h-full">
      <div className="flex items-center justify-center w-full">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">欢迎使用聊天应用</h2>
          <p className="text-gray-500">项目已初始化完成</p>
        </div>
      </div>
    </div>
  )
}