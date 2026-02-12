// Mobile-specific configuration for Capacitor
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

// Initialize mobile app configuration
export async function initializeMobileApp(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[MobileConfig] Not a native app, skipping mobile initialization');
    return;
  }

  console.log('[MobileConfig] Initializing mobile app configuration');

  try {
    // Configure status bar
    await configureStatusBar();

    // Hide splash screen after app is ready
    await SplashScreen.hide();

    // Set up app state listeners
    setupAppListeners();

    console.log('[MobileConfig] Mobile app initialized successfully');
  } catch (error) {
    console.error('[MobileConfig] Error initializing mobile app:', error);
  }
}

// Configure status bar appearance
async function configureStatusBar(): Promise<void> {
  try {
    // Set status bar style to dark content (for light background)
    await StatusBar.setStyle({ style: Style.Dark });

    // Set background color to match app theme
    // #09090b is the dark background from the app
    await StatusBar.setBackgroundColor({ color: '#09090b' });

    // Show the status bar
    await StatusBar.show();

    console.log('[MobileConfig] Status bar configured');
  } catch (error) {
    console.error('[MobileConfig] Error configuring status bar:', error);
  }
}

// Set up app lifecycle listeners
function setupAppListeners(): void {
  // Listen for app state changes (foreground/background)
  App.addListener('appStateChange', ({ isActive }) => {
    console.log('[MobileConfig] App state changed:', isActive ? 'foreground' : 'background');
    
    if (isActive) {
      // App came to foreground
      // Could refresh challenge data here
      console.log('[MobileConfig] App is active, refreshing data');
      
      // Dispatch a custom event that components can listen to
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('app-foreground'));
      }
    }
  });

  // Listen for URL opening (deep links)
  App.addListener('appUrlOpen', (data) => {
    console.log('[MobileConfig] App opened with URL:', data.url);
    // Could handle deep links here, e.g., navigating to specific day
  });

  // Listen for back button (Android)
  App.addListener('backButton', ({ canGoBack }) => {
    console.log('[MobileConfig] Back button pressed, canGoBack:', canGoBack);
    
    if (!canGoBack) {
      // Exit app if no history to go back to
      App.exitApp();
    }
  });

  console.log('[MobileConfig] App listeners configured');
}

// Show splash screen (useful for loading states)
export async function showSplashScreen(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await SplashScreen.show({
      autoHide: false,
      showDuration: 0,
    });
  } catch (error) {
    console.error('[MobileConfig] Error showing splash screen:', error);
  }
}

// Hide splash screen
export async function hideSplashScreen(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await SplashScreen.hide();
  } catch (error) {
    console.error('[MobileConfig] Error hiding splash screen:', error);
  }
}

// Get app info
export async function getAppInfo(): Promise<{ name: string; id: string; build: string; version: string } | null> {
  if (!Capacitor.isNativePlatform()) return null;
  
  try {
    const info = await App.getInfo();
    console.log('[MobileConfig] App info:', info);
    return info;
  } catch (error) {
    console.error('[MobileConfig] Error getting app info:', error);
    return null;
  }
}
