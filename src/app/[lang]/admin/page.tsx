
import { getDictionary } from '@/lib/dictionaries';
import { LoginFormClient } from './components/login-form-client';

interface LoginPageProps {
  params: { lang: string };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  // Fallback for loginPage texts in case they are not in the dictionary yet
  const loginTexts = dictionary.loginPage || {
    title: "Admin Login",
    description: "Access the Admin Panel.",
    usernameLabel: "Username",
    usernamePlaceholder: "Enter username",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter password",
    loginButton: "Login",
    loggingIn: "Logging in..."
  };

  return <LoginFormClient lang={lang} texts={loginTexts} />;
}
