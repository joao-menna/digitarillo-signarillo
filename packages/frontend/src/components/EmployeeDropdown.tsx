import { useDeleteEmployee } from "@/hooks/useDeleteEmployee";
import type { Employee } from "@/interfaces/employee";
import { clsx } from "clsx/lite";
import { DropdownMenu } from "radix-ui";

interface Props {
  employee: Employee;
  onClickEdit: (employee: Employee) => void;
}

export function EmployeeDropdown({ employee, onClickEdit }: Props) {
  const remove = useDeleteEmployee(employee.id);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={clsx(
          "flex flex-col font-bold bg-slate-200 hover:bg-slate-200/60 p-1"
        )}
      >
        <span>. . .</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-slate-300 select-none">
          <DropdownMenu.Item
            className="hover:bg-slate-200/60"
            onClick={() => onClickEdit(employee)}
          >
            Editar
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="hover:bg-slate-200/60"
            onClick={() => remove.mutate({})}
          >
            Remover
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
