import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../api/countries";

export function useCountries() {
  return useQuery({ queryKey: ["countries"], queryFn: getCountries, staleTime: 5 * 60 * 1000 });
}
