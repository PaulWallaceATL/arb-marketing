# ARB Marketing - Next.js Website

A modern, high-performance website for ARB Marketing built with Next.js 14, TypeScript, and React.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ React Hook Form for form handling
- ✅ Full design parity with original Symfony site
- ✅ Mobile-responsive with working mobile menu
- ✅ SEO optimized with metadata
- ✅ Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
arb-marketing-nextjs/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── services/          # Services page
│   ├── contact/           # Contact page with form
│   └── faq/               # FAQ page
├── components/
│   └── layout/            # Header, Footer components
├── public/
│   └── assets/            # All static assets (CSS, images, fonts, js)
└── lib/                   # Utility functions
```

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy automatically

Or use Vercel CLI:

```bash
npx vercel
```

## Key Technologies

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Forms**: React Hook Form
- **Styling**: Custom CSS (from original site)
- **Fonts**: Google Fonts + Local fonts (Roxborough CF)

## Mobile Menu

The mobile menu includes the z-index fix from the original site to ensure it renders above all page content on mobile devices.

## Contact Form

The contact form uses React Hook Form for validation. To connect to an email service:

1. Update the `onSubmit` function in `app/contact/page.tsx`
2. Integrate with services like:
   - Formspree
   - SendGrid
   - Resend
   - Custom API endpoint

## License

© 2025 ARB Marketing. All rights reserved.
