import { api } from "@/api";
import { Outlet, useNavigate } from "react-router";
import { useEffectOnce } from "react-use";

export function LoginLayout() {
  const navigate = useNavigate();

  useEffectOnce(() => {
    (async () => {
      const res = await api.auth.user.get();

      if (res.status === 200) {
        navigate("/dashboard");
      }
    })();
  });

  return (
    <>
      <Outlet />
    </>
  );
}
