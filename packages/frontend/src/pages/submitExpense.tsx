import { useDropzone } from "react-dropzone";
import { useCallback, useRef, useState } from "react";
import { clsx } from "clsx/lite";
import { Select } from "radix-ui";
import { useEmployees } from "@/hooks/useEmployees";
import { HomeButton } from "@/components/HomeButton";
import { useDebounce } from "react-use";
import { api } from "@/api";
import { useSubmitExpense } from "@/hooks/useSubmitExpense";
import { useNavigate } from "react-router";

export function SubmitExpensePage() {
  const [file, setFile] = useState<File>();
  const [amount, setAmount] = useState<number | "">("");
  const [employeeId, setEmployeeId] = useState<number>();
  const [wentWrong, setWentWrong] = useState<string>();
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: employees } = useEmployees();
  const submit = useSubmitExpense();
  const navigate = useNavigate();

  const onDrop = useCallback((files: File[]) => {
    if (files.length) {
      setFile(files[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  useDebounce(
    () => {
      if (!!wentWrong) {
        setWentWrong(undefined);
      }
    },
    3000,
    [wentWrong]
  );

  const handleSendButton = async () => {
    if (!employeeId || !nameRef.current?.value || !amount || !file) {
      setWentWrong(
        "Você não escreveu um nome, um valor, " +
          "não selecionou um funcionário requisitante " +
          "ou não enviou uma imagem"
      );
      return;
    }

    const resImage = await api.expense.receipt.post({ file });

    if (resImage.status !== 200) {
      setWentWrong("Não foi possível upar a imagem");
      return;
    }

    await submit.mutateAsync({
      name: nameRef.current.value!,
      employeeId,
      amount,
      receiptPath: resImage.data?.receiptPath!,
    });

    navigate("/expense/pending");
  };

  return (
    <div className={clsx("flex flex-col gap-4 mt-4")}>
      <div className={clsx("flex items-center gap-4")}>
        <HomeButton />
        <h1 className={clsx("text-2xl")}>Submissão de Despesas</h1>
      </div>

      <div className={clsx("flex")}>
        <button
          className={clsx("bg-green-200 hover:bg-green-200/60 w-full", "p-1")}
          onClick={handleSendButton}
        >
          Enviar
        </button>
      </div>

      {!!wentWrong && (
        <div className={clsx("flex text-red-400")}>
          <span>{wentWrong}</span>
        </div>
      )}

      <div>
        <label className="flex flex-col mb-1">
          <span>Nome da despesa</span>
          <input ref={nameRef} className="border border-gray-300" type="text" />
        </label>
        <label className="flex flex-col mb-1">
          <span>Valor da despesa (R$)</span>
          <input
            className="border border-gray-300"
            type="number"
            placeholder="0.00"
            value={amount ?? ""}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : parseFloat(e.target.value))
            }
          />
        </label>
      </div>

      <div>
        <label className="flex flex-col">
          <span>Funcionário requisitante</span>
          <Select.Root onValueChange={(value) => setEmployeeId(Number(value))}>
            <Select.Trigger className="w-full border border-gray-300 px-3 py-2">
              <Select.Value placeholder="Selecione um funcionário" />
            </Select.Trigger>
            <Select.Content className="bg-white border border-gray-300">
              {employees?.map((emp) => (
                <Select.Item
                  key={emp.id}
                  value={String(emp.id)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-200/60"
                >
                  <Select.ItemText>{emp.name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </label>
      </div>

      {!file ? (
        <div
          className="border-2 border-dashed h-36 flex justify-center items-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">
            Arraste um recibo ou clique para enviar
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-4">
          <button
            className="bg-slate-200 hover:bg-slate-200/60 p-1"
            onClick={() => setFile(undefined)}
          >
            Remover imagem
          </button>
          <img
            className="object-contain h-96"
            src={URL.createObjectURL(file)}
            alt="Comprovante"
          />
        </div>
      )}
    </div>
  );
}
