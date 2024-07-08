import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../utils/auth";
import { userService } from "../services/user";
import { useMemo } from "react";

function useAccessToken() {
    // Get user logged in using email address (JWT)
    const { data, isLoading, error } = useQuery({
        queryKey: ["accessToken"],
        async queryFn() {
            const [ok, err] = await authService.getNewAccessToken();
            if (err || !ok) {
                localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
                return { accessToken: null, user: null };
            } else {
                return { user: ok.user, accessToken: ok.accessToken };
            }
        },
        retry: false,
        refetchOnWindowFocus: true,
        refetchInterval: 29 * 60 * 1000, // Refresh every 29min (access token expires in 30mins)
        refetchOnReconnect: true,
        staleTime: 29 * 60 * 1000,
    });

    return {
        user: data?.user,
        accessToken: data?.accessToken,
        isLoading,
        error,
    };
}

/**
 * This hook handles getting logged in user who have logged in either using email
 * address JWT or an OAuth provider.
 */
export function useUser() {
    const auth = useAccessToken();

    // Make request only if the `useAccessToken` has failed to get user
    // that would only mean either the user has signed up using OAuth or
    // the user has not signed up
    const loggedInUser = useQuery({
        queryKey: ["loggedInUser"],
        async queryFn() {
            // This is for users who have logged in using OAuth providers (in that
            // case they don't have access token). Error indicates that the user
            // is not logged in using access token
            const [ok, err] = await userService.getLoggedInUserProfile();
            if (err || !ok) {
                return { user: null };
            } else {
                return { user: ok.user };
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 29 * 60 * 1000, // Refresh every 29min (access token expires in 30mins)
        refetchOnReconnect: true,
        staleTime: 29 * 60 * 1000,
        enabled: !auth.accessToken && !auth.isLoading,
    });

    /**
     * This boolean value tell whether a user has completed the signup process
     * or has partially completed it (incase of OAuth signup)
     */
    const isSignupCompleted = useMemo(
        function checkSignupStatus() {
            if (auth.user) {
                return auth.user.username && auth.user.email;
            }

            if (loggedInUser.data?.user) {
                return (
                    loggedInUser.data.user.username &&
                    loggedInUser.data.user.email
                );
            }

            return false;
        },
        [auth.user, loggedInUser.data?.user]
    );

    return {
        error: auth.error ?? loggedInUser.error,
        isLoading: auth.isLoading || loggedInUser.isLoading,
        user: auth.user ?? loggedInUser.data?.user,
        isLoggedIn: auth.user != null || loggedInUser.data?.user != null,
        isSignupCompleted,
    };
}
