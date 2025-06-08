import { api } from "@/api";
import { clsx } from "clsx/lite";
import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDebounce, useEffectOnce } from "react-use";

export function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [wentWrong, setWentWrong] = useState<string>("");
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [urlSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffectOnce(() => {
    (async () => {
      const res = await api["csrf-token"].get();
      setCsrfToken(res.data?.csrfToken ?? "");
    })();
  });

  useDebounce(
    () => {
      if (!!wentWrong) {
        setWentWrong("");
      }
    },
    3000,
    [wentWrong]
  );

  const handleLoginClick = async () => {
    const res = await api.auth.login.post(
      {
        email: emailRef.current?.value!,
        password: passwordRef.current?.value!,
      },
      {
        headers: {
          "x-csrf-token": csrfToken,
        },
      }
    );

    if (res.status === 200) {
      navigate("/dashboard");
    } else {
      setWentWrong("Credenciais inválidas");
    }
  };

  return (
    <div className={clsx("flex size-full justify-center items-center mt-12")}>
      <div className={clsx("max-w-96 bg-slate-200 p-4 gap-4 flex flex-col")}>
        <h1 className={clsx("text-2xl")}>Log in</h1>
        {urlSearchParams.get("registered") === "true" && (
          <span>Entre na sua conta recém registrada</span>
        )}
        {!!wentWrong && (
          <span className={clsx("text-red-500")}>{wentWrong}</span>
        )}
        <input
          ref={emailRef}
          type="email"
          placeholder="E-mail"
          className={clsx("bg-white p-1")}
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Senha"
          className={clsx("bg-white p-1")}
        />
        <button
          onClick={handleLoginClick}
          className={clsx("bg-white hover:bg-white/60 p-1")}
        >
          Logar
        </button>
        <button
          onClick={() => navigate("/register")}
          className={clsx("bg-white hover:bg-white/60")}
        >
          Não possuo uma conta!
        </button>
      </div>
    </div>
  );
}
