import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

// Based on Next.js i18n routing examples
// This middleware handles locale detection and redirection if needed.
// It ensures that requests to the root path (e.g., /) are redirected
// to a path with a locale (e.g., /en or /es).
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.includes('/api/') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  const locales = ['en', 'es'];
  const defaultLocale = 'en';

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Try to get locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    let preferredLocale = defaultLocale;

    if (acceptLanguage) {
      const languages = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim().toLowerCase());
      for (const lang of languages) {
        if (locales.includes(lang)) {
          preferredLocale = lang;
          break;
        }
        // Check for language-region (e.g., en-US -> en)
        const langBase = lang.split('-')[0];
        if (locales.includes(langBase)) {
          preferredLocale = langBase;
          break;
        }
      }
    }
    
    // Prepend the locale to the path
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|images|fonts|favicon.ico).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
