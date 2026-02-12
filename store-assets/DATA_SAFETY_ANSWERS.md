# Data Safety Form – How to Answer (Play Console)

Use these answers when filling out the **Data safety** section in Google Play Console. Your app has optional Google sign-in and optional push notifications, so you do collect some user data.

---

## 1. "Does your app collect or share any of the required user data types?"

**Answer: Yes**

You collect:
- **With Google Sign-In:** name (or display name), email address; plus app data (challenge progress) stored in your database.
- **With push notifications:** device/app identifiers (FCM token) to send reminders.

---

## 2. "Is all of the user data collected by your app encrypted in transit?"

**Answer: Yes**

You use HTTPS for API calls and all server communication. Select **Yes**.

---

## 3. "Which of the following methods of account creation does your app support?"

**Answer: OAuth** (only this one)

- Sign-in is **Google Sign-In**, which is OAuth.
- Do **not** select "Username and password" or "Username and other authentication" (you don’t have in-app accounts).
- Do **not** select "My app does not allow users to create an account" – users can sign in with Google, which links an account for sync.

So: check **OAuth** only.

---

## 4. Delete account URL (required – you must provide a link)

Play Console requires a **Delete account URL**: a link to a page that:

- Refers to your app or developer name (as on the store listing)
- Prominently features the steps users take to request account deletion
- Specifies what data is deleted or kept, and any retention period

**What we added:** A dedicated page that does this is in **`legal/delete-account.html`**. It includes:

- App name (Keep Pushing)
- Step-by-step instructions (email support, what to include, 30-day processing)
- What we delete (account, challenge data, FCM token)
- What we keep (e.g. device data, backup retention)

**What you must do:**

1. **Host the `legal/` folder** so this page is publicly reachable. Options:
   - **GitHub Pages:** Create a repo, push the `legal` folder, enable Pages. Your URL will be like:  
     `https://YOUR_USERNAME.github.io/YOUR_REPO/delete-account.html`
   - **Vercel / Netlify:** Deploy the project (or only the `legal` folder). Use the URL they give you, e.g.  
     `https://your-project.vercel.app/legal/delete-account.html`
   - **Your own domain:** Upload `legal/delete-account.html` to your site, e.g.  
     `https://keeppushing.app/delete-account.html`

2. **Replace the placeholder email** in `legal/delete-account.html`: change `support@keeppushing.app` to your real support email.

3. **Paste the full URL** into the Play Console field **"Delete account URL"** (e.g. `https://yourusername.github.io/keeppushing-legal/delete-account.html`).

Until this URL is live and entered in Play Console, you cannot proceed past the Data safety form.

---

## 5. Data types to declare (when you add/declare data types)

When the form asks you to list **what** data you collect, declare at least:

| Data type (Play’s wording) | Collected? | Purpose | Optional? |
|----------------------------|------------|---------|-----------|
| **Personal info → Name** | Yes (if signed in) | Account/sync | Yes – only if user signs in with Google |
| **Personal info → Email address** | Yes (if signed in) | Account/sync | Yes |
| **App activity → Other user-generated content** (or similar) | Yes (if signed in) | Challenge progress / sync | Yes |
| **Device or other IDs** | Yes (if notifications on) | FCM token for push | Yes |

For each, choose:
- **Purpose:** e.g. "App functionality" (sync, reminders).
- **Optional:** Yes for all of the above (sign-in and notifications are optional).
- **Shared with third parties:** Only as needed (e.g. Google for sign-in, Firebase for FCM). No selling or sharing for ads.

---

## 6. "Is your app compliant with the Google Play Families Policy?"

**Answer: No** (unless you are specifically targeting children)

Keep Pushing is a general fitness app. Select **No**.

---

## Summary

- **Collect/share data?** Yes  
- **Encrypted in transit?** Yes  
- **Account creation method?** OAuth only  
- **Way to request data deletion?** Yes (by email; no in-app button required)  
- When listing data types, declare name, email, app/challenge data, and device/ID for FCM; mark as optional and for app functionality.

After you submit, if Play asks for more detail, you can point to your privacy policy URL and to this process (deletion via support email).
