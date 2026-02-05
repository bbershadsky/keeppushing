// Service Worker for Push-Up Challenge Notifications
// Version 2 - force update
const SW_VERSION = 2;
const NOTIFICATION_CHECK_INTERVAL = 60 * 1000; // Check every minute

console.log("[SW] Service Worker version", SW_VERSION, "loaded");

// Store notification data in memory
let notificationData = {
  enabled: false,
  time: null,
  challengeData: null,
  lastCheck: null,
};

// Install event
self.addEventListener("install", (event) => {
  console.log("[SW] Installing version", SW_VERSION);
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating version", SW_VERSION);
  event.waitUntil(self.clients.claim());
  // Start periodic checking
  startPeriodicCheck();
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (let client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      }),
  );
});

// Message handler from client
self.addEventListener("message", async (event) => {
  if (event.data && event.data.type === "NOTIFICATION_DATA") {
    const { enabled, time, challengeData } = event.data;
    notificationData.enabled = enabled;
    notificationData.time = time;
    notificationData.challengeData = challengeData;

    console.log("[SW] Received notification data:", {
      enabled,
      time,
      hasChallenge: !!challengeData,
    });

    // Check immediately if enabled
    if (enabled && time && challengeData) {
      await checkAndShowNotification();
    }
  }

  if (event.data && event.data.type === "SCHEDULE_NOTIFICATION") {
    console.log("[SW] Scheduling notification check");
    startPeriodicCheck();
  }

  if (event.data && event.data.type === "TEST_NOTIFICATION") {
    // Test notification - show immediately
    console.log(
      "[SW] Test notification requested - calling showTestNotification now",
    );
    event.waitUntil(showTestNotification());
  }
});

// Start periodic checking
let checkIntervalId = null;

function startPeriodicCheck() {
  // Clear any existing interval to prevent duplicates
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
  }

  // Check immediately
  checkAndShowNotification();

  // Then check periodically
  checkIntervalId = setInterval(() => {
    checkAndShowNotification();
  }, NOTIFICATION_CHECK_INTERVAL);
}

// Check if it's time to show notification
async function checkAndShowNotification() {
  try {
    if (
      !notificationData.enabled ||
      !notificationData.time ||
      !notificationData.challengeData
    ) {
      return;
    }

    await showNotificationIfNeeded(
      notificationData.time,
      notificationData.challengeData,
    );
  } catch (error) {
    console.error("[SW] Error checking notification:", error);
  }
}

// Show notification if conditions are met
async function showNotificationIfNeeded(notificationTime, challengeData) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const [hour, minute] = notificationTime.split(":").map(Number);

  // Check if current time matches notification time (within 5 minute window)
  const timeMatch =
    currentHour === hour && Math.abs(currentMinute - minute) <= 5;

  // For testing: also check if it's been more than 1 minute since last check
  const shouldCheck =
    timeMatch ||
    (notificationData.lastCheck && now - notificationData.lastCheck > 60000);

  if (!shouldCheck) {
    return;
  }

  notificationData.lastCheck = now;

  // Check if challenge is active
  if (!challengeData || !challengeData.startDate) {
    console.log("[SW] No challenge data or start date");
    return;
  }

  // Calculate current day
  const startDate = new Date(challengeData.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - startDate.getTime();
  const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (currentDay < 1 || currentDay > 30) {
    console.log("[SW] Current day out of range:", currentDay);
    return;
  }

  // Check if today is already completed
  if (
    challengeData.completedDays &&
    challengeData.completedDays.includes(currentDay)
  ) {
    console.log("[SW] Day already completed:", currentDay);
    return;
  }

  // Generate workout description for notification
  let workoutDescription = "";
  try {
    const BASE_PLAN_50 = [
      { type: "pushups", sets: [4, 2, 2] },
      { type: "pushups", sets: [6, 2, 2] },
      { type: "plank", seconds: 10, sets: [3] },
      { type: "pushups", sets: [8, 4, 2] },
      { type: "pushups", sets: [10, 4, 4] },
      { type: "pushups", sets: [12, 4, 4] },
      { type: "plank", seconds: 15, sets: [3] },
      { type: "pushups", sets: [14, 6, 4] },
      { type: "pushups", sets: [14, 6, 6] },
      { type: "pushups", sets: [16, 6, 4] },
      { type: "plank", seconds: 20, sets: [3] },
      { type: "pushups", sets: [18, 8, 6] },
      { type: "pushups", sets: [20, 8, 6] },
      { type: "pushups", sets: [20, 10, 8] },
      { type: "plank", seconds: 20, sets: [4] },
      { type: "pushups", sets: [22, 10, 8] },
      { type: "pushups", sets: [24, 12, 8] },
      { type: "pushups", sets: [24, 12, 10] },
      { type: "pushups", sets: [26, 12, 10] },
      { type: "pushups", sets: [26, 14, 8] },
      { type: "pushups", sets: [28, 14, 10] },
      { type: "pushups", sets: [28, 14, 12] },
      { type: "plank", seconds: 25, sets: [4] },
      { type: "pushups", sets: [30, 14, 12] },
      { type: "pushups", sets: [30, 15, 15] },
      { type: "pushups", sets: [32, 16, 14] },
      { type: "plank", seconds: 25, sets: [6] },
      { type: "pushups", sets: [34, 16, 14] },
      { type: "plank", seconds: 30, sets: [6] },
      { type: "pushups", sets: [50] },
    ];

    const dayIndex = currentDay - 1;
    if (dayIndex >= 0 && dayIndex < BASE_PLAN_50.length) {
      const dayPlan = BASE_PLAN_50[dayIndex];
      if (dayPlan.type === "plank") {
        workoutDescription = `${dayPlan.seconds}s plank hold, ${dayPlan.sets[0]} sets`;
      } else if (dayPlan.sets) {
        if (dayPlan.sets.length === 1) {
          workoutDescription = `${dayPlan.sets[0]} push-ups in one go`;
        } else {
          workoutDescription = dayPlan.sets
            .map((n) => `${n} push-ups`)
            .join(", ");
        }
      }
    }
  } catch (e) {
    console.error("[SW] Error generating workout description:", e);
  }

  // Show notification
  const title = `Day ${currentDay} of 30`;
  const body = workoutDescription
    ? `Time for your push-up workout! 💪\nToday: ${workoutDescription}`
    : `Time for your push-up workout! 💪`;

  console.log("[SW] Showing notification:", { title, body, currentDay });

  await self.registration.showNotification(title, {
    body,
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: `pushup-day-${currentDay}`,
    requireInteraction: false,
    data: {
      url: "/",
      day: currentDay,
    },
  });
}

// Test notification function
async function showTestNotification() {
  try {
    console.log("[SW] Attempting to show test notification...");
    console.log("[SW] Registration:", self.registration);
    console.log("[SW] Permission:", Notification.permission);

    if (Notification.permission !== "granted") {
      console.error(
        "[SW] Notification permission not granted:",
        Notification.permission,
      );
      return;
    }

    await self.registration.showNotification("Test Notification", {
      body: "Notifications are working!",
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "test-notification",
      requireInteraction: true,
    });
    console.log("[SW] Test notification shown successfully");
  } catch (error) {
    console.error("[SW] Failed to show test notification:", error);
  }
}
