# Deploying to Vercel

This Next.js project is ready for deployment to Vercel.

## Quick Deploy

### Option 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `PaulWallaceATL/arb-marketing`
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project directory
cd arb-marketing-nextjs
vercel

# Follow prompts to link to your account
```

## Build Configuration

The project is already configured for optimal Vercel deployment:

- ✅ `next.config.ts` set to standalone output
- ✅ All pages are static (pre-rendered at build time)
- ✅ Build tested successfully
- ✅ SEO metadata included on all pages

## Environment Variables

Currently, no environment variables are required. If you add email integration later:

1. Go to Vercel Project Settings → Environment Variables
2. Add your API keys (e.g., `SENDGRID_API_KEY`, `FORMSPREE_ENDPOINT`)
3. Redeploy

## Post-Deployment

After deployment:

1. Vercel will provide your live URL (e.g., `arb-marketing.vercel.app`)
2. Add custom domain in Project Settings → Domains
3. Test mobile menu functionality
4. Verify all pages load correctly
5. Test contact form (currently logs to console - needs integration)

## Custom Domain Setup

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Enter your domain (e.g., `arbmarketing.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (usually 24-48 hours)

## Performance Notes

- All pages are static HTML (ultra-fast loading)
- Assets served from Vercel's global CDN
- Mobile menu z-index fix included
- Images and fonts optimized

## Troubleshooting

**Build fails on Vercel:**
- Check build logs in Vercel dashboard
- Ensure all dependencies in package.json
- Try `npm run build` locally first

**Styling issues:**
- Verify all CSS files copied to `public/assets/css`
- Check mobile-menu-fix.css is loaded last

**Mobile menu not working:**
- Check browser console for JavaScript errors
- Verify menu.js loaded correctly
- Ensure jQuery loaded before other scripts

## Next Steps

1. ✅ Deploy to Vercel
2. 🔄 Configure contact form with email service (Formspree, SendGrid, or Resend)
3. 🔄 Add Google Analytics (optional)
4. 🔄 Set up custom domain
5. 🔄 Add sitemap.xml generation (optional)

---

**Need help?** Consult Next.js docs: https://nextjs.org/docs
**Vercel support:** https://vercel.com/docs

