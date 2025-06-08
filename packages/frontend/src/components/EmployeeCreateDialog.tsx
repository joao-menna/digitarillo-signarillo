import { useRef, type PropsWithChildren } from "react";
import { Dialog } from "radix-ui";
import { clsx } from "clsx/lite";
import { useCreateEmployee } from "@/hooks/useCreateEmployee";

export function EmployeeCreateDialog({ children }: PropsWithChildren) {
  const create = useCreateEmployee();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleCreateClick = () => {
    create.mutate({
      name: nameRef.current?.value!,
      email: emailRef.current?.value!,
    });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={clsx("bg-slate-400/40 fixed inset-0")} />
        <div className="fixed flex justify-center items-center size-full inset-0">
          <Dialog.Content
            className={clsx("bg-slate-400 max-w-96 p-2 flex flex-col gap-4")}
          >
            <div className="flex justify-between">
              <Dialog.Title>Criar funcionário</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className={clsx("bg-slate-200 hover:bg-slate-200/60 px-1")}
                >
                  X
                </button>
              </Dialog.Close>
            </div>
            <div className={clsx("flex flex-col gap-4")}>
              <input
                ref={nameRef}
                type="text"
                className={clsx("bg-white p-1")}
                placeholder="Nome"
              />
              <input
                ref={emailRef}
                type="email"
                className={clsx("bg-white p-1")}
                placeholder="E-mail"
              />
            </div>
            <div className={clsx("flex justify-end")}>
              <Dialog.Close asChild>
                <button
                  className={clsx("bg-slate-200 hover:bg-slate-200/60 p-1")}
                  onClick={handleCreateClick}
                >
                  Criar
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
