import { useState, useEffect, ReactNode, Suspense } from "react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Button, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

import { routes, styles } from "@/global";
import { Logo } from "@/components/icons";
import { useTranslation } from "react-i18next";

export default function Auth({
  supabase,
  children,
}: {
  supabase: SupabaseClient;
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(['translation', 'auth']);

  useEffect(() => {
    if (!supabase) {
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return <></>;
  }

  function handleButton() {
    if (isSignUp) {
      supabase.auth.signUp({
        email,
        password,
      });
      setEmail("");
      setError(false);
      setPassword("");
      navigate(routes.confirmEmail)
    } else {
      supabase.auth
        .signInWithPassword({
          email: email,
          password: password,
        })
        .then(({ error }) => {
          if (error) {
            console.error(error);
            setError(true);
          } else {
            setError(false);
            setEmail("");
            setPassword("");
          }
        });
    }
  }

  if (!session) {
    return (
      <Suspense fallback={null}>
        <div className="w-2/3 sm:w-1/3 mx-auto space-y-2 grid grid-cols-1 mt-10">
          <div className="flex justify-center">
            <Logo />
            <p className="font-bold text-inherit p-3">{t('appName')}</p>
          </div>
          {error && <p className="text-red-500">{t('wrongAuth')}</p>}
          <Input
            isClearable
            isRequired
            classNames={styles.textInputStyle}
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onClear={() => setEmail("")}
          />
          <Input
            isClearable
            isRequired
            classNames={styles.textInputStyle}
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onClear={() => setPassword("")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleButton();
              }
            }}
          />
          <Button
            color="primary"
            onClick={() => {
              handleButton();
            }}
            onKeyDown={(e) => {
              console.log(e.key);
              if (e.key === "Enter") {
                e.preventDefault();
                handleButton();
              }
            }}
          >
            {isSignUp ? t('signUp') : t('login')}
          </Button>
          <Link
            className="text-blue-500"
            to="#"
            onClick={() => supabase.auth.resetPasswordForEmail(email)}
          >
            {t('forgotPassword')}
          </Link>
          <Link
            className="text-blue-500"
            to="#"
            onClick={() => (isSignUp ? setIsSignUp(false) : setIsSignUp(true))}
          >
            {isSignUp
              ? t('hasAccount')
              : t('noAccount')}
          </Link>
        </div>
      </Suspense>
    );
  } else {
    return <div>{children}</div>;
  }
}
