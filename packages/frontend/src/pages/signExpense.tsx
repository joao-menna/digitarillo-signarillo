import { HomeButton } from "@/components/HomeButton";
import { useSignExpense } from "@/hooks/useSignExpense";
import { clsx } from "clsx/lite";
import { useNavigate, useParams } from "react-router";

export function SignExpensePage() {
  const navigate = useNavigate();
  const sign = useSignExpense();
  const { id } = useParams();

  const handleClickVote = async (vote: "approved" | "rejected") => {
    await sign.mutateAsync({ id: Number(id), vote });

    navigate(-1);
  };

  return (
    <div className={clsx("mt-4 flex flex-col gap-4")}>
      <div className={clsx("flex items-center gap-4")}>
        <HomeButton />
        <h1 className={clsx("text-2xl")}>Assinar despesa {id}</h1>
      </div>

      <div className="flex w-full gap-4">
        <button
          className="w-full h-12 bg-green-200 hover:bg-green-200/60 cursor-pointer"
          onClick={() => handleClickVote("approved")}
        >
          Aprovar
        </button>
        <button
          className="w-full h-12 bg-red-200 hover:bg-red-200/60 cursor-pointer"
          onClick={() => handleClickVote("rejected")}
        >
          Reprovar
        </button>
      </div>

      <div className="flex size-full">
        <iframe
          className="size-full h-96"
          src={`/api/expense/${id}/download`}
        ></iframe>
      </div>
    </div>
  );
}
