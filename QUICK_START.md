# 🚀 Quick Start Guide

Get your ARB Marketing application up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier works)
- Git

## 1. Install Dependencies

```bash
npm install
```

This will install all necessary packages including the new improvements.

## 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from template
# See ENV_TEMPLATE.md for full details

# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional but recommended
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

### How to Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Go to Project Settings → API
4. Copy:
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Set Up Database

1. Go to your Supabase Dashboard
2. Click "SQL Editor"
3. Copy contents from `supabase/schema.sql`
4. Paste and run

Wait for success message. Your database is ready!

## 4. Create Admin User (Optional)

In Supabase Dashboard → Authentication → Users:

1. Click "Add user"
2. Enter your email and password
3. Copy the User ID

Then in SQL Editor:

```sql
INSERT INTO public.partner_users (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. Verify Setup

### Test Public Pages
- ✅ Homepage: http://localhost:3000
- ✅ About: http://localhost:3000/about
- ✅ Services: http://localhost:3000/services
- ✅ Contact: http://localhost:3000/contact
- ✅ Partners: http://localhost:3000/partners

### Test Referral Form
1. Go to http://localhost:3000/partners
2. Fill out form (try both with and without login)
3. Submit and check Supabase for new row

### Test Dashboard (If Admin Created)
1. Go to http://localhost:3000/partners/login
2. Log in with admin credentials
3. You should see dashboard at http://localhost:3000/partners/dashboard

## Common Issues

### Issue: "Module not found"
**Solution:** Run `npm install` again

### Issue: "Supabase connection failed"
**Solution:** Check your environment variables

### Issue: "Can't access dashboard"
**Solution:** Make sure you created an admin user

### Issue: "Port 3000 is in use"
**Solution:** Run on different port:
```bash
npm run dev -- -p 3001
```

## Next Steps

1. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the codebase
2. ✅ Read [IMPROVEMENTS_IMPLEMENTED.md](./IMPROVEMENTS_IMPLEMENTED.md) - See what's new
3. ✅ Customize branding and content
4. ✅ Add your social media links in `lib/config/app.config.ts`
5. ✅ Test all features
6. ✅ Deploy to Vercel (see below)

## Deploy to Vercel

### Option 1: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Add environment variables
5. Deploy!

### Option 2: Via CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts.

### Important: Add Environment Variables in Vercel

In Vercel Dashboard → Project → Settings → Environment Variables:

Add all variables from your `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (use your production URL)
- Any other variables you're using

### Update Supabase Redirect URLs

In Supabase → Authentication → URL Configuration:

Add your production URL:
- `https://your-site.vercel.app/auth/callback`

## Development Workflow

### Make Changes
```bash
# Edit files
# Save automatically formats with Prettier
```

### Check Types
```bash
npm run type-check
```

### Format Code
```bash
npm run format
```

### Run Linter
```bash
npm run lint
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
npm start
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Check for linting errors
npm run type-check       # Check TypeScript types
npm run format           # Format all files

# Testing
npm test                 # Run tests in watch mode
npm run test:ci          # Run tests once (for CI/CD)
```

## File Structure Quick Reference

```
arb-marketing-main/
├── app/                 # Pages & API routes
├── components/          # React components
├── lib/                 # Utilities & helpers
│   ├── api/            # API client
│   ├── analytics/      # Analytics
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── supabase/           # Database schemas
├── middleware.ts       # Auth & security
└── next.config.ts      # Next.js config
```

## Getting Help

1. **Documentation:** Check all `.md` files
2. **Types:** Look in `lib/types/index.ts`
3. **Examples:** Look at existing components
4. **Issues:** Check console and network tab
5. **Support:** Create issue or ask team

## Pro Tips

- 💡 Use TypeScript strictly - no `any` types
- 💡 Follow existing patterns in new code
- 💡 Test your changes before committing
- 💡 Keep environment variables secret
- 💡 Use the custom hooks (`useForm`, etc.)
- 💡 Check the config file for settings
- 💡 Add analytics events for important actions

## What's Next?

Now that you're set up, check out:

- 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - Deep dive into the codebase
- ✨ [IMPROVEMENTS_IMPLEMENTED.md](./IMPROVEMENTS_IMPLEMENTED.md) - See all new features
- 🎯 Build your custom features!

---

**Need help?** Check the documentation or reach out to the team.

**Happy coding!** 🎉

