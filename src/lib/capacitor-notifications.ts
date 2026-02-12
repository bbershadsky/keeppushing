// Native push notifications for Capacitor Android app
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import type { Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';

const STORAGE_KEY_ENABLED = 'notification-enabled';
const STORAGE_KEY_TIME = 'notification-time';
const STORAGE_KEY_TIME_24H = 'notification-time-24h';
const STORAGE_KEY_FCM_TOKEN = 'fcm-token';
const DEFAULT_TIME = '12:00';

export interface NotificationPreferences {
  enabled: boolean;
  time: string; // 12-hour format
  time24h: string; // 24-hour format
  fcmToken?: string;
}

// Check if running in native Capacitor app
export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

// Initialize push notifications (call on app start)
export async function initializePushNotifications(): Promise<void> {
  if (!isNativeApp()) {
    console.log('[CapNotif] Not a native app, skipping initialization');
    return;
  }

  console.log('[CapNotif] Initializing native push notifications');

  // Request permission
  const permStatus = await PushNotifications.checkPermissions();
  console.log('[CapNotif] Current permission status:', permStatus.receive);

  if (permStatus.receive === 'prompt') {
    const result = await PushNotifications.requestPermissions();
    console.log('[CapNotif] Permission request result:', result.receive);
  }

  // Register with FCM
  await PushNotifications.register();

  // Listen for registration token
  await PushNotifications.addListener('registration', (token: Token) => {
    console.log('[CapNotif] FCM token received:', token.value);
    localStorage.setItem(STORAGE_KEY_FCM_TOKEN, token.value);
    
    // TODO: Send token to backend API
    sendTokenToBackend(token.value);
  });

  // Listen for registration errors
  await PushNotifications.addListener('registrationError', (error: any) => {
    console.error('[CapNotif] Registration error:', error);
  });

  // Listen for push notification received (app in foreground)
  await PushNotifications.addListener('pushNotificationReceived', 
    (notification: PushNotificationSchema) => {
      console.log('[CapNotif] Push notification received:', notification);
    }
  );

  // Listen for notification action (user tapped notification)
  await PushNotifications.addListener('pushNotificationActionPerformed', 
    (notification: ActionPerformed) => {
      console.log('[CapNotif] Push notification action performed:', notification);
      
      // Navigate to app (already handled by OS)
      // Could navigate to specific page based on notification data
    }
  );
}

// Send FCM token to backend
async function sendTokenToBackend(token: string): Promise<void> {
  try {
    // TODO: Replace with your actual backend API endpoint
    const response = await fetch('/api/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        platform: 'android',
      }),
    });

    if (response.ok) {
      console.log('[CapNotif] Token sent to backend successfully');
    } else {
      console.error('[CapNotif] Failed to send token to backend:', response.status);
    }
  } catch (error) {
    console.error('[CapNotif] Error sending token to backend:', error);
  }
}

// Request notification permission
export async function requestNativePermission(): Promise<'granted' | 'denied' | 'prompt'> {
  if (!isNativeApp()) {
    return 'denied';
  }

  const permStatus = await PushNotifications.checkPermissions();
  
  if (permStatus.receive === 'granted') {
    return 'granted';
  }

  if (permStatus.receive === 'denied') {
    return 'denied';
  }

  // Request permission
  const result = await PushNotifications.requestPermissions();
  return result.receive;
}

// Get stored notification preferences
export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') {
    return {
      enabled: false,
      time: DEFAULT_TIME,
      time24h: '12:00',
    };
  }

  const enabled = localStorage.getItem(STORAGE_KEY_ENABLED) === 'true';
  const time = localStorage.getItem(STORAGE_KEY_TIME) || DEFAULT_TIME;
  const time24h = localStorage.getItem(STORAGE_KEY_TIME_24H) || '12:00';
  const fcmToken = localStorage.getItem(STORAGE_KEY_FCM_TOKEN) || undefined;

  return { enabled, time, time24h, fcmToken };
}

// Save notification preferences
export async function setNotificationPreferences(prefs: NotificationPreferences): Promise<void> {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY_ENABLED, prefs.enabled.toString());
  localStorage.setItem(STORAGE_KEY_TIME, prefs.time);
  localStorage.setItem(STORAGE_KEY_TIME_24H, prefs.time24h);

  if (prefs.enabled && isNativeApp()) {
    // Register for push notifications if not already registered
    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
    }

    // Send preferences to backend
    await sendPreferencesToBackend(prefs);
  }
}

// Send notification preferences to backend for scheduling
async function sendPreferencesToBackend(prefs: NotificationPreferences): Promise<void> {
  try {
    const challengeData = getChallengeData();
    const fcmToken = localStorage.getItem(STORAGE_KEY_FCM_TOKEN);

    if (!fcmToken) {
      console.warn('[CapNotif] No FCM token available');
      return;
    }

    // TODO: Replace with your actual backend API endpoint
    const response = await fetch('/api/notification-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enabled: prefs.enabled,
        time: prefs.time24h,
        fcmToken,
        challengeData,
      }),
    });

    if (response.ok) {
      console.log('[CapNotif] Preferences sent to backend successfully');
    } else {
      console.error('[CapNotif] Failed to send preferences to backend:', response.status);
    }
  } catch (error) {
    console.error('[CapNotif] Error sending preferences to backend:', error);
  }
}

// Get challenge data from localStorage
function getChallengeData() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('pushup-challenge');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Invalid data
  }
  return null;
}

// Test native notification
export async function testNativeNotification(): Promise<void> {
  if (!isNativeApp()) {
    throw new Error('Not running in native app');
  }

  console.log('[CapNotif] Testing native notification');

  // Check permission
  const permStatus = await PushNotifications.checkPermissions();
  if (permStatus.receive !== 'granted') {
    throw new Error('Notification permission not granted');
  }

  // For testing, we'll trigger a notification from the backend
  // In production, you'd send a test notification via your backend API
  const fcmToken = localStorage.getItem(STORAGE_KEY_FCM_TOKEN);
  if (!fcmToken) {
    throw new Error('No FCM token available');
  }

  try {
    const response = await fetch('/api/test-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcmToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to send test notification');
    }

    console.log('[CapNotif] Test notification sent successfully');
  } catch (error) {
    console.error('[CapNotif] Error sending test notification:', error);
    throw error;
  }
}

// Remove all listeners (call on app cleanup)
export async function removeAllListeners(): Promise<void> {
  if (!isNativeApp()) return;

  await PushNotifications.removeAllListeners();
  console.log('[CapNotif] All listeners removed');
}
