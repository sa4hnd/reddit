"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  data: {
    id: string;
    author: string;
    body: string;
    created_utc: number;
    new: boolean;
  };
}

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Recent Conversations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div key={conv.data.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50">
              <Avatar 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.data.author}`}
                fallback={conv.data.author[0].toUpperCase()}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{conv.data.author}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conv.data.created_utc * 1000), { addSuffix: true })}
                  </span>
                  {conv.data.new && (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 break-words">{conv.data.body}</p>
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No conversations yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 