import { useState, useEffect, useCallback } from 'react';
import AuthButton from './AuthButton';
import StartDateModal from './StartDateModal';
import Dashboard from './Dashboard';
import DayCard from './DayCard';
import ShareButton from './ShareButton';
import NotificationToggle from './NotificationToggle';
import { registerServiceWorker, scheduleNotificationCheck, getNotificationTime } from '../lib/notifications';

interface User {
  id: string;
  displayName?: string;
  primaryEmail?: string;
}

interface ChallengeData {
  startDate: string;
  currentPushups: number;
  targetPushups: number;
  completedDays: number[];
}

interface DayPlan {
  type: 'pushups' | 'plank';
  sets?: number[];
  seconds?: number;
}

const BASE_PLAN_50: DayPlan[] = [
  { type: 'pushups', sets: [4, 2, 2] },
  { type: 'pushups', sets: [6, 2, 2] },
  { type: 'plank', seconds: 10, sets: [3] },
  { type: 'pushups', sets: [8, 4, 2] },
  { type: 'pushups', sets: [10, 4, 4] },
  { type: 'pushups', sets: [12, 4, 4] },
  { type: 'plank', seconds: 15, sets: [3] },
  { type: 'pushups', sets: [14, 6, 4] },
  { type: 'pushups', sets: [14, 6, 6] },
  { type: 'pushups', sets: [16, 6, 4] },
  { type: 'plank', seconds: 20, sets: [3] },
  { type: 'pushups', sets: [18, 8, 6] },
  { type: 'pushups', sets: [20, 8, 6] },
  { type: 'pushups', sets: [20, 10, 8] },
  { type: 'plank', seconds: 20, sets: [4] },
  { type: 'pushups', sets: [22, 10, 8] },
  { type: 'pushups', sets: [24, 12, 8] },
  { type: 'pushups', sets: [24, 12, 10] },
  { type: 'pushups', sets: [26, 12, 10] },
  { type: 'pushups', sets: [26, 14, 8] },
  { type: 'pushups', sets: [28, 14, 10] },
  { type: 'pushups', sets: [28, 14, 12] },
  { type: 'plank', seconds: 25, sets: [4] },
  { type: 'pushups', sets: [30, 14, 12] },
  { type: 'pushups', sets: [30, 15, 15] },
  { type: 'pushups', sets: [32, 16, 14] },
  { type: 'plank', seconds: 25, sets: [6] },
  { type: 'pushups', sets: [34, 16, 14] },
  { type: 'plank', seconds: 30, sets: [6] },
  { type: 'pushups', sets: [50] },
];

function generatePlan(current: number, target: number): DayPlan[] {
  return BASE_PLAN_50.map((day, i) => {
    if (day.type === 'plank') return day;
    const isLastDay = i === BASE_PLAN_50.length - 1;
    if (isLastDay) return { type: 'pushups' as const, sets: [target] };

    const origSets = day.sets!;
    const origTotal = origSets.reduce((a, b) => a + b, 0);
    const progress = Math.min(1, origTotal / 50);
    const dayTotal = Math.round(current + (target - current) * progress);
    const scaled = origSets.map((s) =>
      Math.max(1, Math.round((dayTotal * s) / origTotal))
    );
    let sum = scaled.reduce((a, b) => a + b, 0);
    if (sum !== dayTotal) {
      const diff = dayTotal - sum;
      const idx = diff > 0 ? scaled.indexOf(Math.min(...scaled)) : scaled.indexOf(Math.max(...scaled));
      scaled[idx] = Math.max(1, scaled[idx] + diff);
    }
    return { type: 'pushups' as const, sets: scaled };
  });
}

const STORAGE_KEY = 'pushup-challenge';
const DEFAULT_CHALLENGE: ChallengeData = {
  startDate: new Date().toISOString().split('T')[0],
  currentPushups: 5,
  targetPushups: 50,
  completedDays: [],
};

function loadFromStorage(): ChallengeData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Invalid data, ignore
  }
  return null;
}

function saveToStorage(data: ChallengeData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface PushUpAppProps {
  initialUser: User | null;
}

// Helper to get day content text
function getDayContentText(dayPlan: DayPlan): string {
  if (dayPlan.type === 'plank') {
    return `${dayPlan.seconds}s push-up plank hold, ${dayPlan.sets?.[0] || 0} sets`;
  }
  if (dayPlan.sets?.length === 1) {
    return `${dayPlan.sets[0]} push-ups in one go`;
  }
  return dayPlan.sets?.map((n) => `${n} push-ups`).join(', ') || '';
}

export default function PushUpApp({ initialUser }: PushUpAppProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [lastCompletedDay, setLastCompletedDay] = useState<{ dayNumber: number; content: string } | undefined>();
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Register service worker and set up notifications on mount
  useEffect(() => {
    async function setupNotifications() {
      // Register service worker
      await registerServiceWorker();

      // Check notification preferences
      const prefs = getNotificationTime();
      setNotificationEnabled(prefs.enabled);

      // Schedule notifications if enabled
      if (prefs.enabled) {
        await scheduleNotificationCheck();
      }
    }

    setupNotifications();
  }, []);

  // Update notification schedule when challenge changes
  useEffect(() => {
    if (challenge && notificationEnabled) {
      // Wait a bit for service worker to be ready
      setTimeout(() => {
        scheduleNotificationCheck();

        // Send updated challenge data to service worker
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(() => {
            if (navigator.serviceWorker.controller) {
              const prefs = getNotificationTime();
              navigator.serviceWorker.controller.postMessage({
                type: 'NOTIFICATION_DATA',
                enabled: prefs.enabled,
                time: prefs.time24h,
                challengeData: challenge,
              });
            }
          });
        }
      }, 500);
    }
  }, [challenge, notificationEnabled]);

  // Load challenge data on mount
  useEffect(() => {
    async function loadChallenge() {
      // Check URL params first
      const urlParams = new URLSearchParams(window.location.search);
      const urlCurrent = urlParams.get('current');
      const urlTarget = urlParams.get('target');
      const urlStart = urlParams.get('start');
      
      if (urlCurrent && urlTarget && urlStart) {
        // Load from URL params
        const challengeFromUrl: ChallengeData = {
          startDate: urlStart,
          currentPushups: parseInt(urlCurrent, 10),
          targetPushups: parseInt(urlTarget, 10),
          completedDays: [],
        };
        setChallenge(challengeFromUrl);
        setPlan(generatePlan(challengeFromUrl.currentPushups, challengeFromUrl.targetPushups));
        saveToStorage(challengeFromUrl);
        setLoading(false);
        // Clear URL params after loading
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }
      
      // First, try to load from localStorage
      const storedChallenge = loadFromStorage();
      
      if (storedChallenge) {
        setChallenge(storedChallenge);
        setPlan(generatePlan(storedChallenge.currentPushups, storedChallenge.targetPushups));
        setLoading(false);
        return;
      }
      
      // If user is signed in, try to load from database
      if (user) {
        try {
          const response = await fetch('/api/challenge');
          const data = await response.json();
          
          if (data.challenge) {
            const challengeData: ChallengeData = {
              startDate: data.challenge.start_date,
              currentPushups: data.challenge.current_pushups,
              targetPushups: data.challenge.target_pushups,
              completedDays: data.challenge.completedDays || [],
            };
            setChallenge(challengeData);
            setPlan(generatePlan(challengeData.currentPushups, challengeData.targetPushups));
            saveToStorage(challengeData);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch challenge from server:', error);
        }
      }
      
      // No stored data - show default plan with modal for first-time setup
      setIsFirstVisit(true);
      const defaultData = { ...DEFAULT_CHALLENGE };
      setChallenge(defaultData);
      setPlan(generatePlan(defaultData.currentPushups, defaultData.targetPushups));
      setShowModal(true);
      setLoading(false);
    }

    loadChallenge();
  }, [user]);

  // Sync to database when user signs in
  useEffect(() => {
    if (user && challenge && !isFirstVisit) {
      // Sync local data to database
      fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: challenge.startDate,
          currentPushups: challenge.currentPushups,
          targetPushups: challenge.targetPushups,
        }),
      }).catch(console.error);
    }
  }, [user, challenge, isFirstVisit]);

  const handleModalSubmit = useCallback((data: { startDate: string; currentPushups: number; targetPushups: number }) => {
    const newChallenge: ChallengeData = {
      ...data,
      completedDays: [],
    };
    
    setChallenge(newChallenge);
    setPlan(generatePlan(data.currentPushups, data.targetPushups));
    saveToStorage(newChallenge);
    setShowModal(false);
    setIsFirstVisit(false);
    
    // If signed in, also save to database
    if (user) {
      fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(console.error);
    }
  }, [user]);

  const handleDayToggle = useCallback(async (dayNumber: number, completed: boolean) => {
    if (!challenge) return;
    
    const newCompletedDays = completed
      ? [...challenge.completedDays, dayNumber]
      : challenge.completedDays.filter(d => d !== dayNumber);
    
    const updatedChallenge = { ...challenge, completedDays: newCompletedDays };
    setChallenge(updatedChallenge);
    saveToStorage(updatedChallenge);
    
    // If day was just completed, capture it for sharing
    if (completed && plan[dayNumber - 1]) {
      const dayContent = getDayContentText(plan[dayNumber - 1]);
      setLastCompletedDay({ dayNumber, content: dayContent });
      // Clear after 5 seconds
      setTimeout(() => setLastCompletedDay(undefined), 5000);
    } else {
      setLastCompletedDay(undefined);
    }
    
    // If signed in, also update in database
    if (user) {
      const method = completed ? 'POST' : 'DELETE';
      try {
        await fetch('/api/complete-day', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dayNumber }),
        });
      } catch (error) {
        console.error('Failed to sync to server:', error);
      }
    }
  }, [challenge, user, plan]);

  const handleSettingsClick = () => {
    setShowModal(true);
  };

  // Calculate streak for share button
  const streak = challenge?.completedDays ? 
    (() => {
      const sorted = [...challenge.completedDays].sort((a, b) => a - b);
      let s = 0;
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] === i + 1) s = i + 1;
        else break;
      }
      return s;
    })() : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your challenge...</p>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 1rem;
            color: #71717a;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #2a2a30;
            border-top-color: #f97316;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="title-section">
            <h1>Push-Up Challenge</h1>
            <p className="subtitle">30 days to transform your strength</p>
          </div>
          <div className="header-actions">
            <NotificationToggle onToggle={(enabled) => {
              setNotificationEnabled(enabled);
              if (enabled) {
                scheduleNotificationCheck();
              }
            }} />
            <button className="settings-btn" onClick={handleSettingsClick} title="Change settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <AuthButton initialUser={user} onUserChange={setUser} />
          </div>
        </div>
      </header>

      {challenge && (
        <>
          <Dashboard
            completedDays={challenge.completedDays}
            startDate={challenge.startDate}
            currentPushups={challenge.currentPushups}
            targetPushups={challenge.targetPushups}
          />
          
          <div className="rule">
            <strong>20 seconds rest between sets.</strong> Follow the sets in order each day. Tap a day to mark it complete.
            {!user && <span className="sync-hint"> Sign in to sync progress across devices.</span>}
          </div>
          
          <div className="plan-list">
            {plan.map((dayPlan, i) => (
              <DayCard
                key={i}
                dayNumber={i + 1}
                plan={dayPlan}
                isCompleted={challenge.completedDays.includes(i + 1)}
                isFinal={i === 29}
                onToggle={handleDayToggle}
              />
            ))}
          </div>
          
          <ShareButton
            completedDays={challenge.completedDays.length}
            totalDays={30}
            streak={streak}
            targetPushups={challenge.targetPushups}
            lastCompletedDay={lastCompletedDay}
            challengeParams={{
              current: challenge.currentPushups,
              target: challenge.targetPushups,
              startDate: challenge.startDate,
            }}
          />
        </>
      )}

      <StartDateModal 
        isOpen={showModal} 
        onSubmit={handleModalSubmit}
        onClose={() => !isFirstVisit && setShowModal(false)}
        initialData={challenge || undefined}
      />

      <style>{`
        .app {
          min-height: 100vh;
        }
        
        .app-header {
          background: linear-gradient(180deg, rgba(10, 10, 12, 1) 0%, rgba(10, 10, 12, 0) 100%);
          padding: 1.5rem 0 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        
        .header-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .title-section h1 {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
          color: #fafafa;
        }
        
        .subtitle {
          font-size: 0.875rem;
          color: #71717a;
          margin: 0.25rem 0 0;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .settings-btn {
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
        }
        
        .settings-btn:hover {
          background: #27272a;
          border-color: #3f3f46;
        }
        
        .settings-btn svg {
          width: 20px;
          height: 20px;
          color: #71717a;
        }
        
        .settings-btn:hover svg {
          color: #a1a1aa;
        }
        
        .rule {
          background: linear-gradient(145deg, #1a1a1f 0%, #151518 100%);
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: #71717a;
        }
        
        .rule strong {
          color: #fafafa;
        }
        
        .sync-hint {
          color: #f97316;
          font-size: 0.85rem;
        }
        
        .plan-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-bottom: 6rem;
        }
        
        @media (min-width: 768px) {
          .plan-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }
        
        @media (min-width: 1024px) {
          .plan-list {
            grid-template-columns: repeat(5, 1fr);
          }
        }
        
        /* Auth button styles */
        :global(.auth-container) {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        :global(.user-name) {
          color: #fafafa;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        :global(.auth-btn) {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        :global(.auth-btn.sign-in) {
          background: white;
          color: #1f1f23;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        :global(.auth-btn.sign-in:hover) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        :global(.auth-btn.sign-out) {
          background: #27272a;
          color: #a1a1aa;
        }
        
        :global(.auth-btn.sign-out:hover) {
          background: #3f3f46;
          color: #fafafa;
        }
        
        :global(.google-icon) {
          flex-shrink: 0;
        }
        
        @media (max-width: 480px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
