import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/services";

export function useServices() {
  return useQuery({ queryKey: ["services"], queryFn: getServices, staleTime: 5 * 60 * 1000 });
}
