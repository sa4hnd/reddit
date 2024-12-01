"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface RedditUser {
  name: string;
  accessToken: string;
}

interface RedditContextType {
  user: RedditUser | null;
  setUser: (user: RedditUser | null) => void;
  isLoading: boolean;
}

const RedditContext = createContext<RedditContextType | undefined>(undefined);

export function RedditProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RedditUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("redditToken");
    if (storedToken) {
      fetchRedditUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchRedditUser = async (token: string) => {
    try {
      const response = await fetch("https://oauth.reddit.com/api/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          name: userData.name,
          accessToken: token,
        });
      } else {
        localStorage.removeItem("redditToken");
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch Reddit user:", error);
      localStorage.removeItem("redditToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RedditContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </RedditContext.Provider>
  );
}

export function useReddit() {
  const context = useContext(RedditContext);
  if (context === undefined) {
    throw new Error("useReddit must be used within a RedditProvider");
  }
  return context;
} 