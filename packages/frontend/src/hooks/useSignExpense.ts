import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.expense.vote.post,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["expenses", "pending"],
      });
    },
  });
}
