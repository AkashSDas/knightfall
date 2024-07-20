import { VStack, useBreakpointValue, useTheme } from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "../../components/friends-chat/sidebar/FriendsChatSidebar";
import {
    friendsChatActions,
    friendsChatSelectors,
} from "../../store/friends-chat/slice";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { FriendsChatContent } from "../../components/friends-chat/content/FriendsChatContent";
import { AuthProtectedBaseLayout } from "../../components/shared/layout/AuthProtectedBaseLayout";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFriendManager } from "../../hooks/friend";

export function FriendsPage() {
    return (
        <AuthProtectedBaseLayout>
            <FriendsPageContent />
        </AuthProtectedBaseLayout>
    );
}

function FriendsPageContent() {
    const { isSidebarOpen } = useAppSelector(
        friendsChatSelectors.selectSidebar
    );
    const isMd = useBreakpointValue({ base: false, md: true }, { ssr: false });
    const theme = useTheme();
    const [params, setParams] = useSearchParams();
    const { friends } = useFriendManager();
    const dispatch = useAppDispatch();

    useEffect(
        function openChatWindow() {
            const friendId = params.get("friend");
            if (friendId) {
                const friend = friends.find((f) => f.id === friendId);
                if (friend) {
                    dispatch(
                        friendsChatActions.setMainContent({
                            type: "chat",
                            friendId: friend.id,
                        })
                    );

                    params.delete("friend");
                    setParams(params);
                }
            }
        },
        [params, friends]
    );

    return (
        <BaseLayout>
            <Sidebar />

            <AnimatePresence mode="wait">
                <VStack
                    as={motion.main}
                    transition="margin 0.2 cubic-bezier(0.4, 0, 0.2, 1)"
                    initial={{ marginLeft: isMd ? "240px" : "0px" }}
                    animate={{
                        marginLeft: !isMd
                            ? "0xp"
                            : !isSidebarOpen
                              ? "40px"
                              : "240px",
                    }}
                    sx={{
                        [theme.breakpoints.md]: {
                            marginLeft: "240px",
                        },
                    }}
                >
                    <FriendsChatContent />
                </VStack>
            </AnimatePresence>
        </BaseLayout>
    );
}
