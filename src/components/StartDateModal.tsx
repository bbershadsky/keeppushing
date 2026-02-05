import { useState, useEffect } from 'react';
// import { 
//   getNotificationTime, 
//   setNotificationPreferences,
//   convertTo12Hour,
//   convertTo24Hour 
// } from '../lib/notifications';

interface StartDateModalProps {
  isOpen: boolean;
  onSubmit: (data: { startDate: string; currentPushups: number; targetPushups: number }) => void;
  onClose?: () => void;
  initialData?: {
    startDate: string;
    currentPushups: number;
    targetPushups: number;
  };
}

export default function StartDateModal({ isOpen, onSubmit, onClose, initialData }: StartDateModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(initialData?.startDate || today);
  const [currentPushups, setCurrentPushups] = useState(initialData?.currentPushups || 5);
  const [targetPushups, setTargetPushups] = useState(initialData?.targetPushups || 50);
  const [loading, setLoading] = useState(false);
  
  // NOTIFICATIONS DISABLED
  // Notification preferences
  // const [notificationEnabled, setNotificationEnabled] = useState(false);
  // const [notificationTime, setNotificationTime] = useState('12:00 PM');

  // Load notification preferences on mount
  // useEffect(() => {
  //   const prefs = getNotificationTime();
  //   setNotificationEnabled(prefs.enabled);
  //   setNotificationTime(prefs.time);
  // }, []);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setStartDate(initialData.startDate);
      setCurrentPushups(initialData.currentPushups);
      setTargetPushups(initialData.targetPushups);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure target is greater than current
    const validTarget = Math.max(currentPushups + 1, targetPushups);
    
    // NOTIFICATIONS DISABLED
    // Save notification preferences
    // const time24h = convertTo24Hour(notificationTime);
    // setNotificationPreferences({
    //   enabled: notificationEnabled,
    //   time: notificationTime,
    //   time24h,
    // });
    
    onSubmit({ 
      startDate, 
      currentPushups: Math.max(1, currentPushups), 
      targetPushups: validTarget 
    });
    
    setLoading(false);
  };
  
  // NOTIFICATIONS DISABLED
  // const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const time24h = e.target.value; // time input gives 24h format
  //   const time12h = convertTo12Hour(time24h);
  //   setNotificationTime(time12h);
  // };

  const canClose = !!onClose;

  return (
    <div className="modal-overlay" onClick={canClose ? onClose : undefined}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {canClose && (
          <button className="close-btn" onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
        
        <div className="modal-header">
          <div className="modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2>{initialData ? 'Update Your Challenge' : 'Start Your Challenge'}</h2>
          <p>Set up your 30-day push-up journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="startDate">
              <span className="label-text">Start Date</span>
              <span className="label-hint">When did/do you want to begin?</span>
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="currentPushups">
                <span className="label-text">Current Max</span>
                <span className="label-hint">Push-ups in one go</span>
              </label>
              <input
                id="currentPushups"
                type="number"
                value={currentPushups}
                onChange={(e) => setCurrentPushups(parseInt(e.target.value) || 1)}
                min={1}
                max={199}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="targetPushups">
                <span className="label-text">Target Goal</span>
                <span className="label-hint">Your 30-day goal</span>
              </label>
              <input
                id="targetPushups"
                type="number"
                value={targetPushups}
                onChange={(e) => setTargetPushups(parseInt(e.target.value) || 10)}
                min={currentPushups + 1}
                max={200}
                required
              />
            </div>
          </div>
          
          {/* NOTIFICATIONS DISABLED */}
          {/* <div className="notification-section">
            <div className="notification-toggle-group">
              <label className="checkbox-label" htmlFor="notificationEnabled">
                <input
                  id="notificationEnabled"
                  type="checkbox"
                  checked={notificationEnabled}
                  onChange={(e) => setNotificationEnabled(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <span className="checkbox-text">Daily Reminders</span>
                  <span className="checkbox-hint">Get notified to do your push-ups</span>
                </div>
              </label>
            </div>
            
            {notificationEnabled && (
              <div className="form-group">
                <label htmlFor="notificationTime">
                  <span className="label-text">Reminder Time</span>
                  <span className="label-hint">When should we remind you?</span>
                </label>
                <input
                  id="notificationTime"
                  type="time"
                  value={convertTo24Hour(notificationTime)}
                  onChange={handleTimeChange}
                  className="time-input"
                />
              </div>
            )}
          </div> */}
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                {initialData ? 'Update Challenge' : 'Start Challenge'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
      
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .modal-content {
          background: linear-gradient(145deg, #1a1a1f 0%, #131316 100%);
          border: 1px solid #27272a;
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          animation: slideUp 0.3s ease-out;
          position: relative;
        }
        
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          background: #27272a;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .close-btn:hover {
          background: #3f3f46;
        }
        
        .close-btn svg {
          width: 18px;
          height: 18px;
          color: #71717a;
        }
        
        .close-btn:hover svg {
          color: #fafafa;
        }
        
        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .modal-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
        }
        
        .modal-icon svg {
          width: 28px;
          height: 28px;
          color: white;
        }
        
        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: #fafafa;
          letter-spacing: -0.02em;
        }
        
        .modal-header p {
          color: #71717a;
          margin: 0;
          font-size: 0.95rem;
        }
        
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .modal-form label {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        
        .label-text {
          font-weight: 600;
          color: #fafafa;
          font-size: 0.875rem;
        }
        
        .label-hint {
          font-size: 0.75rem;
          color: #71717a;
          font-weight: 400;
        }
        
        .modal-form input {
          padding: 0.875rem 1rem;
          background: #0a0a0c;
          border: 1px solid #27272a;
          border-radius: 10px;
          color: #fafafa;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        
        .modal-form input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
        }
        
        .modal-form input[type="date"] {
          cursor: pointer;
        }
        
        .modal-form input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
        
        /* NOTIFICATIONS DISABLED */
        /* .notification-section {
          padding: 1rem;
          background: rgba(249, 115, 22, 0.05);
          border: 1px solid rgba(249, 115, 22, 0.15);
          border-radius: 12px;
          margin-top: 0.5rem;
        }
        
        .notification-toggle-group {
          margin-bottom: 1rem;
        }
        
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
        }
        
        .checkbox-input {
          display: none;
        }
        
        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #3f3f46;
          border-radius: 6px;
          background: #0a0a0c;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.2s;
          position: relative;
        }
        
        .checkbox-input:checked + .checkbox-custom {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-color: #f97316;
        }
        
        .checkbox-input:checked + .checkbox-custom::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
        }
        
        .checkbox-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        
        .checkbox-text {
          font-weight: 600;
          color: #fafafa;
          font-size: 0.875rem;
        }
        
        .checkbox-hint {
          font-size: 0.75rem;
          color: #71717a;
        }
        
        .time-input {
          padding: 0.875rem 1rem;
          background: #0a0a0c;
          border: 1px solid #27272a;
          border-radius: 10px;
          color: #fafafa;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        
        .time-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
        }
        
        .time-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        } */
        
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
        }
        
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
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
