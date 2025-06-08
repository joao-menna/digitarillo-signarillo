import { clsx } from "clsx/lite";
import { useNavigate } from "react-router";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className={clsx("flex gap-4 size-full mt-4")}>
      <button
        className={clsx("size-full bg-slate-200 hover:bg-slate-200/60", "p-2")}
        onClick={() => navigate("/employees")}
      >
        Funcionários
      </button>
      <div className={clsx("flex flex-col w-full gap-4")}>
        <button
          className={clsx(
            "size-full bg-slate-200 hover:bg-slate-200/60",
            "p-2"
          )}
          onClick={() => navigate("/expense/submit")}
        >
          Submissão de Relatórios de Despesa
        </button>
        <button
          className={clsx(
            "size-full bg-slate-200 hover:bg-slate-200/60",
            "p-2"
          )}
          onClick={() => navigate("/expense/pending")}
        >
          Relatórios de despesa pendentes de aprovação
        </button>
      </div>
    </div>
  );
}
