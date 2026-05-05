'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bell, AlertTriangle } from 'lucide-react';

export default function NotificationListener() {
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize date on client side to avoid hydration mismatch
    if (!lastChecked) {
      setLastChecked(new Date());
      return;
    }

    const checkNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?since=${lastChecked.toISOString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.notifications && data.notifications.length > 0) {
            data.notifications.forEach((n: any) => {
              if (n.type === 'reminder') {
                toast((t) => (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">Deadline Reminder!</p>
                      <p className="text-xs text-slate-500">{n.content}</p>
                    </div>
                  </div>
                ), { duration: 10000, position: 'top-right' });
              } else {
                toast.success(n.content);
              }
            });
            setLastChecked(new Date());
          }
        }
      } catch (e) {
        // Silently fail
      }
    };

    const interval = setInterval(checkNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [lastChecked]);

  return null;
}
