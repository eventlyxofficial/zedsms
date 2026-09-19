import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";

export function useUser() {
  return useQuery({ queryKey: ["me"], queryFn: getMe });
}
