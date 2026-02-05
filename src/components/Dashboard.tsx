interface DashboardProps {
  completedDays: number[];
  startDate: string;
  currentPushups: number;
  targetPushups: number;
}

export default function Dashboard({ completedDays, startDate, currentPushups, targetPushups }: DashboardProps) {
  const totalDays = 30;
  const completedCount = completedDays.length;
  const percentComplete = Math.round((completedCount / totalDays) * 100);
  const daysRemaining = totalDays - completedCount;
  
  // Calculate streak (consecutive days from the beginning)
  const sortedDays = [...completedDays].sort((a, b) => a - b);
  let streak = 0;
  for (let i = 0; i < sortedDays.length; i++) {
    if (sortedDays[i] === i + 1) {
      streak = i + 1;
    } else {
      break;
    }
  }
  
  // Calculate current day of challenge
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - start.getTime();
  const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const displayDay = Math.min(Math.max(1, currentDay), 30);
  
  // Calculate if on track
  const expectedCompletions = Math.min(currentDay, 30);
  const isOnTrack = completedCount >= expectedCompletions - 1; // Allow 1 day grace

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card accent">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon progress-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{percentComplete}%</div>
            <div className="stat-label">Complete</div>
          </div>
          <div className="progress-ring">
            <svg viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#2a2a30"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray={`${percentComplete}, 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon remaining-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{daysRemaining}</div>
            <div className="stat-label">Days Left</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon day-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">Day {displayDay}</div>
            <div className="stat-label">{isOnTrack ? 'On Track' : 'Keep Going'}</div>
          </div>
          {isOnTrack && <div className="on-track-badge">✓</div>}
        </div>
      </div>
      
      <div className="challenge-info">
        <span className="info-item">
          <span className="info-label">Goal:</span>
          <span className="info-value">{currentPushups} → {targetPushups} push-ups</span>
        </span>
        <span className="info-divider">•</span>
        <span className="info-item">
          <span className="info-label">Started:</span>
          <span className="info-value">{new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </span>
      </div>
      
      <style>{`
        .dashboard {
          margin-bottom: 2rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        .stat-card {
          background: linear-gradient(145deg, #1a1a1f 0%, #151518 100%);
          border: 1px solid #2a2a30;
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card.accent {
          background: linear-gradient(145deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%);
          border-color: rgba(249, 115, 22, 0.3);
        }
        
        .stat-icon {
          width: 44px;
          height: 44px;
          background: #2a2a30;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .stat-card.accent .stat-icon {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        
        .stat-icon svg {
          width: 22px;
          height: 22px;
          color: #71717a;
        }
        
        .stat-card.accent .stat-icon svg {
          color: white;
        }
        
        .progress-icon svg { color: #22c55e; }
        .remaining-icon svg { color: #a78bfa; }
        .day-icon svg { color: #38bdf8; }
        
        .stat-content {
          flex: 1;
          min-width: 0;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e4e4e7;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #71717a;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .progress-ring {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
        }
        
        .progress-ring svg {
          transform: rotate(-90deg);
        }
        
        .on-track-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 20px;
          height: 20px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          color: white;
          font-weight: 700;
        }
        
        .challenge-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: #18181c;
          border: 1px solid #2a2a30;
          border-radius: 10px;
          font-size: 0.875rem;
        }
        
        @media (max-width: 480px) {
          .challenge-info {
            flex-direction: column;
            gap: 0.25rem;
          }
          .info-divider {
            display: none;
          }
        }
        
        .info-item {
          display: flex;
          gap: 0.375rem;
        }
        
        .info-label {
          color: #71717a;
        }
        
        .info-value {
          color: #e4e4e7;
          font-weight: 500;
        }
        
        .info-divider {
          color: #3f3f46;
        }
      `}</style>
    </div>
  );
}
