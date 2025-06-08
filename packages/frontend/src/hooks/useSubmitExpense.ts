import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSubmitExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.expense.post,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", "pending"],
      });
    },
  });
}
