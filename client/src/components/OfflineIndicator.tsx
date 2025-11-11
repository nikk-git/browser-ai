import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div 
      className="h-8 bg-chart-3 text-foreground flex items-center justify-center gap-2 px-4"
      role="alert"
      aria-live="polite"
      data-testid="banner-offline"
    >
      <span className="material-icons text-sm" style={{ fontSize: '1rem' }}>
        cloud_off
      </span>
      <span className="text-xs font-medium">
        Offline Mode - Voice commands still work
      </span>
    </div>
  );
}
