import React from 'react';

// No CSS import for extreme minimalism
// Minimal props, lang is used only on the html tag

interface BasicLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export default function BasicLayout({ children, params }: BasicLayoutProps): JSX.Element {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>App ({params.lang})</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
