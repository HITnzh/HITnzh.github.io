# Supabase Setup

This site can run without Supabase by falling back to local demo data. To enable the backend:

1. Create a Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql`.
3. In Supabase Auth, create one admin user for yourself.
4. Copy that user's Auth UID and run the final `profiles` insert shown at the bottom of `supabase/schema.sql`.
5. Copy `.env.example` to `.env.local` and fill in:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_SUPABASE_STORAGE_BUCKET=blog-assets
```

6. Restart the Vite dev server.

For the GitHub Pages deployment, add the same keys in GitHub:

Repository `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_STORAGE_BUCKET`

The anon key is designed to be public in browser apps. Row Level Security in `supabase/schema.sql` protects drafts, writes, and uploads.

Public visitors can read published posts and projects. Only the admin profile can create, update, publish, and upload.
