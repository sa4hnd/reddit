"use client";

import { useState, useEffect } from "react";
import { useReddit } from "@/libs/RedditContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendOpenAi } from "@/libs/gpt";

interface Message {
  id: string;
  author: string;
  body: string;
  timestamp: string;
  isBot: boolean;
}

interface Conversation {
  username: string;
  messages: Message[];
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<{ [key: string]: Conversation }>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useReddit();

  useEffect(() => {
    if (user?.accessToken) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("https://oauth.reddit.com/message/inbox", {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const messagesByUser: { [key: string]: Conversation } = {};

        data.data.children.forEach((msg: any) => {
          const author = msg.data.author;
          if (!author) return;

          if (!messagesByUser[author]) {
            messagesByUser[author] = {
              username: author,
              messages: [],
              lastMessage: msg.data.body,
              timestamp: new Date(msg.data.created_utc * 1000).toLocaleString(),
              unread: msg.data.new
            };
          }

          messagesByUser[author].messages.push({
            id: msg.data.name,
            author: msg.data.author,
            body: msg.data.body,
            timestamp: new Date(msg.data.created_utc * 1000).toLocaleString(),
            isBot: msg.data.author === user.name
          });
        });

        setConversations(messagesByUser);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.accessToken || !selectedUser) return;

    setIsSending(true);
    try {
      const openaiKey = localStorage.getItem("openai_key");
      if (!openaiKey) {
        throw new Error("OpenAI API key not found");
      }

      const gptResponse = await sendOpenAi([
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: newMessage }
      ], 123);

      const response = await fetch(`https://oauth.reddit.com/api/compose`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          api_type: "json",
          subject: "Re: Your message",
          text: gptResponse || "Error generating response",
          to: selectedUser,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Users List */}
      <div className="w-80 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Conversations</h2>
        </div>
        <div>
          {Object.values(conversations).map((conv) => (
            <button
              key={conv.username}
              onClick={() => setSelectedUser(conv.username)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                selectedUser === conv.username ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.username}`}
                  />
                  <AvatarFallback>{conv.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{conv.username}</p>
                    <span className="text-xs text-gray-500">{conv.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread && (
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser}`}
                  />
                  <AvatarFallback>{selectedUser[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">{selectedUser}</h2>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversations[selectedUser]?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.isBot ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.author}`}
                    />
                    <AvatarFallback>{message.author[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${message.isBot ? 'items-end' : ''}`}>
                    <div className={`rounded-lg p-3 max-w-[80%] ${
                      message.isBot ? 'bg-[#8B5CF6] text-white' : 'bg-white'
                    }`}>
                      {message.body}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                >
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
} 