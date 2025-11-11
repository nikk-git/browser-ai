import { Card } from "@/components/ui/card";
import { CommandDefinition } from "@shared/schema";

interface CommandCardProps {
  command: CommandDefinition;
  onClick?: () => void;
}

export function CommandCard({ command, onClick }: CommandCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer transition-transform hover:scale-105 hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-command-${command.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Execute command: ${command.name}`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <span 
            className="material-icons text-primary" 
            style={{ fontSize: '2rem' }}
            aria-hidden="true"
          >
            {command.icon}
          </span>
        </div>

        {/* Command Name */}
        <h3 className="text-base font-medium text-foreground">
          {command.name}
        </h3>

        {/* Example Phrases */}
        <div className="flex flex-col gap-1 w-full">
          {command.phrases.slice(0, 2).map((phrase, idx) => (
            <code 
              key={idx}
              className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded"
            >
              "{phrase}"
            </code>
          ))}
        </div>

        {/* Category Badge */}
        <span className="text-xs text-muted-foreground capitalize">
          {command.category}
        </span>
      </div>
    </Card>
  );
}
