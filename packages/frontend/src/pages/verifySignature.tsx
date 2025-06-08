import { api } from "@/api";
import { HomeButton } from "@/components/HomeButton";
import { clsx } from "clsx/lite";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDebounce } from "react-use";

export function VerifySignaturePage() {
  const [wentWrong, setWentWrong] = useState<string>();
  const [file, setFile] = useState<File>();
  const idRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((files: File[]) => {
    if (files.length) {
      setFile(files[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
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
    if (!file || !idRef.current?.value) {
      setWentWrong("Insira um arquivo e seu respectivo ID");
      return;
    }

    const id = Number(idRef.current?.value);
    const resImage = await api.expense({ id }).validate.post({ file });

    if (resImage.status !== 200) {
      setWentWrong("Não foi possível validar o arquivo");
      return;
    }

    if (resImage.data?.isValid) {
      alert("Arquivo válido!");
    } else {
      alert("Arquivo inválido!");
    }
  };

  return (
    <div className={clsx("flex flex-col gap-4 mt-4")}>
      <div className={clsx("flex items-center gap-4")}>
        <HomeButton />
        <h1 className={clsx("text-2xl")}>Validação de Relatórios de Despesa</h1>
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

      <label className="flex flex-col mb-1">
        <span>ID da Despesa</span>
        <input ref={idRef} className="border border-gray-300" type="text" />
      </label>

      {!file ? (
        <div
          className="border-2 border-dashed h-36 flex justify-center items-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">
            Arraste um relatório ou clique para enviar
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-4">
          <button
            className="bg-slate-200 hover:bg-slate-200/60 p-1"
            onClick={() => setFile(undefined)}
          >
            Remover relatório
          </button>
          <iframe
            className="object-contain h-96"
            src={URL.createObjectURL(file)}
          />
        </div>
      )}
    </div>
  );
}
