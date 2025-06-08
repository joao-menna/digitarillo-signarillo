import { api } from "@/api";
import { Outlet, useNavigate } from "react-router";
import { useEffectOnce } from "react-use";

export function ProtectedLayout() {
  const navigate = useNavigate();

  useEffectOnce(() => {
    (async () => {
      const res = await api.auth.user.get();

      if (res.status !== 200) {
        navigate("/login");
      }
    })();
  });

  return (
    <div className="size-full">
      <Outlet />
    </div>
  );
}
