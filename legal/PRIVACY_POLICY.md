# Privacy Policy for Keep Pushing

**Last updated:** February 2025

Keep Pushing ("we", "our", or "the app") is a 30-day push-up challenge tracker. This policy describes what data we collect and how we use it.

## 1. Data We Collect

### 1.1 Data stored only on your device (no account)
- **Challenge progress:** Your start date, target, completed days, and workout preferences are stored locally on your device (localStorage).
- This data is **not** sent to our servers unless you sign in.

### 1.2 Data we process when you sign in with Google
If you choose **Sign in with Google**:
- We receive your **Google account ID**, **display name**, and **email address** from Google.
- We use this to associate your challenge data with your account and to sync your progress across devices.
- Your challenge data (start date, completed days, preferences) is stored in our database (Neon PostgreSQL) so you can access it from other devices.

### 1.3 Push notifications
If you enable **daily reminders**:
- On Android, we use **Firebase Cloud Messaging (FCM)**. Your device receives a unique token that we may store on our servers to send you reminder notifications at the time you choose.
- We do not use push notifications for marketing. We only send the reminders you configure (e.g. "Day 5 workout reminder").

### 1.4 Usage we do not collect
- We do not collect location data.
- We do not track your activity across other apps or websites.
- We do not sell your data to third parties.
- We do not use your data for advertising.

## 2. How We Use Your Data

- **To run the app:** Show your challenge, track completed days, and sync across devices if you sign in.
- **To send reminders:** If you enable notifications, we send daily workout reminders at your chosen time.
- **To improve the service:** We may use anonymized, aggregated data (e.g. crash reports) to fix bugs and improve the app. We do not use this to identify you.

## 3. Data Sharing

- **Google:** We use Google Sign-In; Google’s privacy policy applies to that sign-in flow.
- **Firebase (Google):** We use Firebase Cloud Messaging for push notifications; token and notification delivery are handled by Google.
- **Neon:** Challenge data for signed-in users is stored in Neon (PostgreSQL); Neon processes data according to their privacy policy.
- We do **not** sell, rent, or share your personal data with third parties for their marketing.

## 4. Data Retention

- **On your device:** Local data remains until you clear app data or uninstall the app.
- **In our database:** If you signed in, we retain your account and challenge data until you ask us to delete it or you delete your account (see Section 6).
- **FCM tokens:** We retain push notification tokens only as long as you have notifications enabled; we delete or stop using them when you turn notifications off or uninstall.

## 5. Security

- We use HTTPS for all network communication.
- Passwords are not stored by us; sign-in is handled by Google.
- We take reasonable measures to protect data stored on our servers.

## 6. Your Rights

- **Access:** You can see your data in the app (your progress and, if signed in, your profile).
- **Correction:** You can update your challenge and preferences in the app.
- **Deletion:** To request deletion of your account and data from our servers, contact us at the email below. We will delete your account and associated data within a reasonable time. Data on your device will remain until you clear it or uninstall.
- **Opt-out of notifications:** You can disable reminders in the app at any time.

## 7. Children

Keep Pushing is not directed at children under 13. We do not knowingly collect personal data from children under 13. If you believe we have collected such data, please contact us and we will delete it.

## 8. Changes to This Policy

We may update this privacy policy from time to time. We will post the updated policy in the app or on our website and update the "Last updated" date. Continued use of the app after changes means you accept the updated policy.

## 9. Contact Us

For privacy-related questions, deletion requests, or complaints:
- **Email:** support@keeppushing.app (replace with your actual support email)
- **App:** Keep Pushing (Android)

If you are in the European Economic Area (EEA), you may also have the right to lodge a complaint with your local data protection authority.
