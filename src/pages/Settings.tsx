
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState({
    sound: false,
    mistakes: true,
    theme: "light",
    keyboard: true,
    fingers: true,
    saveProgress: true,
  });
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("typingSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);
  
  // Save settings to localStorage when changed
  const updateSettings = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("typingSettings", JSON.stringify(newSettings));
  };
  
  const handleSettingChange = (key: string, value: any) => {
    updateSettings(key, value);
  };
  
  const handleResetSettings = () => {
    const defaultSettings = {
      sound: false,
      mistakes: true,
      theme: "light",
      keyboard: true,
      fingers: true,
      saveProgress: true,
    };
    
    setSettings(defaultSettings);
    localStorage.setItem("typingSettings", JSON.stringify(defaultSettings));
    
    toast({
      title: "Settings reset",
      description: "All settings have been restored to their default values.",
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sound & Feedback</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                id="sound" 
                checked={settings.sound}
                onCheckedChange={(checked) => handleSettingChange("sound", checked)}
              />
              <Label htmlFor="sound">Keyboard Sound</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="mistakes" 
                checked={settings.mistakes}
                onCheckedChange={(checked) => handleSettingChange("mistakes", checked)}
              />
              <Label htmlFor="mistakes">Show Mistakes</Label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Display</h3>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={settings.theme}
                onValueChange={(value) => handleSettingChange("theme", value)}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Virtual Keyboard</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                id="keyboard" 
                checked={settings.keyboard}
                onCheckedChange={(checked) => handleSettingChange("keyboard", checked)}
              />
              <Label htmlFor="keyboard">Show Virtual Keyboard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="fingers" 
                checked={settings.fingers}
                onCheckedChange={(checked) => handleSettingChange("fingers", checked)}
              />
              <Label htmlFor="fingers">Show Finger Hints</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data & Privacy</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                id="saveProgress" 
                checked={settings.saveProgress}
                onCheckedChange={(checked) => handleSettingChange("saveProgress", checked)}
              />
              <Label htmlFor="saveProgress">Save Progress & Statistics</Label>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={handleResetSettings}>
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
