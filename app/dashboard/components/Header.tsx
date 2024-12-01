"use client";

import { useReddit } from "@/libs/RedditContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/conversations", label: "Conversations" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Header() {
  const { user, setUser } = useReddit();
  const pathname = usePathname();

  const handleSignOut = () => {
    localStorage.removeItem("redditToken");
    setUser(null);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href
                    ? "text-purple-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name} 
                  />
                  <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              asChild
            >
              <Link href="/dashboard">Connect Reddit</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 