import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTransactions, topUp, transferBalance } from "../api/transactions";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    select: (data) => {
      // Ensure data is always an array
      if (Array.isArray(data)) return data;
      if (data?.data && Array.isArray(data.data)) return data.data;
      if (data?.transactions && Array.isArray(data.transactions)) return data.transactions;
      return [];
    }
  });
}

export function useTopUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: topUp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useTransferBalance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transferBalance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
