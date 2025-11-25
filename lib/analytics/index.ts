// =====================================================
// ANALYTICS INTEGRATION
// =====================================================

/**
 * Analytics Event Types
 */
export type AnalyticsEvent = 
  | { name: 'page_view'; properties: { path: string; title: string } }
  | { name: 'referral_submitted'; properties: { referral_code?: string; is_authenticated: boolean } }
  | { name: 'contact_form_submitted'; properties: { form_type: string } }
  | { name: 'button_clicked'; properties: { button_name: string; location: string } }
  | { name: 'partnership_applied'; properties: { company_name: string } }
  | { name: 'user_signup'; properties: { method: string } }
  | { name: 'user_login'; properties: { method: string } }
  | { name: 'error_occurred'; properties: { error_message: string; error_location: string } };

/**
 * Check if analytics is enabled
 */
function isAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
}

/**
 * Google Analytics 4
 */
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Initialize Google Analytics
 */
export function initAnalytics() {
  if (!isAnalyticsEnabled()) return;

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('Google Analytics measurement ID not found');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  
  window.gtag('js', new Date() as any);
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll send page views manually
  });
}

/**
 * Track page view
 */
export function trackPageView(path: string, title: string) {
  if (!isAnalyticsEnabled()) return;

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }

  // Also track as custom event
  trackEvent({
    name: 'page_view',
    properties: { path, title },
  });
}

/**
 * Track custom event
 */
export function trackEvent(event: AnalyticsEvent) {
  if (!isAnalyticsEnabled()) return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', event.name, event.properties);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }

  // TODO: Add other analytics providers here
  // - Facebook Pixel
  // - LinkedIn Insight Tag
  // - Custom analytics API
}

/**
 * Track conversion event
 */
export function trackConversion(value: number, currency: string = 'USD') {
  if (!isAnalyticsEnabled()) return;

  if (window.gtag) {
    window.gtag('event', 'conversion', {
      value,
      currency,
    });
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (!isAnalyticsEnabled()) return;

  if (window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
}

/**
 * Track user ID (for logged-in users)
 */
export function setUserId(userId: string) {
  if (!isAnalyticsEnabled()) return;

  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      user_id: userId,
    });
  }
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent({
    name: 'contact_form_submitted',
    properties: {
      form_type: formName,
    },
  });

  if (window.gtag) {
    window.gtag('event', 'form_submission', {
      form_name: formName,
      success,
    });
  }
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, location: string) {
  trackEvent({
    name: 'button_clicked',
    properties: {
      button_name: buttonName,
      location,
    },
  });
}

/**
 * Track error
 */
export function trackError(errorMessage: string, errorLocation: string) {
  trackEvent({
    name: 'error_occurred',
    properties: {
      error_message: errorMessage,
      error_location: errorLocation,
    },
  });
}

/**
 * React Hook for tracking page views
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, document.title);
    }
  }, [pathname]);
}

/**
 * Higher-order component to add analytics to components
 */
import React from 'react';

export function withAnalytics<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  eventName: string
) {
  const AnalyticsWrapper: React.FC<P> = (props: P) => {
    useEffect(() => {
      trackEvent({
        name: 'page_view',
        properties: {
          path: window.location.pathname,
          title: document.title,
        },
      });
    }, []);

    return React.createElement(Component, props);
  };
  
  return AnalyticsWrapper;
}

/**
 * Debug mode - log all analytics events to console
 */
export function enableAnalyticsDebug() {
  if (typeof window !== 'undefined') {
    (window as any).__ANALYTICS_DEBUG__ = true;
  }
}

export function disableAnalyticsDebug() {
  if (typeof window !== 'undefined') {
    (window as any).__ANALYTICS_DEBUG__ = false;
  }
}

