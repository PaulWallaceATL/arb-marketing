// =====================================================
// SEO COMPONENTS
// =====================================================

import Head from 'next/head';
import { getBaseUrl } from '@/lib/utils';

/**
 * JSON-LD Schema Types
 */
interface Organization {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    email?: string;
  };
}

interface WebSite {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

interface Service {
  '@type': 'Service';
  serviceType: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  areaServed?: string;
  description?: string;
}

interface BreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

type SchemaType = Organization | WebSite | Service | BreadcrumbList;

/**
 * JSON-LD Component
 * Adds structured data for search engines
 */
export function JsonLd({ data }: { data: SchemaType | SchemaType[] }) {
  const schema = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : { '@context': 'https://schema.org', ...data };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Organization Schema
 * Default organization schema for the company
 */
export function OrganizationSchema() {
  const baseUrl = getBaseUrl();

  const schema: Organization = {
    '@type': 'Organization',
    name: 'ARB Marketing',
    url: baseUrl,
    logo: `${baseUrl}/assets/img/logo-black.png`,
    sameAs: [
      // Add your social media URLs here
      'https://www.linkedin.com/company/arb-marketing',
      'https://twitter.com/arbmarketing',
      'https://facebook.com/arbmarketing',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'Customer Service',
      email: 'info@arbmarketing.com',
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * Website Schema
 * Basic website information
 */
export function WebSiteSchema() {
  const baseUrl = getBaseUrl();

  const schema: WebSite = {
    '@type': 'WebSite',
    name: 'ARB Marketing',
    url: baseUrl,
    description: 'Elite leads. Winning cases. Elevating your practice. Trusted referral solutions and strategic marketing for personal injury law firms.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * Service Schema
 * Information about services offered
 */
export function ServiceSchema({ serviceType, description }: { serviceType: string; description?: string }) {
  const schema: Service = {
    '@type': 'Service',
    serviceType,
    provider: {
      '@type': 'Organization',
      name: 'ARB Marketing',
    },
    areaServed: 'United States',
    description,
  };

  return <JsonLd data={schema} />;
}

/**
 * Breadcrumb Schema
 * Navigation breadcrumb trail
 */
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; href: string }> }) {
  const baseUrl = getBaseUrl();

  const schema: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return <JsonLd data={schema} />;
}

/**
 * SEO Meta Tags Component
 * Comprehensive meta tags for pages
 */
interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function SEOMeta({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = 'website',
  canonical,
  noindex = false,
  nofollow = false,
}: SEOMetaProps) {
  const baseUrl = getBaseUrl();
  const fullTitle = `${title} | ARB Marketing`;
  const imageUrl = ogImage || `${baseUrl}/assets/img/logo-black.png`;
  const canonicalUrl = canonical || baseUrl;

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(',');

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ARB Marketing" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional Meta */}
      <meta name="author" content="ARB Marketing" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </>
  );
}

/**
 * Default page schemas
 * Common schemas to include on all pages
 */
export function DefaultSchemas() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
    </>
  );
}

