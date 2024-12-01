"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReddit } from "@/libs/RedditContext";
import { getRedditAuthUrl } from "@/libs/reddit";

export default function DashboardPage() {
  const { user, isLoading } = useReddit();
  const [responseDelay, setResponseDelay] = useState(2);
  const [conversations, setConversations] = useState([]);

  const handleRedditAuth = async () => {
    try {
      const authUrl = await getRedditAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Reddit auth error:", error);
    }
  };

  useEffect(() => {
    if (user?.accessToken) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("https://oauth.reddit.com/message/inbox", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data.children);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-[#8B5CF6] mb-6">Reddit DM Bot Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Reddit Authentication */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
              </svg>
              Reddit Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : user ? (
              <div className="space-y-2">
                <p className="text-sm">Logged in as: <span className="font-medium">{user.name}</span></p>
                <Button 
                  className="w-full bg-destructive hover:bg-destructive/90 text-white"
                  onClick={() => {
                    localStorage.removeItem("redditToken");
                    window.location.reload();
                  }}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                onClick={handleRedditAuth}
              >
                Connect Reddit Account
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Image Management */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Image Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input type="file" id="welcome-image" className="hidden" accept="image/*" />
              <label htmlFor="welcome-image" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Upload Welcome Image</span>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Bot Settings */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Bot Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium">Response Delay (seconds)</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={responseDelay}
                  onChange={(e) => setResponseDelay(Number(e.target.value))}
                  className="w-full accent-[#8B5CF6]"
                />
                <span className="text-sm">{responseDelay}s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card className="mt-6 bg-white shadow-sm col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Recent Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 uppercase">User</th>
                  <th className="px-6 py-3 uppercase">Last Message</th>
                  <th className="px-6 py-3 uppercase">Status</th>
                  <th className="px-6 py-3 uppercase">Time</th>
                </tr>
              </thead>
              <tbody>
                {conversations.length > 0 ? (
                  conversations.map((conv: any) => (
                    <tr key={conv.data.id} className="border-b">
                      <td className="px-6 py-4">{conv.data.author}</td>
                      <td className="px-6 py-4">{conv.data.body}</td>
                      <td className="px-6 py-4">{conv.data.new ? "Unread" : "Read"}</td>
                      <td className="px-6 py-4">
                        {new Date(conv.data.created_utc * 1000).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4" colSpan={4}>
                      {user ? "No conversations yet" : "Connect your Reddit account to view conversations"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
