import { createBrowserRouter } from "react-router-dom";

// Pages
import { HomePage } from "@/pages";
import { LoginPage } from "@/pages/auth/login";
import { SignupPage } from "@/pages/auth/signup";
import { LobbyPage } from "@/pages/match/lobby";
import { MatchRoomPage } from "@/pages/match/match-room";
import { GlobalChatPage } from "@/pages/public/global-chat";
import { SearchPlayersPage } from "@/pages/public/search-players";
import { UserPublicProfilePage } from "@/pages/public/user-public-profile";
import { FriendsPage } from "@/pages/user/friends";
import { HistoryPage } from "@/pages/user/history";
import { NotificationsPage } from "@/pages/user/notifications";
import { SettingsPage } from "@/pages/user/settings";

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
    {
        path: "/settings",
        Component: SettingsPage,
    },
    {
        path: "/history",
        Component: HistoryPage,
    },
    {
        path: "/friends",
        Component: FriendsPage,
    },
    {
        path: "/player/:playerId",
        Component: UserPublicProfilePage,
    },
    {
        path: "/global-chat",
        Component: GlobalChatPage,
    },
    {
        path: "/search",
        Component: SearchPlayersPage,
    },
    {
        path: "/lobby",
        Component: LobbyPage,
    },
    {
        path: "/match/:matchId",
        Component: MatchRoomPage,
    },
];
