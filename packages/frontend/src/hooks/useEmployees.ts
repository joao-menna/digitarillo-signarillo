import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () =>
      (
        await api.employee.get({
          query: { limit: 10, page: 1, sort: "id desc" },
        })
      ).data,
  });
}
