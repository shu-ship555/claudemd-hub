# Claude Config Manager

A modern Next.js application for managing Claude Code configuration files. Store, version, and sync your configuration across multiple machines with Supabase and Vercel.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) - App Router
- **React**: React 19 with latest features
- **UI Components**: [@base-ui/react](https://base-ui.com) + Custom components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + CSS Variables
- **Icons**: [lucide-react](https://lucide.dev)
- **Database**: [Supabase](https://supabase.com) PostgreSQL
- **Authentication**: Supabase Auth (SSR-compatible)
- **Hosting**: [Vercel](https://vercel.com)
- **Utilities**: `clsx`, `tailwind-merge`

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Theme tokens & global styles
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   ├── signup/page.tsx         # Sign up page
│   │   └── verify/page.tsx         # Email verification
│   ├── api/
│   │   └── auth/sync/route.ts      # Auth sync endpoint
│   └── dashboard/
│       ├── page.tsx                # Design system editor
│       ├── files/page.tsx          # File management
│       ├── actions.ts              # Server actions
│       ├── upload-dialog.tsx       # Upload form
│       ├── config-list.tsx         # Config list
│       └── dashboard-client.tsx    # Dashboard wrapper
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── button.tsx              # Base button
│   │   ├── loading-button.tsx      # Loading button (NEW)
│   │   ├── form-field.tsx          # Form field (NEW)
│   │   ├── centered-card.tsx       # Centered card layout (NEW)
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (other UI components)
│   ├── auth/                       # Auth-specific components
│   ├── theme-preview/              # Design preview components
│   ├── dashboard-header.tsx        # Dashboard header
│   └── ... (other components)
├── lib/
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-form-state.ts       # Form state management (NEW)
│   │   ├── use-supabase-auth.ts    # Supabase auth (NEW)
│   │   ├── use-auth.ts
│   │   ├── use-design-config.ts
│   │   └── use-save-config-file.ts
│   ├── supabase.ts                 # Supabase client
│   ├── supabase-server.ts          # Supabase server
│   ├── supabase-auth.ts
│   ├── color-utils.ts              # Color conversion utilities (ENHANCED)
│   ├── constants.ts
│   ├── download.ts
│   ├── utils.ts
│   └── ... (other utilities)
├── .claude/
│   └── CLAUDE.md                   # Project guidelines
├── DESIGN.md                       # Design system specification
├── AGENTS.md                       # Agent configuration
├── middleware.ts                   # Request authentication
├── vercel.ts                       # Vercel config
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

## 🏗️ Architecture & Reusable Components

This project follows **DRY (Don't Repeat Yourself)** and **KISS (Keep It Simple, Stupid)** principles with shared components and hooks:

### Custom Hooks
- **`useFormState`** - Unified form state management (error, isLoading, setError, setIsLoading, clearError)
- **`useSupabaseAuth`** - Centralized Supabase authentication methods (signInWithPassword, signUp, signOut)
- **`useDesignConfig`** - Design system configuration state
- **`useSaveConfigFile`** - Config file saving logic

### Reusable Components
- **`FormField`** - Label + Input combination (replaces manual `space-y-2` patterns)
- **`LoadingButton`** - Button with loading state text (replaces repeated disabled + conditional rendering)
- **`CenteredCard`** - Centered card layout wrapper (replaces repeated `min-h-screen flex items-center justify-center` patterns)
- **`LoadingButton`** - Simplifies loading state UI

### Utilities
- **`color-utils.ts`** - Color conversion functions:
  - `hexToHsl()` - Hex to HSL conversion
  - `hslToHex()` - HSL to Hex conversion
  - `getContrastRatio()` - WCAG contrast ratio calculation
  - `getContrastLevel()` - Accessibility level determination

### Styling
- CSS variables defined in `app/globals.css` with Tailwind CSS v4 `@theme` block
- Consistent spacing scale (8px base unit)
- Design tokens for colors, typography, and layout

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
