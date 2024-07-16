import { Box, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../../hooks/store";
import { FriendsMobileList } from "./FriendsMobileList";

export function FriendsChatContent() {
    const content = useAppSelector((state) => state.friendsChat.mainContent);

    switch (content.type) {
        case "blocked":
            return (
                <Box>
                    <Text>Blocked</Text>
                </Box>
            );
        case "chat":
            return (
                <Box>
                    <Text>Chat {content.userId}</Text>
                </Box>
            );
        case "search":
            return (
                <Box>
                    <Text>Search</Text>
                </Box>
            );
        case "friendRequests":
            return (
                <Box>
                    <Text>Friend Requests</Text>
                </Box>
            );
        default:
            return <FriendsMobileList />;
    }
}
