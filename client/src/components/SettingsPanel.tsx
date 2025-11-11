import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSettings } from "@shared/schema";
import { X } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings | null;
  onSave: (settings: Partial<UserSettings>) => void;
}

export function SettingsPanel({ isOpen, onClose, settings, onSave }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<Partial<UserSettings>>({
    voiceSensitivity: settings?.voiceSensitivity || "medium",
    wakeWordEnabled: settings?.wakeWordEnabled || false,
    language: settings?.language || "en-US",
    darkMode: settings?.darkMode || false,
    highContrast: settings?.highContrast || false,
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        voiceSensitivity: settings.voiceSensitivity,
        wakeWordEnabled: settings.wakeWordEnabled,
        language: settings.language,
        darkMode: settings.darkMode,
        highContrast: settings.highContrast,
      });
    }
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-80 md:w-96 bg-card border-l border-border shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-labelledby="settings-title"
        data-testid="panel-settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="settings-title" className="text-xl font-semibold flex items-center gap-2">
            <span className="material-icons">settings</span>
            Settings
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            data-testid="button-close-settings"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Voice Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Voice Recognition</h3>
            
            <div className="space-y-2">
              <Label htmlFor="voice-sensitivity">Voice Sensitivity</Label>
              <Select
                value={localSettings.voiceSensitivity}
                onValueChange={(value) => 
                  setLocalSettings({ ...localSettings, voiceSensitivity: value })
                }
              >
                <SelectTrigger id="voice-sensitivity" data-testid="select-sensitivity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="wake-word" className="flex-1">
                Wake Word Detection
                <p className="text-xs text-muted-foreground font-normal mt-1">
                  Activate voice commands hands-free
                </p>
              </Label>
              <Switch
                id="wake-word"
                checked={localSettings.wakeWordEnabled}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, wakeWordEnabled: checked })
                }
                data-testid="switch-wake-word"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={localSettings.language}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, language: value })
                }
              >
                <SelectTrigger id="language" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground">Appearance</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex-1">
                Dark Mode
                <p className="text-xs text-muted-foreground font-normal mt-1">
                  Use dark color scheme
                </p>
              </Label>
              <Switch
                id="dark-mode"
                checked={localSettings.darkMode}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, darkMode: checked })
                }
                data-testid="switch-dark-mode"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="flex-1">
                High Contrast
                <p className="text-xs text-muted-foreground font-normal mt-1">
                  Increase visual contrast
                </p>
              </Label>
              <Switch
                id="high-contrast"
                checked={localSettings.highContrast}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, highContrast: checked })
                }
                data-testid="switch-high-contrast"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-border bg-card flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            data-testid="button-save"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
