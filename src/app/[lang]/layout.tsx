import React from 'react';
import '../globals.css'; // Keep for basic styling and to test CSS imports

// Minimal props for params
interface MinimalLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

// No generateMetadata or viewport
// No ThemeProvider or Toaster
// No custom fonts in <head>

export default function MinimalAppLayout({ children, params: { lang } }: MinimalLayoutProps) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Minimal Layout ({lang})</title>
      </head>
      <body className="font-body antialiased">
        <div className="min-h-screen flex flex-col">
          <header style={{ padding: '1rem', background: '#eee' }}>
            <h1>Site Header (Minimal)</h1>
          </header>
          <main style={{ flex: 1, padding: '1rem' }}>
            {children}
          </main>
          <footer style={{ padding: '1rem', background: '#eee', textAlign: 'center' }}>
            <p>Site Footer (Minimal)</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
