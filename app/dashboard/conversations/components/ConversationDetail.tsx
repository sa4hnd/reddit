"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { sendOpenAi } from "@/libs/gpt";

interface Message {
  id: string;
  author: string;
  body: string;
  timestamp: string;
  isBot: boolean;
}

export function ConversationDetail({ 
  conversationId, 
  accessToken 
}: { 
  conversationId: string;
  accessToken?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (accessToken && conversationId) {
      fetchMessages();
    }
  }, [conversationId, accessToken]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`https://oauth.reddit.com/message/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.data.children.map((msg: any) => ({
          id: msg.data.name,
          author: msg.data.author,
          body: msg.data.body,
          timestamp: new Date(msg.data.created_utc * 1000).toLocaleString(),
          isBot: msg.data.author === "your_bot_username"
        }));
        setMessages(formattedMessages);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !accessToken) return;

    setIsSending(true);
    try {
      // First, get GPT response
      const openaiKey = localStorage.getItem("openai_key");
      if (!openaiKey) {
        throw new Error("OpenAI API key not found");
      }

      const gptResponse = await sendOpenAi([
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: newMessage }
      ], 123); // Using number instead of string for user ID

      // Send message to Reddit
      const response = await fetch(`https://oauth.reddit.com/api/compose`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          api_type: "json",
          subject: "Re: Your message",
          text: gptResponse || "Error generating response",
          to: messages[0]?.author || "",
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${messages[0]?.author}`}
          />
          <AvatarFallback>{messages[0]?.author?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{messages[0]?.author || "Loading..."}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
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
              <AvatarFallback>{message.author?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className={`flex flex-col ${message.isBot ? 'items-end' : ''}`}>
              <div className={`rounded-lg p-3 max-w-[80%] ${
                message.isBot ? 'bg-[#8B5CF6] text-white' : 'bg-gray-100'
              }`}>
                {message.body}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className="flex-1"
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
    </div>
  );
} 