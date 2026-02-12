// Notification service for managing daily push-up reminders
// Supports both web (Service Worker) and native (Capacitor) notifications

import { Capacitor } from '@capacitor/core';
import * as CapNotif from './capacitor-notifications';

const STORAGE_KEY_ENABLED = 'notification-enabled';
const STORAGE_KEY_TIME = 'notification-time';
const STORAGE_KEY_TIME_24H = 'notification-time-24h';
const DEFAULT_TIME = '12:00';

export interface NotificationPreferences {
  enabled: boolean;
  time: string; // 12-hour format (e.g., "12:00 PM")
  time24h: string; // 24-hour format (e.g., "12:00")
  fcmToken?: string; // Only for native app
}

// Check if running in native Capacitor app
function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

// Request notification permission (native or web)
export async function requestPermission(): Promise<NotificationPermission | 'granted' | 'denied' | 'prompt'> {
  // Use native notifications if in Capacitor app
  if (isNativeApp()) {
    const result = await CapNotif.requestNativePermission();
    return result as NotificationPermission;
  }
  
  // Fall back to web notifications
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  
  const permission = await Notification.requestPermission();
  return permission;
}

// Check if notifications are enabled
export function isNotificationEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Use same storage for both native and web
  const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
  return stored === 'true';
}

// Get notification time preferences
export function getNotificationTime(): NotificationPreferences {
  if (typeof window === 'undefined') {
    return {
      enabled: false,
      time: DEFAULT_TIME,
      time24h: '12:00',
    };
  }
  
  // Use native implementation if in Capacitor
  if (isNativeApp()) {
    return CapNotif.getNotificationPreferences();
  }
  
  // Web implementation
  const enabled = localStorage.getItem(STORAGE_KEY_ENABLED) === 'true';
  const time = localStorage.getItem(STORAGE_KEY_TIME) || DEFAULT_TIME;
  const time24h = localStorage.getItem(STORAGE_KEY_TIME_24H) || '12:00';
  
  return {
    enabled,
    time,
    time24h,
  };
}

// Set notification preferences
export async function setNotificationPreferences(prefs: NotificationPreferences): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // Use native implementation if in Capacitor
  if (isNativeApp()) {
    await CapNotif.setNotificationPreferences(prefs);
    return;
  }
  
  // Web implementation
  localStorage.setItem(STORAGE_KEY_ENABLED, prefs.enabled.toString());
  localStorage.setItem(STORAGE_KEY_TIME, prefs.time);
  localStorage.setItem(STORAGE_KEY_TIME_24H, prefs.time24h);
  
  // Notify service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'NOTIFICATION_DATA',
      enabled: prefs.enabled,
      time: prefs.time24h,
      challengeData: getChallengeData(),
    });
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

// Convert 12-hour time to 24-hour format
export function convertTo24Hour(time12h: string): string {
  const [time, period] = time12h.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    return `${hours + 12}:${minutes.toString().padStart(2, '0')}`;
  }
  if (period === 'AM' && hours === 12) {
    return `00:${minutes.toString().padStart(2, '0')}`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Convert 24-hour time to 12-hour format
export function convertTo12Hour(time24h: string): string {
  const [hours, minutes] = time24h.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

// Schedule notification check
export async function scheduleNotificationCheck(): Promise<void> {
  const prefs = getNotificationTime();
  if (!prefs.enabled) {
    console.log('[Notifications] Not enabled, skipping');
    return;
  }
  
  // Use native implementation if in Capacitor
  if (isNativeApp()) {
    console.log('[Notifications] Using native push notifications');
    await CapNotif.initializePushNotifications();
    return;
  }
  
  // Web implementation with Service Worker
  // Request permission if not granted
  const permission = await requestPermission();
  if (permission !== 'granted') {
    console.log('[Notifications] Permission not granted:', permission);
    return;
  }
  
  // Register service worker if not already registered
  const registration = await registerServiceWorker();
  if (!registration) {
    console.log('[Notifications] Service worker registration failed');
    return;
  }
  
  // Wait for service worker to be ready
  await navigator.serviceWorker.ready;
  
  // Get challenge data
  const challengeData = getChallengeData();
  
  console.log('[Notifications] Sending data to service worker:', {
    enabled: prefs.enabled,
    time: prefs.time24h,
    hasChallenge: !!challengeData,
  });
  
  // Send notification data to service worker
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
    });
    
    navigator.serviceWorker.controller.postMessage({
      type: 'NOTIFICATION_DATA',
      enabled: prefs.enabled,
      time: prefs.time24h,
      challengeData: challengeData,
    });
  } else {
    // Service worker not ready yet, wait a bit and retry
    console.log('[Notifications] Service worker controller not ready, waiting...');
    setTimeout(() => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'NOTIFICATION_DATA',
          enabled: prefs.enabled,
          time: prefs.time24h,
          challengeData: challengeData,
        });
      }
    }, 1000);
  }
}

// Test notification (for debugging)
export async function testNotification(): Promise<void> {
  console.log('[Notifications] Test notification requested');
  
  // Use native test if in Capacitor
  if (isNativeApp()) {
    console.log('[Notifications] Using native test notification');
    try {
      await CapNotif.testNativeNotification();
      console.log('[Notifications] Native test notification sent');
    } catch (error) {
      console.error('[Notifications] Native test failed:', error);
      throw error;
    }
    return;
  }
  
  // Web implementation
  console.log('[Notifications] Current permission:', Notification.permission);

  const permission = await requestPermission();
  console.log('[Notifications] Permission after request:', permission);

  if (permission !== 'granted') {
    throw new Error('Notification permission not granted');
  }

  // Try using the service worker first
  const registration = await registerServiceWorker();
  console.log('[Notifications] Service worker registration:', registration);

  if (registration) {
    await navigator.serviceWorker.ready;
    console.log('[Notifications] Service worker ready, controller:', navigator.serviceWorker.controller);

    if (navigator.serviceWorker.controller) {
      console.log('[Notifications] Sending TEST_NOTIFICATION to service worker');
      navigator.serviceWorker.controller.postMessage({
        type: 'TEST_NOTIFICATION',
      });

      // Give SW time to show notification, then check if it worked
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if notification was shown by SW
      const notifications = await registration.getNotifications({ tag: 'test-notification' });
      if (notifications.length > 0) {
        console.log('[Notifications] SW showed notification successfully');
        return;
      }
      console.log('[Notifications] SW notification not found, using fallback');
    }
  }

  // Fallback: show notification directly
  console.log('[Notifications] Using direct Notification API fallback');
  const notification = new Notification('Test Notification', {
    body: 'Notifications are working!',
    icon: '/favicon.svg',
    tag: 'test-notification-direct',
  });
  console.log('[Notifications] Direct notification created:', notification);
}

// Cancel all notifications
export async function cancelNotifications(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const notifications = await registration.getNotifications();
      notifications.forEach(notification => notification.close());
    }
  }
}
