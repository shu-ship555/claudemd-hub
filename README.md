# Claude Config Manager

A modern Next.js application for managing Claude Code configuration files. Store, version, and sync your configuration across multiple machines with Supabase and Vercel.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) - App Router
- **UI**: [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS v4
- **Database**: [Supabase](https://supabase.com) PostgreSQL
- **Authentication**: Supabase Auth
- **Hosting**: [Vercel](https://vercel.com)
- **Theme**: Dark mode by default with [next-themes](https://github.com/pacocoursey/next-themes)

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout with ThemeProvider
│   ├── globals.css           # Theme tokens & global styles
│   ├── auth/
│   │   ├── login/            # Login page
│   │   ├── signup/           # Sign up page
│   │   └── verify/           # Email verification (TODO)
│   └── dashboard/            # Protected dashboard
├── components/ui/            # shadcn/ui components
├── src/
│   ├── lib/
│   │   ├── supabase.ts       # Client-side Supabase
│   │   └── supabase-server.ts # Server-side Supabase
│   └── providers.tsx         # React Providers (ThemeProvider)
├── middleware.ts             # Request authentication checks
├── vercel.ts                 # Vercel deployment config
└── package.json
```

## ⚡ Quick Start

### 1. Environment Variables

```bash
cp .env.local.example .env.local
```

Get your Supabase credentials from [app.supabase.com](https://app.supabase.com):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Database Schema (TODO)

Set up in Supabase SQL Editor:

```sql
CREATE TABLE config_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE config_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own configs"
  ON config_files FOR ALL
  USING (auth.uid() = user_id);
```

## 🔄 Available Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/auth/login` | Login |
| `/auth/signup` | Sign up |
| `/dashboard` | Protected dashboard (TODO: add auth guard) |

## 📝 Next Steps

1. **Configure Supabase** - Create `config_files` table with RLS
2. **Protect routes** - Add auth checks to `/dashboard`
3. **Email verification** - Implement `/auth/verify` flow
4. **Config CRUD** - Build upload/edit/delete UI
5. **Version history** - Track config changes
6. **Sync feature** - Download/upload configs
7. **Deploy** - Link repo to Vercel and deploy

## ⚠️ Notes

- `@supabase/auth-helpers-nextjs` is deprecated. Plan migration to latest Supabase auth.
- `middleware.ts` will rename to `proxy.ts` in Next.js 16 final release.
- Dark mode enabled by default; toggle with next-themes.

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in project settings
4. Deploy with `npm run build`

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel Docs](https://vercel.com/docs)
