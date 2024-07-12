import { createBrowserRouter } from "react-router-dom";

// Pages
import { HomePage } from "../pages";
import { SignupPage } from "../pages/auth/signup";
import { LoginPage } from "../pages/auth/login";
import { NotificationsPage } from "../pages/notifications";

export const routes: Parameters<typeof createBrowserRouter>[0] = [
    {
        path: "/",
        Component: HomePage,
    },
    {
        path: "/auth/signup",
        Component: SignupPage,
    },
    {
        path: "/auth/login",
        Component: LoginPage,
    },
    {
        path: "/notifications",
        Component: NotificationsPage,
    },
];
