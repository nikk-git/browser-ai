import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const shortcuts = [
  { key: "Space", action: "Toggle microphone" },
  { key: "Esc", action: "Stop listening" },
  { key: "?", action: "Show keyboard shortcuts" },
  { key: "S", action: "Open settings" },
  { key: "H", action: "Clear history" },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card 
          className="w-full max-w-md p-6"
          role="dialog"
          aria-labelledby="shortcuts-title"
          data-testid="modal-shortcuts"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 id="shortcuts-title" className="text-xl font-semibold flex items-center gap-2">
              <span className="material-icons">keyboard</span>
              Keyboard Shortcuts
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              aria-label="Close shortcuts"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-3">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <span className="text-sm text-foreground">{shortcut.action}</span>
                <kbd className="px-3 py-1.5 bg-background border border-border rounded font-mono text-sm font-medium">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Press <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs">?</kbd> anytime to show this dialog
          </p>
        </Card>
      </div>
    </>
  );
}
