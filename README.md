# bus-tracking-system-starter
Cross-platform Bus Tracking System (Expo + Supabase) starter scaffold.

## Get buses on the home screen

1. Create a Supabase project and run `db/schema.sql` in its SQL Editor. This creates the `buses` table, grants authenticated users read access, and inserts two sample buses.
2. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `app.json` under `expo.extra` (replace the empty values).
3. In Supabase **Authentication → URL Configuration**, add the callback URL for your app to the allowed redirect URLs: `bus-tracking-system://auth/callback` for a native build, `exp://**/--/auth/callback` for Expo Go, or `http://localhost:19006/auth/callback` for the default local web server. If your web server uses a different origin, add that origin with `/auth/callback` instead.
4. Start the app with `npm install` and `npm start`, then request a sign-in link and open it on the same device. The home screen lists the buses and their most recently reported coordinates; pull down or tap **Refresh buses** to reload.

If no buses appear, check that the SQL ran in the same Supabase project configured in the app and that you are signed in. The screen shows a retry action and the Supabase error when a request fails. This starter displays coordinates as a list; it does not yet include a map or live GPS updates.
