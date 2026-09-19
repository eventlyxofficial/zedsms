import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buyNumber, getNumbers, releaseNumber, renameNumber, renewNumber } from "../api/numbers";

export function useNumbers() {
  return useQuery({ queryKey: ["numbers"], queryFn: getNumbers });
}

export function useBuyNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: buyNumber,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["numbers"] }),
  });
}

export function useRenewNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ numberId, plan }) => renewNumber(numberId, { plan }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["numbers"] }),
  });
}

export function useReleaseNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: releaseNumber,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["numbers"] }),
  });
}

export function useRenameNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ numberId, label }) => renameNumber(numberId, label),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["numbers"] }),
  });
}
