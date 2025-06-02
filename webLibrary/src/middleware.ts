import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

// Based on Next.js i18n routing examples
// This middleware handles locale detection, redirection, and route protection.
export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const requestHeaders = new Headers(request.headers); // Used for setting x-pathname

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.includes('/api/') || // Exclude all API routes
    pathname.startsWith('/_next') // Exclude Next.js internal paths
  ) {
    return NextResponse.next();
  }
  
  requestHeaders.set('x-pathname', pathname); // Pass pathname for client-side use if needed

  const locales = ['en', 'es'];
  const defaultLocale = 'en';

  // --- Locale Detection and Handling (adapted from original) ---
  let currentLocale = defaultLocale;
  let hasLocalePrefix = false;

  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      currentLocale = locale;
      hasLocalePrefix = true;
      break;
    }
  }
  
  // --- Authentication and Protected Routes ---
  const protectedRoutePatterns = [
    /^\/(en|es)\/admin(\/.*)?$/, // /en/admin, /es/admin, /en/admin/panel, /es/admin/panel/books, etc.
    /^\/(en|es)\/checkout(\/.*)?$/,
    /^\/(en|es)\/sales\/history(\/.*)?$/,
    // Add /cart here if it should be strictly protected. 
    // If guests can view an empty cart, protection might be at component level or for specific cart actions.
    // For this task, let's protect /cart as well.
    /^\/(en|es)\/cart(\/.*)?$/, 
  ];

  const isProtectedRoute = protectedRoutePatterns.some(pattern => pattern.test(pathname));
  const token = request.cookies.get('authToken')?.value;

  if (isProtectedRoute && !token) {
    // For admin routes, redirect to admin login. For others, to a generic login page.
    // Ensure the login page itself is not a protected route to avoid redirect loops.
    let loginPath = `/${currentLocale}/login`; // Generic login page
    if (pathname.startsWith(`/${currentLocale}/admin`)) {
      loginPath = `/${currentLocale}/admin`; // Admin login is at /admin
    }
    
    // Preserve searchParams if any, e.g., a `redirect_url`
    const loginUrl = new URL(loginPath, origin);
    // request.nextUrl.searchParams.forEach((value, key) => {
    //   loginUrl.searchParams.append(key, value);
    // });
    // For simplicity, not preserving searchParams now, but could be added.
    return NextResponse.redirect(loginUrl);
  }

  // --- Locale Redirection if missing (after auth check, as auth might redirect) ---
  if (!hasLocalePrefix) {
    // Try to get locale from Accept-Language header or use default
    const acceptLanguage = request.headers.get('accept-language');
    let preferredLocale = defaultLocale;

    if (acceptLanguage) {
      const languages = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim().toLowerCase());
      for (const lang of languages) {
        if (locales.includes(lang)) {
          preferredLocale = lang;
          break;
        }
        const langBase = lang.split('-')[0];
        if (locales.includes(langBase)) {
          preferredLocale = langBase;
          break;
        }
      }
    }
    
    const url = request.nextUrl.clone();
    // Ensure pathname doesn't start with preferredLocale if it was already processed (e.g. from a redirect)
    if (!url.pathname.startsWith(`/${preferredLocale}`)) {
         url.pathname = `/${preferredLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    }
    return NextResponse.redirect(url);
  }
  
  // If all checks pass (not static/API, auth valid or public route, locale present)
  return NextResponse.next({
    headers: requestHeaders, // Forward the modified headers
  });
}

export const config = {
  matcher: [
    // Match all routes except static files, API routes, and Next.js internals
    // This ensures the middleware runs on all page navigations.
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|manifest.json|sw.js|workbox-.*.js).*)',
  ],
};
