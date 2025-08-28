# Secure Deployment (Vercel) — LLM Chat Agent

This copy hides your API token on the server via a Vercel Serverless Function.

## Deploy (Step-by-step)

1) Create a new GitHub repo and push this folder.
2) Import the repo into Vercel.
3) In **Vercel → Project → Settings → Environment Variables**, add:
   - `AIPIPE_TOKEN` = your token (rotate a fresh one).
   - Optional: `CORS_ORIGIN` = your site URL (e.g. https://yourdomain.com)
4) Deploy. The frontend calls `/api/chat`, which proxies to `aipipe.org` using the server-side token.

**Never** commit `.env` or tokens to git.