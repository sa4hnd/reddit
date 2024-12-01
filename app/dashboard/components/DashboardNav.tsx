"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
  },
  {
    href: "/dashboard/images",
    label: "Image Management",
  },
  {
    href: "/dashboard/logs",
    label: "Conversation Logs",
  },
  {
    href: "/dashboard/settings",
    label: "Bot Settings",
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center">
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 