# 📦 jQuery Removal Guide

## Overview

Your application currently uses jQuery for some legacy animations and menu functionality. This guide will help you modernize these scripts to use vanilla JavaScript and React.

## Current jQuery Usage

### Location of jQuery Code
1. `/public/assets/js/` - Legacy jQuery scripts
2. `app/layout.tsx` - jQuery scripts loaded
3. Custom cursor and animations

## Step-by-Step Removal Plan

### Phase 1: Identify jQuery Dependencies

Current jQuery scripts loaded in `layout.tsx`:
```tsx
<Script src="/assets/js/jquery-3.6.0.min.js" />
<Script src="/assets/js/bootstrap.bundle.min.js" />
<Script src="/assets/js/vendors/menu.js" />
// ... and more
```

### Phase 2: Replace Menu System

**Current (jQuery):**
The mobile menu uses jQuery for toggling.

**New (React):**
Already implemented in `components/layout/Header.tsx` using React state!

✅ **Already Done!** Your Header component uses React state management.

### Phase 3: Replace Animations

**Option 1: Use Framer Motion (Already installed)**

```tsx
import { motion } from 'framer-motion';

// Fade in animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Slide in animation
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**Option 2: Use GSAP (Already installed)**

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function AnimatedComponent() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });
  }, []);

  return <div ref={ref}>Content</div>;
}
```

**Option 3: CSS Animations**

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animated {
  animation: fadeIn 0.5s ease-in;
}
```

### Phase 4: Replace jQuery Utilities

#### DOM Manipulation

**jQuery:**
```javascript
$('.element').addClass('active');
$('.element').removeClass('active');
$('.element').toggle();
```

**Vanilla JS:**
```javascript
element.classList.add('active');
element.classList.remove('active');
element.classList.toggle('active');
```

**React:**
```tsx
const [isActive, setIsActive] = useState(false);

<div className={isActive ? 'active' : ''}>
  Content
</div>
```

#### Event Listeners

**jQuery:**
```javascript
$('.button').on('click', function() {
  // handle click
});
```

**Vanilla JS:**
```javascript
element.addEventListener('click', () => {
  // handle click
});
```

**React:**
```tsx
<button onClick={() => handleClick()}>
  Click me
</button>
```

#### AJAX Requests

**jQuery:**
```javascript
$.ajax({
  url: '/api/data',
  method: 'GET',
  success: (data) => console.log(data),
});
```

**Modern Fetch:**
```javascript
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Or use our API client:**
```typescript
import { apiClient } from '@/lib/api';

const response = await apiClient.get('/api/data');
```

### Phase 5: Replace Bootstrap jQuery Components

**Current:** Bootstrap Bundle includes jQuery-dependent components

**Alternative 1:** Use CSS-only Bootstrap classes

**Alternative 2:** Replace with React components

**Alternative 3:** Use Headless UI (Recommended)

```bash
npm install @headlessui/react
```

```tsx
import { Dialog, Transition } from '@headlessui/react';

// Modal example
<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
  <Dialog.Panel>
    {/* Modal content */}
  </Dialog.Panel>
</Dialog>
```

## Implementation Steps

### Step 1: Update layout.tsx

**Before:**
```tsx
<Script src="/assets/js/jquery-3.6.0.min.js" strategy="beforeInteractive" />
<Script src="/assets/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
```

**After:**
```tsx
// Remove jQuery and jQuery-dependent scripts
// Keep only necessary vanilla JS scripts
<Script src="/assets/js/aos.js" strategy="lazyOnload" />
<Script src="/assets/js/swiper-bundle.min.js" strategy="lazyOnload" />
```

### Step 2: Create Modern Components

Create `/components/animations/FadeIn.tsx`:
```tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 0.5 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
```

### Step 3: Replace WOW.js with Intersection Observer

**Before (jQuery/WOW.js):**
```html
<div class="wow fadeInUp" data-wow-delay="0.2s">
  Content
</div>
```

**After (React + Intersection Observer):**

Create `/lib/hooks/useInView.ts`:
```tsx
import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
```

Usage:
```tsx
import { useInView } from '@/lib/hooks/useInView';

function AnimatedSection() {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={isInView ? 'animate-in' : 'animate-out'}
    >
      Content
    </div>
  );
}
```

### Step 4: Test Thoroughly

1. Test on different browsers
2. Test mobile menu functionality
3. Test all animations
4. Test form submissions
5. Check console for errors

## Modernization Checklist

### ✅ Already Modern
- [x] React components
- [x] React state management
- [x] Next.js routing
- [x] Framer Motion installed
- [x] GSAP installed
- [x] Modern fetch API

### 🔄 To Modernize
- [ ] Remove jQuery script tags
- [ ] Replace WOW.js with Intersection Observer
- [ ] Replace jQuery animations with Framer Motion
- [ ] Replace Bootstrap JS with Headless UI or vanilla JS
- [ ] Test all functionality

### 📝 Optional Improvements
- [ ] Remove legacy CSS animations
- [ ] Consolidate animation logic
- [ ] Create reusable animation components
- [ ] Add page transitions

## Bundle Size Impact

**Before jQuery Removal:**
- jQuery: ~85KB (min + gzip)
- Bootstrap JS: ~50KB (min + gzip)
- Other jQuery plugins: ~30KB
- **Total: ~165KB**

**After jQuery Removal:**
- Framer Motion: ~40KB (min + gzip)
- Custom React components: ~10KB
- **Total: ~50KB**

**Savings: ~115KB** (~70% reduction!)

## Migration Timeline

### Week 1: Preparation
- [x] Audit jQuery usage
- [x] Create modern alternatives
- [x] Set up testing

### Week 2: Implementation
- [ ] Remove jQuery scripts
- [ ] Replace animations
- [ ] Update components
- [ ] Fix any issues

### Week 3: Testing
- [ ] Browser testing
- [ ] Mobile testing
- [ ] Performance testing
- [ ] Accessibility testing

### Week 4: Deploy
- [ ] Deploy to staging
- [ ] Final testing
- [ ] Deploy to production
- [ ] Monitor for issues

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Mobile menu works
- [ ] All animations work
- [ ] Forms submit successfully
- [ ] No console errors
- [ ] Performance improved
- [ ] Accessibility maintained

## Rollback Plan

If issues occur:

1. Restore jQuery scripts in `layout.tsx`
2. Revert changes to components
3. Clear Next.js cache
4. Rebuild application

## Resources

- [You Might Not Need jQuery](http://youmightnotneedjquery.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Headless UI](https://headlessui.com/)

## Support

If you encounter issues during migration:

1. Check browser console for errors
2. Review this guide
3. Test in isolation
4. Seek help with specific error messages

---

**Status:** Planning Phase  
**Priority:** Medium  
**Estimated Time:** 2-3 weeks  
**Benefits:** Smaller bundle, better performance, modern codebase

