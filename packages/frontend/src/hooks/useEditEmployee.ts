import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditEmployee(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.employee({ id }).put,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
