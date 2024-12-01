"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    openaiKey: "",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 150,
    responseDelay: 2,
    autoReply: true,
    welcomeMessage: "Hi! Thanks for messaging me. How can I help you today?"
  });

  const handleSave = async () => {
    try {
      localStorage.setItem("bot_settings", JSON.stringify(settings));
      // You might want to save these to your database instead
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bot Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>OpenAI API Key</Label>
            <Input
              type="password"
              value={settings.openaiKey}
              onChange={(e) => setSettings(s => ({ ...s, openaiKey: e.target.value }))}
              placeholder="sk-..."
            />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Temperature (Creativity)</Label>
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

          <div className="flex items-center justify-between">
            <Label>Auto Reply</Label>
            <Switch
              checked={settings.autoReply}
              onCheckedChange={(checked) => setSettings(s => ({ ...s, autoReply: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Welcome Message</Label>
            <Input
              value={settings.welcomeMessage}
              onChange={(e) => setSettings(s => ({ ...s, welcomeMessage: e.target.value }))}
              placeholder="Enter welcome message..."
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 