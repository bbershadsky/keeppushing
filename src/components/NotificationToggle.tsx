import { useState, useEffect, useRef } from 'react';
import {
  isNotificationEnabled,
  requestPermission,
  scheduleNotificationCheck,
  cancelNotifications,
  testNotification,
  getNotificationTime,
  setNotificationPreferences,
  convertTo24Hour,
  convertTo12Hour
} from '../lib/notifications';

interface NotificationToggleProps {
  onToggle?: (enabled: boolean) => void;
}

export default function NotificationToggle({ onToggle }: NotificationToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notificationTime, setNotificationTime] = useState('12:00');
  const [testLoading, setTestLoading] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial state
    const prefs = getNotificationTime();
    setEnabled(prefs.enabled);
    setNotificationTime(prefs.time24h || '12:00');

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Close time picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (!enabled) {
        // Enabling notifications - request permission first
        const newPermission = await requestPermission();
        setPermission(newPermission);

        if (newPermission === 'granted') {
          setEnabled(true);

          // Save preferences
          setNotificationPreferences({
            enabled: true,
            time: convertTo12Hour(notificationTime),
            time24h: notificationTime
          });

          await scheduleNotificationCheck();
          if (onToggle) onToggle(true);
        } else {
          // Permission denied
          alert('Notification permission is required. Please enable it in your browser settings.');
        }
      } else {
        // Disabling notifications
        setEnabled(false);

        // Save preferences
        setNotificationPreferences({
          enabled: false,
          time: convertTo12Hour(notificationTime),
          time24h: notificationTime
        });

        await cancelNotifications();
        if (onToggle) onToggle(false);
      }
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setNotificationTime(newTime);

    if (enabled) {
      // Update preferences immediately
      setNotificationPreferences({
        enabled: true,
        time: convertTo12Hour(newTime),
        time24h: newTime
      });

      // Reschedule notifications with new time
      scheduleNotificationCheck();
    }
  };

  const isDisabled = permission === 'denied';

  const handleTest = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (testLoading) return;
    setTestLoading(true);

    try {
      // First ensure permission is granted
      const perm = await requestPermission();
      if (perm !== 'granted') {
        alert('Please allow notifications to test them.');
        return;
      }
      setPermission(perm);

      await testNotification();
    } catch (error) {
      console.error('Test notification failed:', error);
      alert('Failed to show test notification. Please try again.');
    } finally {
      setTestLoading(false);
    }
  };

  const formatDisplayTime = (time24h: string) => {
    const [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <>
      <div className="notification-toggle-container" ref={timePickerRef}>
        <button
          className={`notification-toggle ${enabled ? 'enabled' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={handleToggle}
          disabled={isDisabled || loading}
          title={isDisabled ? 'Notifications blocked. Enable in browser settings.' : enabled ? 'Disable notifications' : 'Enable notifications'}
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <svg
              className="bell-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {enabled ? (
                <>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  <path d="M18 8a6 6 0 0 1-12 0"/>
                </>
              ) : (
                <>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  {isDisabled && <line x1="2" y1="2" x2="22" y2="22"/>}
                </>
              )}
            </svg>
          )}
        </button>

        {enabled && (
          <>
            <button
              className="time-display-btn"
              onClick={() => setShowTimePicker(!showTimePicker)}
              title="Change notification time"
            >
              {formatDisplayTime(notificationTime)}
            </button>

            <button
              className={`test-notification-btn ${testLoading ? 'loading' : ''}`}
              onClick={handleTest}
              disabled={testLoading}
              title="Send test notification"
            >
              {testLoading ? (
                <div className="spinner-small"></div>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              )}
            </button>

            {showTimePicker && (
              <div className="time-picker-dropdown">
                <label className="time-picker-label">Daily reminder at:</label>
                <input
                  type="time"
                  value={notificationTime}
                  onChange={handleTimeChange}
                  className="time-input"
                />
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .notification-toggle-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .time-display-btn {
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.3);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #f97316;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .time-display-btn:hover {
          background: rgba(249, 115, 22, 0.2);
          border-color: rgba(249, 115, 22, 0.5);
        }

        .time-picker-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #1a1a1f;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 1rem;
          z-index: 100;
          min-width: 180px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .time-picker-label {
          display: block;
          font-size: 0.75rem;
          color: #71717a;
          margin-bottom: 0.5rem;
        }

        .time-input {
          width: 100%;
          padding: 0.6rem 0.8rem;
          background: #27272a;
          border: 1px solid #3f3f46;
          border-radius: 8px;
          color: #fafafa;
          font-size: 1rem;
          cursor: pointer;
        }

        .time-input:focus {
          outline: none;
          border-color: #f97316;
        }

        .time-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }

        .test-notification-btn {
          width: 28px;
          height: 28px;
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.3);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
        }

        .test-notification-btn:hover:not(:disabled) {
          background: rgba(249, 115, 22, 0.2);
          border-color: rgba(249, 115, 22, 0.5);
        }

        .test-notification-btn:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .test-notification-btn svg {
          color: #f97316;
        }

        .notification-toggle {
          width: 40px;
          height: 40px;
          background: #1a1a1f;
          border: 1px solid #27272a;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
        }

        .notification-toggle:hover:not(:disabled) {
          background: #27272a;
          border-color: #3f3f46;
        }

        .notification-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .notification-toggle.enabled {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%);
          border-color: rgba(249, 115, 22, 0.3);
        }

        .notification-toggle.enabled:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0.1) 100%);
          border-color: rgba(249, 115, 22, 0.5);
        }

        .bell-icon {
          width: 20px;
          height: 20px;
          color: #71717a;
          transition: color 0.2s;
        }

        .notification-toggle.enabled .bell-icon {
          color: #f97316;
        }

        .notification-toggle:hover:not(:disabled) .bell-icon {
          color: #a1a1aa;
        }

        .notification-toggle.enabled:hover:not(:disabled) .bell-icon {
          color: #fb923c;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(249, 115, 22, 0.2);
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .spinner-small {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(249, 115, 22, 0.2);
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .time-picker-dropdown {
            position: fixed;
            top: auto;
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
        }
      `}</style>
    </>
  );
}
