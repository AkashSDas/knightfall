import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.VITE_BACKEND_URL,
    withCredentials: true,
    timeout: 3000, // 3 seconds
    timeoutErrorMessage: "Request timed out",
});

type ApiResponse<T> = {
    status: number;
    data: T | null;
    error: unknown;
    success: boolean;
};

export async function fetchFromAPI<T>(
    url: string,
    opts?: AxiosRequestConfig,
    useAuth = false
): Promise<ApiResponse<T>> {
    try {
        const res = await axiosInstance<T>(url, {
            ...opts,
            headers: {
                ...opts?.headers,
                ...(useAuth
                    ? {
                          Authorization: `Bearer ${localStorage.getItem(
                              "accessToken"
                          )}`,
                      }
                    : {}),
            },
        });

        return {
            status: res.status,
            data: res.data,
            error: null,
            success: res.status < 300,
        };
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response) {
                return {
                    status: e.response.status,
                    data: e.response.data,
                    error: null,
                    success: e.response.status < 300,
                };
            }

            if (e.message === "Network Error") {
                return {
                    status: 500,
                    data: null,
                    error: { message: "Network Error" },
                    success: false,
                };
            }
        }
    }

    return {
        status: 500,
        data: null,
        error: { message: "Unknown Error" },
        success: false,
    };
}

export const endpoints = Object.freeze({});
