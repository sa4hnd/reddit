"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReddit } from "@/libs/RedditContext";
import { useRouter } from "next/navigation";
import { BotSettings } from "./components/BotSettings";

export default function DashboardPage() {
  const { user } = useReddit();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-[#8B5CF6] mb-6">Reddit DM Bot Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Reddit Status */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
              </svg>
              Reddit Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connected as {user.name}</span>
                </div>
                <Button 
                  className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  onClick={() => router.push('/dashboard/conversations')}
                >
                  View Conversations
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                onClick={() => router.push('/dashboard/conversations')}
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Image Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    // TODO: Implement image upload
                  }
                }}
                className="hidden"
                id="welcome-image"
              />
              <label htmlFor="welcome-image" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Bot Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BotSettings />
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card className="mt-6 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Recent Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <Button 
              className="w-full"
              onClick={() => router.push('/dashboard/conversations')}
            >
              View All Conversations
            </Button>
          ) : (
            <div className="text-center text-gray-500">
              Connect your Reddit account to view conversations
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 