import { useState } from 'react';

interface DayPlan {
  type: 'pushups' | 'plank';
  sets?: number[];
  seconds?: number;
}

interface DayCardProps {
  dayNumber: number;
  plan: DayPlan;
  isCompleted: boolean;
  isFinal: boolean;
  onToggle: (dayNumber: number, completed: boolean) => Promise<void>;
}

export default function DayCard({ dayNumber, plan, isCompleted, isFinal, onToggle }: DayCardProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const handleToggle = async () => {
    setLoading(true);
    const newState = !completed;
    
    try {
      await onToggle(dayNumber, newState);
      setCompleted(newState);
    } catch (error) {
      console.error('Failed to toggle day:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPlank = plan.type === 'plank';
  
  const getContent = () => {
    if (isPlank) {
      return `${plan.seconds}s push-up plank hold, ${plan.sets} sets`;
    }
    if (plan.sets?.length === 1) {
      return `${plan.sets[0]} push-ups in one go`;
    }
    return plan.sets?.map((n) => `${n} push-ups`).join(', ');
  };

  return (
    <div 
      className={`day-card ${isPlank ? 'day-plank' : ''} ${isFinal ? 'day-final' : ''} ${completed ? 'day-completed' : ''}`}
      onClick={handleToggle}
    >
      <div className="day-header">
        <span className="day-num">Day {dayNumber}</span>
        <div className={`checkbox ${loading ? 'loading' : ''} ${completed ? 'checked' : ''}`}>
          {loading ? (
            <div className="spinner"></div>
          ) : completed ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : null}
        </div>
      </div>
      <div className={`day-content ${isPlank ? 'plank' : ''} ${isFinal ? 'final' : ''}`}>
        {getContent()}
      </div>
      {completed && (
        <div className="completed-overlay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
      )}
      
      <style>{`
        .day-card {
          background: linear-gradient(145deg, #1a1a1f 0%, #151518 100%);
          border: 1px solid #2a2a30;
          border-radius: 14px;
          padding: 1.25rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        
        .day-card:hover {
          border-color: #3f3f46;
          transform: translateY(-2px);
        }
        
        .day-card:active {
          transform: translateY(0);
        }
        
        .day-card.day-plank {
          border-color: rgba(220, 38, 38, 0.4);
          background: linear-gradient(145deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
        }
        
        .day-card.day-final {
          border-color: rgba(249, 115, 22, 0.5);
          background: linear-gradient(145deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%);
        }
        
        .day-card.day-completed {
          border-color: rgba(34, 197, 94, 0.5);
          box-shadow: 0 0 25px rgba(34, 197, 94, 0.25), 0 0 50px rgba(34, 197, 94, 0.1);
        }
        
        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .day-num {
          font-size: 0.75rem;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .day-completed .day-num {
          color: #22c55e;
        }
        
        .checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid #3f3f46;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .checkbox.checked {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-color: #22c55e;
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
        }
        
        .checkbox svg {
          width: 14px;
          height: 14px;
          color: white;
        }
        
        .checkbox .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .day-content {
          font-size: 0.9rem;
          font-weight: 500;
          color: #e4e4e7;
          line-height: 1.5;
        }
        
        .day-content.plank {
          color: #f87171;
        }
        
        .day-content.final {
          color: #f97316;
          font-weight: 600;
        }
        
        .day-completed .day-content {
          color: #86efac;
        }
        
        .completed-overlay {
          position: absolute;
          top: 0.75rem;
          right: 3rem;
          opacity: 0.1;
        }
        
        .completed-overlay svg {
          width: 60px;
          height: 60px;
          color: #22c55e;
        }
      `}</style>
    </div>
  );
}
