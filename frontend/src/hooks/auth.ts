import {
    type UseMutationResult,
    useMutation,
    useQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { authService } from "@/services/auth";
import { userService } from "@/services/user";
import {
    ACCESS_TOKEN_LOCAL_STORAGE_KEY,
    MAGIC_LINK_LOGIN_PARAM_KEY,
} from "@/utils/auth";
import { type User } from "@/utils/schemas";

import { useAppToast } from "./ui";

function useAccessToken() {
    // Get user logged in using email address (JWT)
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["accessToken"],
        async queryFn() {
            const [ok, err] = await authService.getNewAccessToken();
            if (err || !ok) {
                localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
                return { accessToken: null, user: null };
            } else {
                localStorage.setItem(
                    ACCESS_TOKEN_LOCAL_STORAGE_KEY,
                    ok.accessToken
                );
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
        refetch,
    };
}

type UseUserReturn = {
    error: Error | null;
    isLoading: boolean;
    user: User | null | undefined;
    isLoggedIn: boolean;
    isSignupCompleted: boolean;
    logoutMutation: UseMutationResult<void, Error, void, unknown>;
    pushToLogin: () => void;

    /** User who is logged in and whose signup is completed */
    isAuthenticated: boolean;
};

/**
 * This hook handles getting logged in user who have logged in either using email
 * address JWT or an OAuth provider.
 */
export function useUser(): UseUserReturn {
    const auth = useAccessToken();
    const navigate = useNavigate();

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
                localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
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
        function checkSignupStatus(): boolean {
            if (auth.user) {
                return (
                    auth.user.username !== undefined &&
                    auth.user.email !== undefined
                );
            }

            if (loggedInUser.data?.user) {
                return (
                    loggedInUser.data.user.username !== undefined &&
                    loggedInUser.data.user.email !== undefined
                );
            }

            return false;
        },
        [auth.user, loggedInUser.data?.user]
    );

    const logoutMutation = useMutation({
        async mutationFn() {
            localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
            await authService.logout();
            await Promise.all([loggedInUser.refetch(), auth.refetch()]);
        },
    });

    const pushToLogin = useCallback(
        function () {
            navigate("/auth/login");
        },
        [navigate]
    );

    const isLoggedIn = auth.user != null || loggedInUser.data?.user != null;

    return {
        error: auth.error ?? loggedInUser.error,
        isLoading: auth.isLoading || loggedInUser.isLoading,
        user: auth.user ?? loggedInUser.data?.user,
        isLoggedIn,
        isSignupCompleted,
        logoutMutation,
        isAuthenticated: isLoggedIn && isSignupCompleted,
        pushToLogin,
    };
}

export function useMagicLinkLogin() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { errorToast } = useAppToast();
    const auth = useAccessToken();
    const navigate = useNavigate();

    const mutation = useMutation({
        async mutationFn({ token }: { token: string }) {
            const [ok, err] =
                await authService.magicLinkTokenVerification(token);

            if (err || !ok) {
                errorToast(err?.message ?? "Failed to login, please try again");
            } else {
                // Since user is logged in using magic link, we need to refetch
                // the access token to get user info and new access token. This
                // is redundant call since `ok` will have the latest access token
                // and user info
                await auth.refetch();
                navigate("/");
            }
        },
    });

    useEffect(
        function checkForIncompleteSignup() {
            const token = searchParams.get(MAGIC_LINK_LOGIN_PARAM_KEY);

            if (typeof token === "string") {
                mutation.mutateAsync({ token }).finally(() => {
                    searchParams.delete(MAGIC_LINK_LOGIN_PARAM_KEY);
                    setSearchParams(searchParams);
                });
            }
        },
        [searchParams]
    );

    return { isPending: mutation.isPending };
}
