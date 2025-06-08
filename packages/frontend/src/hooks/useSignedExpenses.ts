import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useSignedExpenses() {
  return useQuery({
    queryKey: ["expenses", "signed"],
    queryFn: async () => (await api.expense.signed.get()).data,
  });
}
