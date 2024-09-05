import {
    Avatar,
    Box,
    HStack,
    IconButton,
    Spinner,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import {
    faArrowDownLong,
    faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useUser } from "@/hooks/auth";
import {
    useDirectMessageRoom,
    useDirectMessages,
    useListenToDirectMessages,
} from "@/hooks/direct-message";
import { useFriendManager } from "@/hooks/friend";
import { useAppSelector } from "@/hooks/store";
import { FriendsChatState } from "@/store/friends-chat/slice";
import { formatNotificationDate } from "@/utils/datetime";

import { MessageInput } from "./MessageInput";

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
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { friends } = useFriendManager();
    const friend = useMemo(
        () => friends.find((friend) => friend.id === friendId),
        [friends, friendId]
    );

    useDirectMessageRoom(friendId);
    const { hasConnected } = useListenToDirectMessages(friendId);
    const { user } = useUser();

    const { fetchMore, hasMore, isFetchingMore, isLoading } = useDirectMessages(
        {
            limit: 20,
            friendId: friend?.id,
        }
    );
    const { friendChats } = useAppSelector((state) => state.friendsChat);
    const chat = friendChats[friendId] ?? [];
    const [isVisible, setIsVisible] = useState(false);
    const initLoadRef = useRef(false);

    useEffect(
        function scrollDownToLatestMessages() {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "instant" });
            }
        },
        [chat]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (initLoadRef.current) {
                    const entry = entries[0];
                    setIsVisible(entry.intersectionRatio === 1 ? true : false);
                } else {
                    initLoadRef.current = true;
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0,
            }
        );

        const currentItem = loadMoreRef.current;
        if (currentItem) {
            observer.observe(currentItem);
        }

        return () => {
            if (currentItem) {
                observer.unobserve(currentItem);
            }
        };
    }, []);

    useEffect(
        function loadMoreMessages() {
            if (isVisible) {
                fetchMore();
            }
        },
        [isVisible]
    );

    /** Scroll to bottom (to latest messages) */
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(function identifyScrollPositionToShowScrollDownButton() {
        const handleScroll = () => {
            const scrollTop = window.scrollY; // Current scroll position from top
            const windowHeight = window.innerHeight; // Height of the visible window
            const docHeight = document.documentElement.scrollHeight; // Total height of the document

            const scrollPercent =
                (scrollTop / (docHeight - windowHeight)) * 100;

            // Show button if the user has scrolled 20% above the bottom
            if (scrollPercent <= 80) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
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
                overflowY="hidden"
                spacing={4}
                h="100%"
                px="1rem"
                mt="calc(86px + 1rem)"
                mb="calc(72px + 1rem)"
                flexGrow={1}
                className="chat-room"
                flexDirection="column-reverse"
            >
                <Box ref={messagesEndRef} />

                {chat.map((group) => {
                    const { messages, userId, groupId } = group;
                    const isLoggedInUser = user!.id === userId;
                    let profilePicURL: string | undefined;

                    if (user!.id === userId) {
                        profilePicURL = user!.profilePic.URL;
                    } else {
                        profilePicURL = friend?.friend.profilePic.URL;
                    }

                    return (
                        <VStack
                            key={groupId}
                            w="100%"
                            alignItems={isLoggedInUser ? "end" : "start"}
                        >
                            <HStack
                                alignItems="start"
                                flexDirection={
                                    isLoggedInUser ? "row-reverse" : "row"
                                }
                            >
                                <Avatar
                                    as={Link}
                                    to={`/player/${userId}`}
                                    src={profilePicURL}
                                    h="30px"
                                    w="30px"
                                    border="1.5px solid black"
                                />

                                <VStack
                                    alignItems={
                                        isLoggedInUser ? "end" : "start"
                                    }
                                >
                                    {messages.map((msg) => {
                                        return (
                                            <VStack
                                                w="fit-content"
                                                maxW={{
                                                    base: "300px",
                                                    md: "300px",
                                                }}
                                                key={msg.messageId}
                                                bgColor={
                                                    isLoggedInUser
                                                        ? "blue.700"
                                                        : "gray.700"
                                                }
                                                border="2px solid"
                                                borderColor={
                                                    isLoggedInUser
                                                        ? "blue.800"
                                                        : "gray.900"
                                                }
                                                px="8px"
                                                py="2px"
                                                borderRadius="6px"
                                                color="gray.100"
                                                alignItems="start"
                                                gap="0px"
                                            >
                                                <Text>{msg.text}</Text>
                                                <Text
                                                    fontSize="11px"
                                                    color={
                                                        isLoggedInUser
                                                            ? "gray.200"
                                                            : "gray.400"
                                                    }
                                                >
                                                    {formatNotificationDate(
                                                        new Date(msg.createdAt)
                                                    )}
                                                </Text>
                                            </VStack>
                                        );
                                    })}
                                </VStack>
                            </HStack>
                        </VStack>
                    );
                })}

                <Box ref={loadMoreRef} />

                {!hasMore && chat.length > 0 ? (
                    <HStack w="100%" mb="2rem" justifyContent="center">
                        <Text
                            fontSize="18px"
                            color="gray.200"
                            fontWeight="semibold"
                        >
                            You have seen all messages
                        </Text>
                    </HStack>
                ) : null}

                {!isLoading && chat.length === 0 ? (
                    <VStack
                        w="100%"
                        mb="2rem"
                        justifyContent="center"
                        color="gray.300"
                        gap="24px"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} size="6x" />

                        <Text
                            fontSize="18px"
                            color="gray.200"
                            fontWeight="semibold"
                        >
                            No messages. Start a conversation
                        </Text>
                    </VStack>
                ) : null}

                {isFetchingMore ? (
                    <HStack w="100%" mb="2rem" justifyContent="center">
                        <Spinner />
                    </HStack>
                ) : null}
            </VStack>

            {showScrollButton ? (
                <Tooltip
                    label="Scroll to bottom"
                    openDelay={500}
                    placement="top"
                >
                    <IconButton
                        aria-label="Scroll to bottom"
                        onClick={() => {
                            messagesEndRef.current?.scrollIntoView({
                                behavior: "smooth",
                            });
                        }}
                        pos="fixed"
                        bottom="6rem"
                        variant="darkContained"
                    >
                        <FontAwesomeIcon icon={faArrowDownLong} size="sm" />
                    </IconButton>
                </Tooltip>
            ) : null}

            <MessageInput
                emptyChat={chat.length === 0 && !isLoading}
                friendId={friendId}
                containerRef={containerRef}
                isConnected={hasConnected}
            />
        </VStack>
    );
}
