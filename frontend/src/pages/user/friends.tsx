import { VStack, Text } from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "../../components/friends-chat/sidebar/Sidebar";
import { friendsChatSelectors } from "../../store/friends-chat/slice";
import { useAppSelector } from "../../hooks/store";

export function FriendsPage() {
    const { isSidebarOpen } = useAppSelector(
        friendsChatSelectors.selectSidebar
    );

    return (
        <BaseLayout>
            <Sidebar />

            <AnimatePresence mode="wait">
                <VStack
                    as={motion.main}
                    transition="margin 0.2 cubic-bezier(0.4, 0, 0.2, 1)"
                    initial={{ marginLeft: "400px" }}
                    animate={{ marginLeft: !isSidebarOpen ? "40px" : "400px" }}
                    bgColor="yellow.700"
                >
                    <Text>Hello</Text>
                    <Text alignSelf="end">Good</Text>
                </VStack>
            </AnimatePresence>
        </BaseLayout>
    );
}
