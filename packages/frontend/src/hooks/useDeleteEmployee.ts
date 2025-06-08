import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteEmployee(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.employee({ id }).delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
