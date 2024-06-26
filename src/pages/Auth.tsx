import { useState, useEffect, ReactNode } from "react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Button, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

import { routes, styles } from "@/global";
import { Logo } from "@/components/icons";

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
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

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
            console.log(error);
            setErrorText(`error status: ${error.status} - error name: ${error.name} - error message: ${error.message} - error code: ${error.code} - error stack: ${error.stack}`);
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
      <div className="w-2/3 sm:w-1/3 mx-auto space-y-2 grid grid-cols-1 mt-10">
        <div className="flex justify-center">
          <Logo />
          <p className="font-bold text-inherit p-3">Rain memo</p>
        </div>
        {error && <p className="text-red-500">Wrong email or password</p>}
        {error &&<p className="text-red-500">{errorText}</p>}
        <Input
          isClearable
          isRequired
          classNames={styles.textInputStyle}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onClear={() => setEmail("")}
        />
        <Input
          isClearable
          isRequired
          classNames={styles.textInputStyle}
          label="Password"
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
          {isSignUp ? "Sign up" : "Log in"}
        </Button>
        <Link
          className="text-blue-500"
          to="#"
          onClick={() => supabase.auth.resetPasswordForEmail(email)}
        >
          Forgot password?
        </Link>
        <Link
          className="text-blue-500"
          to="#"
          onClick={() => (isSignUp ? setIsSignUp(false) : setIsSignUp(true))}
        >
          {isSignUp
            ? "Already have an account? Log in."
            : "No account? Sign up."}
        </Link>
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
}
