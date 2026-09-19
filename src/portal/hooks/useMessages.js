import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, getSent, sendSms, getRecentMessages } from "../api/messages";

export function useRecentMessages() {
  return useQuery({
    queryKey: ["recentMessages"],
    queryFn: getRecentMessages,
    select: (data) => {
      // Ensure data is always an array
      if (Array.isArray(data)) return data;
      if (data?.data && Array.isArray(data.data)) return data.data;
      if (data?.messages && Array.isArray(data.messages)) return data.messages;
      return [];
    }
  });
}

export function useMessages(numberId) {
  return useQuery({
    queryKey: ["messages", numberId ?? "all"],
    queryFn: () => getMessages(numberId),
    select: (data) => {
      // Ensure data is always an array
      if (Array.isArray(data)) return data;
      if (data?.data && Array.isArray(data.data)) return data.data;
      if (data?.messages && Array.isArray(data.messages)) return data.messages;
      return [];
    }
  });
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
