
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CorreoLibroLogo } from '@/components/icons/logo';
import { Loader2 } from 'lucide-react';

interface LoginFormClientProps {
  lang: string;
  texts: {
    title: string;
    description: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginButton: string;
    loggingIn: string;
  };
}

export function LoginFormClient({ lang, texts }: LoginFormClientProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // No actual validation for now, as requested for development
    console.log('Login attempt with:', { username }); // Avoid logging password
    
    // Simulate API call / auth process
    setTimeout(() => {
      // In a real app, you'd set some auth state (e.g., cookie, context)
      router.push(`/${lang}/admin/panel`); // Redirect to the main admin panel
      // setIsLoading(false); // Not needed if redirecting immediately
    }, 500);
  };

  return (
    <Card className="w-full max-w-md shadow-xl rounded-lg">
      <CardHeader className="text-center space-y-2">
        <CorreoLibroLogo className="w-16 h-16 mx-auto text-primary" />
        <CardTitle className="font-headline text-3xl">{texts.title}</CardTitle>
        <CardDescription>{texts.description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">{texts.usernameLabel}</Label>
            <Input
              id="username"
              type="text"
              placeholder={texts.usernamePlaceholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{texts.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              placeholder={texts.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-headline text-lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? texts.loggingIn : texts.loginButton}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
