# Admin setup (development only until security and storage are complete)
Set ADMIN_PASSWORD to a strong unique fixed password and ADMIN_SESSION_SECRET to a random value of at least 32 characters in .env.local.
Generate the session secret with openssl rand -hex 32.
Restart Next.js and visit /manage. No public links expose the dashboard.
Sessions expire after 30 days, and changing either secret invalidates old sessions.
The login currently has a failed-attempt delay, not a distributed rate limiter. Do not expose it to production before persistent throttling is added.
Content modules are placeholders until persistent storage and authorized mutation endpoints are connected.
