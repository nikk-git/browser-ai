import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { VoiceCommand } from "@shared/schema";
import { format } from "date-fns";

interface CommandHistoryProps {
  commands: VoiceCommand[];
  onClear?: () => void;
}

export function CommandHistory({ commands, onClear }: CommandHistoryProps) {
  if (commands.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <span className="material-icons text-4xl text-muted-foreground mb-2" style={{ fontSize: '2.5rem' }}>
            history
          </span>
          <p className="text-sm text-muted-foreground">No commands yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your voice commands will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="material-icons">history</span>
          Command History
        </h2>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-clear-history"
          >
            Clear All
          </button>
        )}
      </div>

      <ScrollArea className="max-h-64">
        <div className="space-y-3">
          {commands.slice(0, 10).map((command, idx) => (
            <div
              key={command.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover-elevate"
              data-testid={`history-item-${idx}`}
            >
              <span className="material-icons text-primary mt-0.5" style={{ fontSize: '1.25rem' }}>
                {command.intent === "unknown" ? "mic" : "check_circle"}
              </span>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground break-words">
                  "{command.transcript}"
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(command.executedAt), "h:mm:ss a")}
                  </p>
                  {command.confidence && (
                    <Badge variant="secondary" className="text-xs">
                      {command.confidence}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
