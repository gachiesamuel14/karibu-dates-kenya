# Karibu Dates — Kenya location-based dating

Meet people nearby across Kenya. Match by county, distance, age, interests, religion, and vibe.

This is a **frontend product demo** designed for GitHub + Netlify. Auth, GPS, matching, chat, reports, and premium UI are implemented client-side with mock Kenyan profiles. A real backend (Node/Django + PostgreSQL + WebSockets + M-Pesa) can be added later without changing the look and flow.

## Live features in this demo

- Landing page localized for Kenya
- Register / login (saved in your browser)
- Profile setup: photos, bio, county, interests, religion, mode
- Discover + swipe with distance and county
- Filters: county, age, distance, tribe (optional), religion, mode
- Matches list
- Real-time-style chat UI
- Safety + report flow
- Premium / Boost mock (M-Pesa mentioned)
- Student / Professional / Church modes

## Deploy on Netlify

1. Open [Netlify](https://app.netlify.com) and **Add new site → Import an existing project**.
2. Connect GitHub and select `gachiesamuel14/karibu-dates-kenya`.
3. Build settings: leave build command empty, publish directory `.`
4. Deploy.

## Next backend steps

- Auth: Clerk, Supabase, or custom JWT
- Location: browser Geolocation + Haversine distance; store lat/lng
- Chat: Supabase Realtime, Firebase, or Socket.io
- Photos: Cloudinary or Netlify Blobs
- Payments: Safaricom Daraja (M-Pesa STK Push)
- Safety: report queue + block list in the database
