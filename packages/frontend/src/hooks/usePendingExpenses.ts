import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function usePendingExpenses() {
  return useQuery({
    queryKey: ["expenses", "pending"],
    queryFn: async () => (await api.expense.pending.get()).data,
  });
}
