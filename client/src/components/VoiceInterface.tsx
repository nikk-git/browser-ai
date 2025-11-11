import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface VoiceInterfaceProps {
  onCommand: (transcript: string, intent: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
}

export function VoiceInterface({ onCommand, isListening, onToggleListening }: VoiceInterfaceProps) {
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const statusRef = useRef(status);
  const isInitializedRef = useRef(false);

  // Keep statusRef in sync with status state
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Initialize speech recognition once
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setStatus("error");
      setErrorMessage("Speech recognition not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setStatus("listening");
      setErrorMessage("");
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      const isFinal = event.results[current].isFinal;
      const conf = event.results[current][0].confidence;

      setTranscript(transcriptText);
      setConfidence(conf);

      if (isFinal) {
        setStatus("processing");
        setTimeout(() => {
          onCommand(transcriptText, "unknown");
          setStatus("success");
          setTimeout(() => {
            setStatus("idle");
            setTranscript("");
            setConfidence(null);
          }, 1500);
        }, 300);
      }
    };

    recognition.onerror = (event: any) => {
      setStatus("error");
      setErrorMessage(event.error === "no-speech" ? "No speech detected" : `Error: ${event.error}`);
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 3000);
    };

    recognition.onend = () => {
      // Always reset to idle when recognition ends, unless we're processing a command
      if (statusRef.current !== "processing" && statusRef.current !== "success") {
        setStatus("idle");
      }
    };

    recognitionRef.current = recognition;
    isInitializedRef.current = true;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [onCommand]);

  // Handle listening state changes
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening && status === "idle") {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    } else if (!isListening && status === "listening") {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
    }
  }, [isListening, status]);

  // Audio level animation
  useEffect(() => {
    if (status === "listening") {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.4 + 0.1);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case "listening": return "bg-primary";
      case "processing": return "bg-chart-3";
      case "success": return "bg-chart-2";
      case "error": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "listening": return "mic";
      case "processing": return "hourglass_empty";
      case "success": return "check_circle";
      case "error": return "error";
      default: return "mic_none";
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Status Badge */}
        <Badge 
          variant={status === "error" ? "destructive" : status === "success" ? "default" : "secondary"}
          className="text-xs font-medium"
          data-testid="badge-status"
        >
          {status === "idle" && "Ready"}
          {status === "listening" && "Listening..."}
          {status === "processing" && "Processing..."}
          {status === "success" && "Command Recognized"}
          {status === "error" && "Error"}
        </Badge>

        {/* Microphone Button */}
        <div className="relative">
          <Button
            size="icon"
            variant={isListening ? "default" : "outline"}
            className={`w-20 h-20 rounded-full transition-all ${
              status === "listening" ? "animate-pulse" : ""
            } ${getStatusColor()}`}
            onClick={onToggleListening}
            disabled={status === "processing"}
            data-testid="button-microphone"
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {status === "processing" ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <span className="material-icons text-4xl" style={{ fontSize: '2rem' }}>
                {getStatusIcon()}
              </span>
            )}
          </Button>

          {/* Audio Level Visualization */}
          {status === "listening" && (
            <div className="absolute -inset-4 pointer-events-none" aria-hidden="true">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={40 + audioLevel * 20}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={35 + audioLevel * 15}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary opacity-30"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        <div className="w-full min-h-48 flex flex-col items-center justify-center gap-4">
          {transcript ? (
            <>
              <p 
                className="text-2xl md:text-3xl font-medium text-center text-foreground"
                data-testid="text-transcript"
              >
                "{transcript}"
              </p>
              {confidence !== null && (
                <p className="text-sm text-muted-foreground">
                  Confidence: {(confidence * 100).toFixed(0)}%
                </p>
              )}
            </>
          ) : errorMessage ? (
            <p className="text-base text-destructive text-center" data-testid="text-error">
              {errorMessage}
            </p>
          ) : (
            <p className="text-base text-muted-foreground text-center">
              {status === "idle" ? "Click the microphone to start" : "Listening for your command..."}
            </p>
          )}
        </div>

        {/* Keyboard Shortcut Hint */}
        <p className="text-xs text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs">Space</kbd> to toggle microphone
        </p>
      </div>
    </Card>
  );
}
