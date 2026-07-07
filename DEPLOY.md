# Going live - step by step

## 1. Run the database migrations

Your Hostinger plan (Business Web Hosting) is shared hosting and cannot run this
Next.js app directly - it needs a Node.js server. We'll deploy the app to Vercel
instead and keep your domain + email on Hostinger.

Open your Supabase project (lpxpqmdefijllubsxxib) → SQL Editor, and run these
three files **in this exact order**, pasting each one's contents and clicking Run:

1. `supabase-schema.sql` - base tables (clinics, doctors, patients, queue, etc.)
2. `supabase-schema-auth.sql` - login/roles table, clinic invite codes, a second demo clinic
3. `supabase-seed-admin.sql` - creates your super-admin login

After running all three, you should be able to log in at `/login` with:
- ID: `LalsahabTheGreat`
- Password: the one you gave me (not stored anywhere in the repo, only its hash)

## 2. Test locally first

```
npm install
npm run dev
```

Then in the browser:
- `/` - homepage, patient register/queue/book
- `/register` - patient self-registration (creates a real Supabase row + logs you in)
- `/doctor-register` - doctor self-registration, needs a clinic invite code. Two are
  seeded by the migration: `MEDIKUE-MAIN-DOC` and `MEDIKUE-ROHINI-DOC`
- `/login` - unified login for all roles, redirects by role
- `/admin` - log in as the super-admin, create clinics, generate invite codes,
  create doctor/staff accounts directly
- `/dashboard` - doctor/staff area (this is where you'll eventually wire up real
  queue/prescription/payment data - it's currently still the original mock UI)

## 3. Push your changes and deploy to Vercel

Your repo already has a GitHub remote (`lalsahab01/medikue-app`). Review the diff,
commit, and push it yourself (I won't push on your behalf):

```
git add -A
git commit -m "Add role-based auth, homepage rework, dummy payments"
git push
```

Then:
1. Go to vercel.com → sign in with GitHub → **Add New Project** → import `medikue-app`.
2. In **Environment Variables**, paste in everything from your `.env.local` file
   (Supabase URL/keys, `SESSION_SECRET`, `PAYMENTS_MODE`). Leave the Firebase ones
   blank for now.
3. Deploy. Vercel gives you a `*.vercel.app` URL immediately - test the whole flow
   there before touching DNS.

## 4. Point medikue.in at Vercel (keep Hostinger for email)

In Vercel: Project → Settings → Domains → add `medikue.in` and `www.medikue.in`.
Vercel will show you the exact DNS records it needs (usually an `A` record for the
root domain and a `CNAME` for `www`).

In Hostinger: hPanel → Domains → medikue.in → DNS / Nameservers → add those records.
**Do not touch the existing `MX` records** - those are what keep your Starter
Business Email working. Only the `A`/`CNAME` for the web traffic changes.

DNS changes can take up to a few hours to propagate.

## 5. Firebase phone-OTP (phase 2, optional for launch)

The app works right now without OTP - patients and doctors register with just
phone + password. To add SMS verification later:

1. console.firebase.google.com → Create project → Add a Web app.
2. Enable **Authentication → Sign-in method → Phone**.
3. Copy the web app config (`apiKey`, `authDomain`, `projectId`, `appId`) into the
   `NEXT_PUBLIC_FIREBASE_*` vars.
4. Project Settings → Service Accounts → Generate new private key → copy
   `project_id`, `client_email`, `private_key` into the `FIREBASE_ADMIN_*` vars.
5. Set `OTP_ENABLED=true` and ask me to wire the verification step into the two
   registration routes.

## 6. Payments (phase 2)

`PAYMENTS_MODE=dummy` means every payment is recorded as `completed` immediately -
no real money moves. When you've picked a gateway (Razorpay is the standard
choice for Indian clinics), get the API keys and ask me to wire it into
`app/api/payments/route.ts` and set `PAYMENTS_MODE=live`.

## Known gap: the operational dashboards are still mock data

`/dashboard` (queue, patients, prescriptions, payments, reports) was a UI
prototype before this change and still is - it has no real Supabase queries, just
hardcoded arrays. The auth/roles/registration system built in this pass is real
and live, but actually running a clinic's day-to-day queue on this will need that
dashboard wired to the database as a separate follow-up.
