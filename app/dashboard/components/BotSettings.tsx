"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function BotSettings() {
  const [settings, setSettings] = useState({
    responseDelay: 2,
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 150,
    autoReply: true
  });

  return (
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
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Response Delay (seconds)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[settings.responseDelay]}
              onValueChange={([value]) => setSettings(s => ({ ...s, responseDelay: value }))}
              min={1}
              max={5}
              step={0.5}
              className="flex-1"
            />
            <span className="w-12 text-sm">{settings.responseDelay}s</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>GPT Model</Label>
          <Select
            value={settings.model}
            onValueChange={(value) => setSettings(s => ({ ...s, model: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Temperature</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[settings.temperature * 100]}
              onValueChange={([value]) => setSettings(s => ({ ...s, temperature: value / 100 }))}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-sm">{settings.temperature}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Max Tokens</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[settings.maxTokens]}
              onValueChange={([value]) => setSettings(s => ({ ...s, maxTokens: value }))}
              min={50}
              max={500}
              step={10}
              className="flex-1"
            />
            <span className="w-12 text-sm">{settings.maxTokens}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label>Auto Reply</Label>
          <Switch
            checked={settings.autoReply}
            onCheckedChange={(checked) => setSettings(s => ({ ...s, autoReply: checked }))}>
          </Switch>
        </div>
      </CardContent>
    </Card>
  );
} 