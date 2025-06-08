import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.employee.post,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
