import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../api/auth";
import { useCallback } from "react";

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user
  const userQuery = useQuery({
    queryKey: ["auth:user"],
    queryFn: async () => {
      const token = localStorage.getItem("zedsms-token");
      if (!token) return null;
      try {
        return await authApi.getMe();
      } catch (err) {
        localStorage.removeItem("zedsms-token");
        localStorage.removeItem("zedsms-user");
        throw err;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth:user"], data.user);
    },
  });

  // Sign up mutation
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth:user"], data.user);
    },
  });

  // Google login mutation
  const googleLoginMutation = useMutation({
    mutationFn: authApi.loginWithGoogle,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth:user"], data.user);
    },
  });

  // OTP verification mutation
  const verifyOtpMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth:user"], data.user);
    },
  });

  // Logout
  const logout = useCallback(() => {
    authApi.logout();
    queryClient.setQueryData(["auth:user"], null);
  }, [queryClient]);

  return {
    // State
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isLoggedIn: !!userQuery.data,

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    // Sign up
    signup: signupMutation.mutate,
    signupAsync: signupMutation.mutateAsync,
    isSignupLoading: signupMutation.isPending,
    signupError: signupMutation.error,

    // Google login
    googleLogin: googleLoginMutation.mutate,
    googleLoginAsync: googleLoginMutation.mutateAsync,
    isGoogleLoginLoading: googleLoginMutation.isPending,
    googleLoginError: googleLoginMutation.error,

    // OTP
    verifyOtp: verifyOtpMutation.mutate,
    verifyOtpAsync: verifyOtpMutation.mutateAsync,
    isVerifyOtpLoading: verifyOtpMutation.isPending,
    verifyOtpError: verifyOtpMutation.error,

    // Logout
    logout,
  };
}
