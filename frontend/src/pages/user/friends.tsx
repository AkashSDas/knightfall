import { VStack, useBreakpointValue, useTheme } from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "../../components/friends-chat/sidebar/FriendsChatSidebar";
import { friendsChatSelectors } from "../../store/friends-chat/slice";
import { useAppSelector } from "../../hooks/store";
import { FriendsChatContent } from "../../components/friends-chat/content/FriendsChatContent";

export function FriendsPage() {
    const { isSidebarOpen } = useAppSelector(
        friendsChatSelectors.selectSidebar
    );
    const isMd = useBreakpointValue({ base: false, md: true }, { ssr: false });
    const theme = useTheme();

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
