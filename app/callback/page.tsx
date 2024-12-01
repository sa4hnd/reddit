"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useReddit } from "@/libs/RedditContext";
import { getRedditAccessToken } from "@/libs/reddit";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useReddit();
  
  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("Reddit auth error:", error);
        router.push("/dashboard");
        return;
      }

      if (code) {
        try {
          const tokenData = await getRedditAccessToken(code);
          localStorage.setItem("redditToken", tokenData.access_token);
          
          // Fetch user data and update context
          const response = await fetch("https://oauth.reddit.com/api/v1/me", {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser({
              name: userData.name,
              accessToken: tokenData.access_token,
            });
          }
          
          router.push("/dashboard");
        } catch (error) {
          console.error("Token exchange error:", error);
          router.push("/dashboard");
        }
      }
    }

    handleCallback();
  }, [router, searchParams, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connecting to Reddit...</h1>
        <p className="text-muted-foreground">Please wait while we complete the authentication.</p>
      </div>
    </div>
  );
} 