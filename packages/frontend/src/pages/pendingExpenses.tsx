import { api } from "@/api";
import { HomeButton } from "@/components/HomeButton";
import { useEmployees } from "@/hooks/useEmployees";
import { usePendingExpenses } from "@/hooks/usePendingExpenses";
import { downloadBlob } from "@/utils/downloadBlob";
import { formatDateTime } from "@/utils/formatDateTime";
import { clsx } from "clsx/lite";
import { useNavigate } from "react-router";

export function PendingExpensesPage() {
  const { data: pendingExpenses } = usePendingExpenses();
  const { data: employees } = useEmployees();
  const navigate = useNavigate();

  const handleClickDownload = async (expenseId: number) => {
    const res = await api.expense({ id: expenseId }).download.get();

    if (res.status !== 200 || !res.data) {
      alert("Não foi possível baixar o relatório da despesa.");
      return;
    }

    downloadBlob(`${expenseId}.pdf`, `/api/expense/${expenseId}/download`);
  };

  return (
    <div className={clsx("mt-4 flex flex-col gap-4")}>
      <div className={clsx("flex items-center gap-4")}>
        <HomeButton />
        <h1 className={clsx("text-2xl")}>Despesas Pendentes</h1>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Funcionário</th>
            <th>Custo</th>
            <th>Criado em</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pendingExpenses?.map((exp) => (
            <tr key={exp.id} className="text-center">
              <td>{exp.id}</td>
              <td>{exp.name}</td>
              <td>
                {employees?.find((emp) => emp.id === exp.employeeId)?.name}
              </td>
              <td>{exp.amount}</td>
              <td>{formatDateTime(new Date(exp.createdAt))}</td>
              <td className="flex gap-2">
                <button
                  className="bg-green-200 hover:bg-green-200/60 p-1 cursor-pointer"
                  onClick={() => handleClickDownload(exp.id)}
                >
                  Baixar
                </button>
                <button
                  className="bg-blue-200 hover:bg-blue-200/60 p-1 cursor-pointer"
                  onClick={() => navigate(`/expense/sign/${exp.id}`)}
                >
                  Assinar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
