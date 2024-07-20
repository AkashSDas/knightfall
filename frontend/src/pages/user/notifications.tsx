import {
    Button,
    Center,
    Divider,
    HStack,
    Heading,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../hooks/auth";
import {
    useListenToNotifications,
    useNotificationRoom,
    useNotifications,
} from "../../hooks/notification";
import { notificationService } from "../../services/notification";
import { EmptyNotification } from "../../components/notification/EmptyNotification";
import { NotificationCard } from "../../components/notification/NotificationCard";
import { AuthProtectedBaseLayout } from "../../components/shared/layout/AuthProtectedBaseLayout";
import { textShadowStyle } from "../../lib/chakra";
import { ChessBoardBackground } from "../../components/shared/chess-board-background/ChessBoardBackground";
import InfiniteScroll from "react-infinite-scroll-component";

export function NotificationsPage() {
    return (
        <AuthProtectedBaseLayout>
            <NotificationContent />
        </AuthProtectedBaseLayout>
    );
}

function NotificationContent() {
    const {
        notifications,
        isLoading,
        hasMore,
        isFetchingMore,
        totalCount,
        fetchMore,
    } = useNotifications({ limit: 10 });
    const hasUnseenMessage = notifications.some((n) => n.seen === false);
    const queryClient = useQueryClient();
    const { user } = useUser();

    const mutation = useMutation({
        mutationFn: () => notificationService.markAsSeen(),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["notifications", user?.id],
            });
        },
    });

    useNotificationRoom();
    useListenToNotifications();

    console.log({ totalCount, n: notifications.length, hasMore });

    return (
        <BaseLayout>
            <Center
                py="2rem"
                px="1rem"
                pos="relative"
                overflowX="hidden"
                overflowY="hidden"
                as="main"
                className="notification-page"
            >
                <VStack
                    w="100%"
                    maxW="700px"
                    as="main"
                    alignItems="start"
                    gap="1rem"
                    zIndex={10}
                >
                    <Heading
                        fontFamily="cubano"
                        as="h1"
                        letterSpacing="1px"
                        fontSize={{ base: "2.5rem", md: "3.5rem" }}
                        css={textShadowStyle}
                    >
                        Notifications
                    </Heading>

                    <Text color="gray.200">
                        All of the messages that you’ve received.
                    </Text>

                    <Button
                        isDisabled={mutation.isPending || !hasUnseenMessage}
                        onClick={() => mutation.mutateAsync()}
                        isLoading={mutation.isPending}
                        fontFamily="body"
                        fontWeight="700"
                        h="34px"
                        fontSize="14px"
                        px="12px"
                        color="white"
                        borderRadius="7px"
                        borderBottom="4.5px solid"
                        borderBottomColor="blue.700"
                        bgColor="blue.500"
                        transition="background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-bottom-width 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        _hover={{ bgColor: "blue.600" }}
                        _active={{
                            bgColor: "blue.600",
                            borderBottom: "1px solid",
                            borderBottomColor: "blue.700",
                        }}
                    >
                        Mark as read
                    </Button>

                    <Divider borderColor="gray.500" />

                    {notifications.length === 0 && !isLoading ? (
                        <EmptyNotification />
                    ) : null}

                    {isLoading ? (
                        <Center my="2rem" w="100%">
                            <Spinner
                                size="xl"
                                color="gray.500"
                                thickness="4px"
                            />
                        </Center>
                    ) : null}

                    <InfiniteScroll
                        dataLength={totalCount}
                        next={fetchMore}
                        hasMore={hasMore}
                        style={{ width: "100%" }}
                        loader={
                            isFetchingMore ? (
                                <HStack
                                    w="100%"
                                    justifyContent="center"
                                    mb="2rem"
                                    mt="1rem"
                                >
                                    <Spinner />
                                </HStack>
                            ) : null
                        }
                        endMessage={
                            <HStack
                                w="100%"
                                justifyContent="center"
                                mb="2rem"
                                mt="1rem"
                            >
                                <Text
                                    textAlign="center"
                                    color="gray.300"
                                    fontWeight="500"
                                >
                                    {notifications.length === 0
                                        ? "No results found"
                                        : "Yay! You have seen it all"}
                                </Text>
                            </HStack>
                        }
                    >
                        {notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                            />
                        ))}
                    </InfiniteScroll>
                </VStack>

                <ChessBoardBackground h="140px" />
            </Center>
        </BaseLayout>
    );
}
