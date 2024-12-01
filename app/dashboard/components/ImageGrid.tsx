"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ImageGrid() {
  return (
    <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* TODO: Map through images from database */}
      <Card className="p-4">
        <div className="aspect-square relative bg-muted rounded-lg mb-3">
          {/* Image placeholder */}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Priority: 1
          </span>
          <Button variant="destructive" size="sm">
            Remove
          </Button>
        </div>
      </Card>
    </div>
  );
} 