import { api } from "@/api";
import { HomeButton } from "@/components/HomeButton";
import { useEmployees } from "@/hooks/useEmployees";
import { useSignedExpenses } from "@/hooks/useSignedExpenses";
import { downloadBlob } from "@/utils/downloadBlob";
import { formatDateTime } from "@/utils/formatDateTime";
import { clsx } from "clsx/lite";

export function SignedExpensesPage() {
  const { data: signedExpenses } = useSignedExpenses();
  const { data: employees } = useEmployees();

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
        <h1 className={clsx("text-2xl")}>Relatórios de Despesa Assinados</h1>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Funcionário</th>
            <th>Custo</th>
            <th>Criado em</th>
            <th>Voto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {signedExpenses?.map((exp) => (
            <tr key={exp.id} className="text-center">
              <td>{exp.id}</td>
              <td>{exp.name}</td>
              <td>
                {employees?.find((emp) => emp.id === exp.employeeId)?.name}
              </td>
              <td>{exp.amount}</td>
              <td>{formatDateTime(new Date(exp.createdAt))}</td>
              <td
                className={clsx(
                  exp.vote === "approved" ? "bg-green-300" : "bg-red-300"
                )}
              >
                {exp.vote === "approved" ? "Aprovado" : "Rejeitado"}
              </td>
              <td className="flex gap-2 pl-2">
                <button
                  className="bg-green-200 hover:bg-green-200/60 p-1 cursor-pointer"
                  onClick={() => handleClickDownload(exp.id)}
                >
                  Baixar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
