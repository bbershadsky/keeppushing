# Legal pages for Keep Pushing

These pages must be **hosted at a public URL** for the Play Store and for users.

## Files

| File | Purpose | Play Console use |
|------|---------|------------------|
| **privacy-policy.html** | Privacy policy | **Privacy policy URL** (required) |
| **delete-account.html** | How to request account/data deletion | **Delete account URL** (required) |
| **terms-of-service.html** | Terms of service | Optional (link from app or site) |

## Before you publish

1. Replace **support@keeppushing.app** with your real support email in:
   - privacy-policy.html  
   - terms-of-service.html  
   - delete-account.html  

2. Host this folder so each file has a direct URL, for example:
   - `https://your-site.com/privacy-policy.html`
   - `https://your-site.com/delete-account.html`

## Quick hosting options

### GitHub Pages

1. Create a new repo (e.g. `keeppushing-legal`).
2. Upload these HTML files to the repo (e.g. in the root or in a `legal` folder).
3. Settings → Pages → Source: Deploy from branch → main (or master) → root (or /legal if you put them in a folder).
4. Your URLs:
   - Root: `https://USERNAME.github.io/keeppushing-legal/delete-account.html`
   - If in `legal/`: `https://USERNAME.github.io/keeppushing-legal/legal/delete-account.html`

### Vercel

1. In your Keep Pushing project (or a new one), ensure the `legal` folder is in the project root.
2. Deploy to Vercel. The `legal` folder will be served.
3. URLs: `https://your-project.vercel.app/legal/delete-account.html` and `.../legal/privacy-policy.html`.

Use the **exact** URLs in Play Console for:
- **Privacy policy URL** → your hosted `privacy-policy.html`
- **Delete account URL** → your hosted `delete-account.html`
