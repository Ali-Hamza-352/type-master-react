
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
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
              <Switch id="sound" />
              <Label htmlFor="sound">Keyboard Sound</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="mistakes" defaultChecked />
              <Label htmlFor="mistakes">Show Mistakes</Label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Display</h3>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select>
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
              <Switch id="keyboard" defaultChecked />
              <Label htmlFor="keyboard">Show Virtual Keyboard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="fingers" defaultChecked />
              <Label htmlFor="fingers">Show Finger Hints</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
