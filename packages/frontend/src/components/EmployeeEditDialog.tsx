import { useEditEmployee } from "@/hooks/useEditEmployee";
import { useRef } from "react";
import type { Employee } from "@/interfaces/employee";
import { Dialog } from "radix-ui";
import { clsx } from "clsx/lite";

interface Props {
  employee: Employee;
  onClose: () => void;
}

export function EmployeeEditDialog({ employee, onClose }: Props) {
  const edit = useEditEmployee(employee.id);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    edit.mutate({
      name: nameRef.current?.value!,
      email: emailRef.current?.value!,
    });

    onClose();
  };

  return (
    <Dialog.Root defaultOpen={true}>
      <Dialog.Portal>
        <Dialog.Overlay className={clsx("bg-slate-400/40 fixed inset-0")} />
        <div className="fixed flex justify-center items-center size-full inset-0">
          <Dialog.Content
            className={clsx("bg-slate-400 max-w-96 p-2 flex flex-col gap-4")}
          >
            <div className="flex justify-between">
              <Dialog.Title>Editar funcionário</Dialog.Title>
              <Dialog.Close onClick={onClose} asChild>
                <div
                  className={clsx("bg-slate-200 hover:bg-slate-200/60 px-1")}
                >
                  X
                </div>
              </Dialog.Close>
            </div>
            <div className={clsx("flex flex-col gap-4")}>
              <label className="w-full">
                <span>Nome</span>
                <input
                  ref={nameRef}
                  type="text"
                  className={clsx("bg-white p-1 w-full")}
                  defaultValue={employee.name}
                  placeholder="Nome"
                />
              </label>
              <label className="w-full">
                <span>E-mail</span>
                <input
                  ref={emailRef}
                  type="email"
                  className={clsx("bg-white p-1 w-full")}
                  defaultValue={employee.email}
                  placeholder="E-mail"
                />
              </label>
            </div>
            <div className={clsx("flex justify-end")}>
              <Dialog.Close asChild>
                <div
                  className={clsx("bg-slate-200 hover:bg-slate-200/60 p-1")}
                  onClick={handleEditClick}
                >
                  Salvar
                </div>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
