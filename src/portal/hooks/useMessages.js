import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, getSent, sendSms } from "../api/messages";

export function useMessages(numberId) {
  return useQuery({ queryKey: ["messages", numberId ?? "all"], queryFn: () => getMessages(numberId) });
}

export function useSent(numberId) {
  return useQuery({ queryKey: ["sent", numberId ?? "all"], queryFn: () => getSent(numberId), enabled: !!numberId });
}

export function useSendSms(numberId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ to, body }) => sendSms(numberId, { to, body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sent", numberId ?? "all"] }),
  });
}
