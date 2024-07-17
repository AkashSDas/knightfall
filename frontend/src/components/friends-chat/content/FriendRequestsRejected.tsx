import {
    Avatar,
    Button,
    Divider,
    HStack,
    Heading,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useFriendManager } from "../../../hooks/friend";
import { Link } from "react-router-dom";
import { formatNotificationDate } from "../../../utils/datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

export function FriendRequestsRejected() {
    const { blockedRequestsQuery, rejectedRequestsQuery } = useFriendManager();

    return (
        <HStack
            w="100%"
            p="1rem"
            gap="1rem"
            alignItems="start"
            flexDirection={{ base: "column", md: "row" }}
        >
            <VStack
                alignItems="start"
                w={{ base: "100%", md: "50%" }}
                bgColor="gray.700"
                borderRadius="10px"
                border="2px solid"
                borderColor="gray.600"
                p="1rem"
                gap="1rem"
            >
                <Heading as="h2" fontFamily="cubano">
                    Blocked
                </Heading>

                <Text color="gray.300" fontSize="14px">
                    These are friend requests that you have rejected.
                </Text>

                <Divider borderColor="gray.500" />

                {blockedRequestsQuery.isPending ? (
                    <Spinner size="lg" thickness="3px" />
                ) : null}

                {blockedRequestsQuery.data?.length === 0 ? (
                    <VStack my="2rem" w="100%" color="gray.400">
                        <FontAwesomeIcon icon={faInbox} size="4x" />
                        <Text fontSize="1rem" fontWeight="500">
                            No blocked requests
                        </Text>
                    </VStack>
                ) : null}

                {blockedRequestsQuery.data?.map((request) => {
                    const { fromUser, createdAt } = request;

                    return (
                        <VStack
                            key={request.id}
                            my="12px"
                            w="100%"
                            alignItems="start"
                            gap="4px"
                        >
                            <HStack alignItems="start">
                                <Avatar
                                    as={Link}
                                    to={`/player/${fromUser.id}`}
                                    src={fromUser.profilePic.URL}
                                    h="24px"
                                    w="24px"
                                    objectFit="cover"
                                    border="1.5px solid black"
                                />

                                <Text fontWeight="600" color="gray.100">
                                    {fromUser.username}
                                </Text>
                            </HStack>

                            <Text color="gray.300" fontSize="13px">
                                {formatNotificationDate(createdAt)}
                            </Text>

                            <HStack mt="0.5rem">
                                <Button variant="success">Accept</Button>
                            </HStack>
                        </VStack>
                    );
                })}
            </VStack>

            <VStack
                alignItems="start"
                w={{ base: "100%", md: "50%" }}
                bgColor="gray.700"
                borderRadius="10px"
                border="2px solid"
                borderColor="gray.600"
                p="1rem"
                gap="1rem"
            >
                <Heading as="h2" fontFamily="cubano">
                    Rejected
                </Heading>

                <Text color="gray.300" fontSize="14px">
                    These are your friend requests that others rejected.
                </Text>

                <Divider borderColor="gray.500" />

                {rejectedRequestsQuery.isPending ? (
                    <Spinner size="lg" thickness="3px" />
                ) : null}

                {rejectedRequestsQuery.data?.length === 0 ? (
                    <VStack my="2rem" w="100%" color="gray.400">
                        <FontAwesomeIcon icon={faInbox} size="4x" />
                        <Text fontSize="1rem" fontWeight="500">
                            No rejected friend requests
                        </Text>
                    </VStack>
                ) : null}

                {rejectedRequestsQuery.data?.map((request) => {
                    const { toUser, createdAt } = request;

                    return (
                        <VStack
                            key={request.id}
                            my="12px"
                            w="100%"
                            alignItems="start"
                            gap="4px"
                        >
                            <HStack alignItems="start">
                                <Avatar
                                    as={Link}
                                    to={`/player/${toUser.id}`}
                                    src={toUser.profilePic.URL}
                                    h="24px"
                                    w="24px"
                                    objectFit="cover"
                                    border="1.5px solid black"
                                />

                                <Text fontWeight="600" color="gray.100">
                                    {toUser.username}
                                </Text>
                            </HStack>

                            <Text color="gray.300" fontSize="13px">
                                {formatNotificationDate(createdAt)}
                            </Text>
                        </VStack>
                    );
                })}
            </VStack>
        </HStack>
    );
}
