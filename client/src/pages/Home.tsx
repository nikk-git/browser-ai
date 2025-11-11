import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { VoiceInterface } from "@/components/VoiceInterface";
import { CommandCard } from "@/components/CommandCard";
import { CommandHistory } from "@/components/CommandHistory";
import { SettingsPanel } from "@/components/SettingsPanel";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { availableCommands, VoiceCommand, UserSettings } from "@shared/schema";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  // Fetch command history
  const { data: commands = [] } = useQuery<VoiceCommand[]>({
    queryKey: ["/api/commands"],
  });

  // Fetch user settings
  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  // Save command mutation
  const saveCommandMutation = useMutation({
    mutationFn: async (data: { transcript: string; intent: string; confidence?: string }) => {
      return apiRequest("POST", "/api/commands", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commands"] });
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      return apiRequest("PATCH", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    },
  });

  // Clear history mutation
  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/commands", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commands"] });
      toast({
        title: "History cleared",
        description: "Command history has been cleared.",
      });
    },
  });

  // Apply dark mode from settings
  useEffect(() => {
    if (settings?.darkMode !== undefined) {
      setIsDarkMode(settings.darkMode);
      document.documentElement.classList.toggle("dark", settings.darkMode);
    }
  }, [settings?.darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          setIsListening((prev) => !prev);
          break;
        case "Escape":
          setIsListening(false);
          break;
        case "s":
        case "S":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setIsSettingsOpen(true);
          }
          break;
        case "h":
        case "H":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            clearHistoryMutation.mutate();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [clearHistoryMutation]);

  const handleCommand = (transcript: string, intent: string) => {
    // Match command against available commands
    let matchedIntent = intent;
    let confidence = "low";

    const lowerTranscript = transcript.toLowerCase();
    for (const cmd of availableCommands) {
      for (const phrase of cmd.phrases) {
        if (lowerTranscript.includes(phrase.toLowerCase())) {
          matchedIntent = cmd.action;
          confidence = "high";
          break;
        }
      }
      if (confidence === "high") break;
    }

    // Save command to history
    saveCommandMutation.mutate({
      transcript,
      intent: matchedIntent,
      confidence,
    });

    // Execute command action
    executeCommand(matchedIntent, transcript);

    // Stop listening after command
    setIsListening(false);
  };

  const executeCommand = (action: string, transcript: string) => {
    if (action.startsWith("navigate:")) {
      const path = action.replace("navigate:", "");
      toast({
        title: "Navigation",
        description: `Would navigate to: ${path}`,
      });
    } else if (action === "clear-history") {
      clearHistoryMutation.mutate();
    } else if (action === "toggle-dark-mode") {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      document.documentElement.classList.toggle("dark", newDarkMode);
      updateSettingsMutation.mutate({ darkMode: newDarkMode });
    } else if (action === "show-help") {
      toast({
        title: "Available Commands",
        description: "Check the command palette below to see all available voice commands.",
      });
    } else if (action === "stop-listening") {
      setIsListening(false);
      toast({
        title: "Stopped listening",
        description: "Microphone has been turned off.",
      });
    } else {
      toast({
        title: "Command received",
        description: `"${transcript}"`,
      });
    }
  };

  const handleCommandCardClick = (command: typeof availableCommands[0]) => {
    executeCommand(command.action, command.phrases[0]);
    saveCommandMutation.mutate({
      transcript: command.phrases[0],
      intent: command.action,
      confidence: "manual",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <KeyboardShortcuts />

      {/* Header */}
      <header className="h-16 border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-icons text-primary" style={{ fontSize: '1.75rem' }}>
              mic
            </span>
            <h1 className="text-xl font-semibold text-foreground">Voice Commander</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSettingsOpen(true)}
              data-testid="button-open-settings"
              aria-label="Open settings"
            >
              <span className="material-icons">settings</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-8">
          {/* Voice Interface */}
          <section>
            <VoiceInterface
              onCommand={handleCommand}
              isListening={isListening}
              onToggleListening={() => setIsListening((prev) => !prev)}
            />
          </section>

          {/* Command Palette */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="material-icons">apps</span>
              Available Commands
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableCommands.map((command) => (
                <CommandCard
                  key={command.id}
                  command={command}
                  onClick={() => handleCommandCardClick(command)}
                />
              ))}
            </div>
          </section>

          {/* Command History */}
          <section>
            <CommandHistory
              commands={commands}
              onClear={() => clearHistoryMutation.mutate()}
            />
          </section>
        </div>
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings || null}
        onSave={(newSettings) => updateSettingsMutation.mutate(newSettings)}
      />
    </div>
  );
}
