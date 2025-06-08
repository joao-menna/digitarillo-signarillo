import { EmployeeCreateDialog } from "@/components/EmployeeCreateDialog";
import { EmployeeDropdown } from "@/components/EmployeeDropdown";
import { EmployeeEditDialog } from "@/components/EmployeeEditDialog";
import { HomeButton } from "@/components/HomeButton";
import { useEmployees } from "@/hooks/useEmployees";
import type { Employee } from "@/interfaces/employee";
import { formatDateTime } from "@/utils/formatDateTime";
import { clsx } from "clsx/lite";
import { useState } from "react";

export function EmployeesPage() {
  const { data: employees } = useEmployees();
  const [editEmployee, setEditEmployee] = useState<Employee>();

  return (
    <div className={clsx("mt-4 flex flex-col gap-4")}>
      <div className={clsx("flex items-center gap-4")}>
        <HomeButton />
        <h1 className={clsx("text-2xl")}>Funcionários</h1>
      </div>

      <div className={clsx("flex justify-end")}>
        <EmployeeCreateDialog>
          <div className={clsx("bg-slate-200 hover:bg-slate-200/60 p-2")}>
            Adicionar +
          </div>
        </EmployeeCreateDialog>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Criado em</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => (
            <tr key={employee.id} className="text-center">
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{formatDateTime(new Date(employee.createdAt))}</td>
              <td>
                <EmployeeDropdown
                  employee={employee}
                  onClickEdit={setEditEmployee}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!!editEmployee && (
        <EmployeeEditDialog
          employee={editEmployee}
          onClose={() => setEditEmployee(undefined)}
        />
      )}
    </div>
  );
}
