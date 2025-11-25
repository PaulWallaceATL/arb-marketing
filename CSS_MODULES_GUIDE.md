# 🎨 CSS Modules Migration Guide

## Overview

Your application currently uses global CSS. This guide shows you how to gradually migrate to CSS Modules for better component scoping and maintainability.

## Why CSS Modules?

### Benefits
- ✅ **Scoped Styles** - No global conflicts
- ✅ **Type Safety** - TypeScript integration
- ✅ **Better Performance** - Only load needed CSS
- ✅ **Easier Maintenance** - Co-locate styles with components
- ✅ **Tree Shaking** - Remove unused styles

### When to Use
- New components
- Component-specific styles
- Reusable UI components

### When NOT to Use
- Global styles (fonts, resets)
- Third-party library styles
- Utility classes

## CSS Modules Setup

### Already Configured!
Next.js supports CSS Modules out of the box. No setup needed!

## Migration Strategy

### Phase 1: New Components (Recommended)

For all new components, use CSS Modules.

**Example: Button Component**

Create `components/ui/Button.module.css`:
```css
.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
}

.buttonPrimary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.buttonPrimary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.buttonSecondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.buttonLarge {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.buttonSmall {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.buttonDisabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

Create `components/ui/Button.tsx`:
```tsx
import styles from './Button.module.css';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        size === 'large' && styles.buttonLarge,
        size === 'small' && styles.buttonSmall,
        disabled && styles.buttonDisabled,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

Usage:
```tsx
<Button variant="primary" size="large">
  Schedule Consultation
</Button>
```

### Phase 2: Existing Components (Gradual)

Migrate existing components one at a time.

**Example: Card Component**

Create `components/ui/Card.module.css`:
```css
.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.cardHeader {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cardIcon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.cardTitle {
  font-family: var(--font-roxborough-cf);
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.cardContent {
  color: #6b7280;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    padding: 1.5rem;
  }

  .cardTitle {
    font-size: 1.25rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .card {
    background: #1f2937;
  }

  .cardTitle {
    color: #f9fafb;
  }

  .cardContent {
    color: #9ca3af;
  }
}
```

Create `components/ui/Card.tsx`:
```tsx
import styles from './Card.module.css';
import { cn } from '@/lib/utils';

interface CardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ icon, title, children, className }: CardProps) {
  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.cardHeader}>
        {icon && <div className={styles.cardIcon}>{icon}</div>}
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
}
```

### Phase 3: Global Styles

Keep global styles in `app/globals.css` for:
- CSS Reset/Normalize
- CSS Variables
- Font imports
- Utility classes

**Example `app/globals.css`:**
```css
/* CSS Variables */
:root {
  --font-roxborough-cf: 'Roxborough CF', serif;
  --font-libre-baskerville: 'Libre Baskerville', serif;
  
  /* Colors */
  --color-primary: #9333ea;
  --color-secondary: #764ba2;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Borders */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* Dark mode variables */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #f9fafb;
    --color-text-light: #9ca3af;
    --color-background: #111827;
    --color-surface: #1f2937;
  }
}

/* Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Base styles */
body {
  font-family: var(--font-libre-baskerville);
  color: var(--color-text);
  background: var(--color-background);
}

/* Utility classes */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## TypeScript Integration

### Enable Type Safety for CSS Modules

Create `global.d.ts`:
```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

Now you get autocomplete and type checking!

```tsx
import styles from './Component.module.css';

// TypeScript will suggest available classes
<div className={styles.card} />
```

## Naming Conventions

### BEM-style (Recommended)
```css
/* Block */
.card { }

/* Element */
.cardHeader { }
.cardTitle { }
.cardContent { }

/* Modifier */
.cardLarge { }
.cardHighlighted { }
```

### Camel Case (Alternative)
```css
.primaryButton { }
.secondaryButton { }
.buttonDisabled { }
```

## Best Practices

### 1. Co-locate Styles with Components
```
components/
  ui/
    Button/
      Button.tsx
      Button.module.css
      Button.test.tsx
      index.ts
```

### 2. Use CSS Variables for Theming
```css
.button {
  background: var(--color-primary);
  color: var(--color-text);
  border-radius: var(--border-radius-md);
}
```

### 3. Compose Styles
```css
/* Base button */
.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}

/* Primary button extends base */
.buttonPrimary {
  composes: button;
  background: var(--color-primary);
  color: white;
}
```

### 4. Use the `cn` Utility
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  styles.card,
  isActive && styles.cardActive,
  className
)} />
```

### 5. Responsive Design
```css
.card {
  padding: 2rem;
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
  }
}
```

## Common Patterns

### Conditional Classes
```tsx
<div className={cn(
  styles.button,
  variant === 'primary' && styles.buttonPrimary,
  size === 'large' && styles.buttonLarge,
  disabled && styles.buttonDisabled
)} />
```

### Dynamic Classes
```tsx
const sizeClass = `button${capitalize(size)}`;
<div className={styles[sizeClass]} />
```

### Combining with Global Classes
```tsx
<div className={cn(styles.card, 'container')} />
```

## Migration Checklist

### For Each Component:
- [ ] Create `.module.css` file
- [ ] Move component-specific styles
- [ ] Update component imports
- [ ] Test component rendering
- [ ] Check responsive behavior
- [ ] Verify dark mode (if applicable)
- [ ] Update tests if needed

### Global Checklist:
- [ ] Keep global styles in `globals.css`
- [ ] Define CSS variables
- [ ] Remove duplicate styles
- [ ] Update documentation
- [ ] Test across browsers

## Example Components

### Complete Example: PricingCard

`components/pricing/PricingCard.module.css`:
```css
.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}

.title {
  font-family: var(--font-roxborough-cf);
  font-size: 1.5rem;
  color: var(--color-text);
}

.price {
  text-align: center;
  margin-bottom: 2rem;
}

.priceAmount {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.pricePeriod {
  font-size: 1rem;
  color: var(--color-text-light);
}

.features {
  flex: 1;
  list-style: none;
  padding: 0;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.featureIcon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.button {
  margin-top: auto;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.button:hover {
  transform: translateY(-2px);
}
```

`components/pricing/PricingCard.tsx`:
```tsx
import styles from './PricingCard.module.css';

interface Feature {
  text: string;
  icon: string;
}

interface PricingCardProps {
  title: string;
  price: number | null;
  period: string;
  features: Feature[];
  buttonText: string;
  onButtonClick: () => void;
}

export function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  onButtonClick,
}: PricingCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.price}>
        {price !== null ? (
          <>
            <span className={styles.priceAmount}>${price.toLocaleString()}</span>
            <span className={styles.pricePeriod}>/{period}</span>
          </>
        ) : (
          <span className={styles.priceAmount}>By Consultation</span>
        )}
      </div>

      <ul className={styles.features}>
        {features.map((feature, index) => (
          <li key={index} className={styles.feature}>
            <img src={feature.icon} alt="" className={styles.featureIcon} />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      <button className={styles.button} onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
}
```

## Resources

- [Next.js CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)
- [CSS Modules GitHub](https://github.com/css-modules/css-modules)

---

**Status:** Optional Improvement  
**Priority:** Low-Medium  
**Estimated Time:** Ongoing (migrate as you go)  
**Benefits:** Better scoping, maintainability, type safety

