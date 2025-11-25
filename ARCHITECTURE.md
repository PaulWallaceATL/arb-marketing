# 🏗️ Application Architecture

## Overview

ARB Marketing is a modern Next.js 16 application built with TypeScript, featuring a comprehensive referral and competition management system for personal injury law firms.

## Tech Stack

### Core
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 19** - UI library
- **Supabase** - Backend-as-a-Service (Auth, Database, Storage)

### State & Forms
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Custom hooks** - `useForm`, `useAsync` for state management

### Styling
- **CSS** - Custom CSS with CSS variables
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Component-scoped styling
- **Framer Motion** - Animations
- **GSAP** - Advanced animations

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Testing Library** - Component testing

### Infrastructure
- **Vercel** - Hosting & deployment
- **Supabase** - Database, Auth, Storage
- **Analytics** - Google Analytics 4 (optional)

## Project Structure

```
arb-marketing-main/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── admin/              # Admin API endpoints
│   │   └── referral/           # Referral API endpoints
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   ├── faq/                     # FAQ page
│   ├── partners/                # Partners section
│   │   ├── dashboard/          # Partner dashboard
│   │   └── login/              # Partner login
│   ├── services/                # Services page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── admin/                   # Admin components
│   ├── auth/                    # Authentication components
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   ├── referral/                # Referral components
│   ├── ErrorBoundary.tsx        # Error boundary
│   ├── LoadingStates.tsx        # Loading components
│   └── SEO.tsx                  # SEO components
├── lib/                         # Shared utilities
│   ├── api/                     # API client & utilities
│   ├── analytics/               # Analytics integration
│   ├── hooks/                   # Custom React hooks
│   ├── supabase/                # Supabase client
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utility functions
├── supabase/                    # Database schemas
├── public/                      # Static assets
├── middleware.ts                # Next.js middleware
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies

```

## Key Features

### 1. Referral Management System
- **Anonymous Submissions** - Users can submit referrals without authentication
- **Authenticated Tracking** - Logged-in partners get credit for referrals
- **Quality Scoring** - Automatic quality assessment of leads
- **Status Pipeline** - `new` → `contacted` → `qualified` → `converted`

### 2. Competition & Gamification
- **Points System** - Earn points for submissions, qualified leads, conversions
- **Leaderboards** - Real-time rankings of partners
- **Prizes** - Configurable competitions with prizes
- **Badges** - Achievement system (planned)

### 3. Admin Dashboard
- **Analytics** - View submissions, conversions, revenue
- **Partner Management** - Approve/manage partners
- **Submission Management** - Update status, add notes
- **Reports** - Performance metrics and insights

### 4. Authentication & Authorization
- **Supabase Auth** - Email/password authentication
- **Role-Based Access** - Admin, Partner, Viewer roles
- **Row Level Security** - Database-level security policies
- **Protected Routes** - Middleware-based route protection

### 5. Performance & SEO
- **Server Components** - Optimized rendering
- **Image Optimization** - Next.js Image component
- **SEO Meta Tags** - Comprehensive metadata
- **JSON-LD Schema** - Structured data for search engines
- **Sitemap** - Auto-generated sitemap (planned)

## Data Flow

### Referral Submission Flow

```
1. User fills form (EnhancedReferralForm)
   ↓
2. Client-side validation (Zod schema)
   ↓
3. POST /api/referral/submit
   ↓
4. Server-side validation
   ↓
5. Calculate quality score
   ↓
6. Insert into database (referral_submissions)
   ↓
7. Trigger: Update partner stats
   ↓
8. Trigger: Award points (if authenticated)
   ↓
9. Return success response
   ↓
10. Show success message
```

### Authentication Flow

```
1. User visits /partners/login
   ↓
2. Enter credentials
   ↓
3. Supabase Auth sign in
   ↓
4. Session cookie set
   ↓
5. Middleware checks session
   ↓
6. Check user role (partner_users table)
   ↓
7. Redirect to dashboard
```

## Database Schema

### Core Tables

**channel_partners** - Partner organizations
- Stores company info, referral codes, stats
- Has commission rates, total referrals, conversions

**referral_submissions** - All form submissions
- Detailed lead information
- Tracking data (UTM, IP, user agent)
- Status tracking and quality score

**partner_users** - User roles & permissions
- Links auth users to partners
- Defines roles (admin, partner, viewer)

**competitions** - Competition management
- Competition details, prizes, dates
- Winner tracking

**partner_points** - Point tracking
- Records all point awards
- Links to submissions and competitions

**activity_log** - Audit trail
- Logs all important actions
- Used for debugging and compliance

### Key Views

**partner_performance** - Analytics view
- Aggregated partner statistics
- Conversion rates, revenue

**competition_leaderboard** - Real-time rankings
- Point totals, ranks, conversion rates

**unaccounted_referrals** - Unattributed submissions
- Helps admin assign referrals to partners

## API Routes

### Public Routes
```
POST /api/referral/submit          # Submit referral (public)
```

### Protected Routes (Require Auth)
```
GET  /api/referral/submissions     # Get user's submissions
GET  /api/admin/dashboard          # Get dashboard stats (admin)
PATCH /api/admin/submission/[id]   # Update submission (admin)
```

## Security

### Authentication
- Supabase Auth handles user authentication
- JWT tokens stored in HTTP-only cookies
- Session refresh automatic

### Authorization
- Role-based access control (RBAC)
- Middleware checks for protected routes
- Database Row Level Security (RLS) policies

### Rate Limiting
- In-memory rate limiting (100 requests / 15 minutes)
- Per IP address tracking
- For production: Use Redis or similar

### Input Validation
- Zod schemas for all user input
- Server-side validation required
- XSS prevention via sanitization

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy

## Performance Optimizations

### Code Splitting
- Automatic code splitting per route
- Dynamic imports for heavy components
- Lazy loading for images

### Caching
- Static assets cached at edge
- API responses cached when appropriate
- Database query optimization

### Loading States
- Skeleton loaders for better UX
- Suspense boundaries for async components
- Progressive loading

### Bundle Optimization
- Tree shaking unused code
- Minification in production
- Console removal in production

## Error Handling

### Client-Side
- Error boundaries catch React errors
- Toast notifications for user feedback
- Fallback UIs for error states

### Server-Side
- Try-catch blocks in API routes
- Standardized error responses
- Error logging to console (TODO: Sentry)

### Monitoring
- Console logs in development
- TODO: Integrate Sentry for production
- TODO: Add application insights

## Testing Strategy

### Unit Tests
- Test utility functions
- Test custom hooks
- Test validation schemas

### Component Tests
- Test form components
- Test UI components with user interactions
- Use Testing Library

### Integration Tests
- Test API routes
- Test database operations
- Test authentication flows

### E2E Tests
- TODO: Add Playwright tests
- Test critical user journeys
- Test form submissions

## Deployment

### Vercel Deployment
1. Connect GitHub repository
2. Configure environment variables
3. Auto-deploy on push to main
4. Preview deployments for PRs

### Environment Variables
See `ENV_TEMPLATE.md` for required variables

### Database Migrations
1. Update schema in `supabase/schema.sql`
2. Run in Supabase SQL Editor
3. Test in staging environment
4. Deploy to production

## Future Improvements

### Short Term
- [ ] Remove jQuery dependency
- [ ] Add comprehensive tests
- [ ] Implement email notifications
- [ ] Add CSV export functionality

### Medium Term
- [ ] Partner-specific dashboards
- [ ] Real-time leaderboard updates
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### Long Term
- [ ] Mobile app (React Native)
- [ ] Webhook integrations
- [ ] API for third-party integrations
- [ ] Machine learning for lead scoring

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint & Prettier rules
- Write meaningful commit messages
- Add comments for complex logic

### Pull Request Process
1. Create feature branch
2. Make changes
3. Add tests
4. Update documentation
5. Submit PR for review

### Code Review Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considered

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

## Support

For questions or issues:
- Check documentation first
- Review existing issues
- Create new issue with details
- Contact development team

---

**Last Updated:** November 2025
**Version:** 0.2.0

