interface ShareButtonProps {
  completedDays: number;
  totalDays: number;
  streak: number;
  targetPushups: number;
  lastCompletedDay?: {
    dayNumber: number;
    content: string;
  };
  challengeParams?: {
    current: number;
    target: number;
    startDate: string;
  };
}

const PRODUCTION_URL = 'https://pushuppower.vercel.app';

export default function ShareButton({ 
  completedDays, 
  totalDays, 
  streak, 
  targetPushups,
  lastCompletedDay,
  challengeParams 
}: ShareButtonProps) {
  const percentComplete = Math.round((completedDays / totalDays) * 100);
  
  const buildShareUrl = () => {
    const baseUrl = PRODUCTION_URL;
    if (challengeParams) {
      const params = new URLSearchParams({
        current: challengeParams.current.toString(),
        target: challengeParams.target.toString(),
        start: challengeParams.startDate,
      });
      return `${baseUrl}?${params.toString()}`;
    }
    return baseUrl;
  };
  
  const handleShare = () => {
    // Construct the share text based on progress
    let shareText = '';
    const shareUrl = buildShareUrl();
    
    // If a day was just completed, use that message
    if (lastCompletedDay) {
      shareText = `💪 I just did Day ${lastCompletedDay.dayNumber}: ${lastCompletedDay.content}!`;
    } else if (completedDays === 0) {
      shareText = `🏋️ Just started my 30-day push-up challenge! Goal: ${targetPushups} push-ups in one go. Let's go!`;
    } else if (completedDays === totalDays) {
      shareText = `🎉 I just completed my 30-day push-up challenge! I can now do ${targetPushups} push-ups in one go! 💪`;
    } else if (streak >= 7) {
      shareText = `🔥 Day ${completedDays} of my 30-day push-up challenge! ${streak}-day streak going strong. ${percentComplete}% complete!`;
    } else {
      shareText = `💪 Day ${completedDays} of my 30-day push-up challenge! ${percentComplete}% complete. Goal: ${targetPushups} push-ups.`;
    }
    
    // Add hashtags and URL
    shareText += `\n\n${shareUrl}`;
    shareText += '\n\n#PushUpChallenge #Fitness #30DayChallenge';
    
    // LinkedIn share URL
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    
    // Open in new window
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  return (
    <button className="share-button" onClick={handleShare} title="Share on LinkedIn">
      <svg className="linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      <span className="share-text">Share Progress</span>
      <span className="share-badge">{percentComplete}%</span>
      
      <style>{`
        .share-button {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.875rem 1.25rem;
          background: linear-gradient(135deg, #0077b5 0%, #005582 100%);
          border: none;
          border-radius: 50px;
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 119, 181, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          z-index: 100;
        }
        
        .share-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0, 119, 181, 0.5), 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        
        .share-button:active {
          transform: translateY(0);
        }
        
        .linkedin-icon {
          width: 20px;
          height: 20px;
        }
        
        .share-text {
          white-space: nowrap;
        }
        
        .share-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        
        @media (max-width: 480px) {
          .share-button {
            padding: 1rem;
            border-radius: 50%;
            bottom: 1rem;
            right: 1rem;
          }
          
          .share-text,
          .share-badge {
            display: none;
          }
          
          .linkedin-icon {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </button>
  );
}
