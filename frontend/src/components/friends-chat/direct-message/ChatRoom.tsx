import { Text, VStack } from "@chakra-ui/react";
import { useAppSelector } from "../../../hooks/store";
import { FriendsChatState } from "../../../store/friends-chat/slice";
import {
    useDirectMessageRoom,
    useListenToDirectMessages,
} from "../../../hooks/friend";
import { MessageInput } from "./MessageInput";
import { useEffect, useRef } from "react";

export function ChatRoom() {
    const { friendId } = useAppSelector(
        (state) =>
            state.friendsChat.mainContent as Extract<
                FriendsChatState["mainContent"],
                { type: "chat" }
            >
    );

    const containerRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useDirectMessageRoom(friendId);
    useListenToDirectMessages(friendId);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, []);

    return (
        <VStack
            w="100%"
            overflowY="hidden"
            justifyContent="space-between"
            pos="relative"
            ref={containerRef}
            h="100%"
            minH="calc(100vh - 72px)"
        >
            <VStack
                w="100%"
                maxW="700px"
                alignItems="start"
                justifyContent="flex-end"
                overflowY="auto"
                spacing={4}
                h="100%"
                px="1rem"
                mt="calc(86px + 1rem)"
                mb="calc(72px + 1rem)"
                flexGrow={1}
            >
                {Array.from({ length: 30 }, (_, i) => (
                    <Text key={i}>Good morning {i}</Text>
                ))}

                <div ref={messagesEndRef} />
            </VStack>

            <MessageInput containerRef={containerRef} />
        </VStack>
    );
}
