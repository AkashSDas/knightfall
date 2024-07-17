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

export function FriendRequestsReceivedAndSent() {
    const { sentRequestsQuery, receivedRequestsQuery } = useFriendManager();

    return (
        <HStack w="100%" p="1rem" gap="1rem" alignItems="start">
            <VStack
                alignItems="start"
                w="50%"
                bgColor="gray.700"
                borderRadius="10px"
                border="2px solid"
                borderColor="gray.600"
                p="1rem"
                gap="1rem"
            >
                <Heading as="h2" fontFamily="cubano">
                    Received
                </Heading>

                <Divider borderColor="gray.500" />

                {receivedRequestsQuery.isPending ? (
                    <Spinner size="lg" thickness="3px" />
                ) : null}

                {receivedRequestsQuery.data?.length === 0 ? (
                    <VStack my="2rem" w="100%" color="gray.400">
                        <FontAwesomeIcon icon={faInbox} size="4x" />
                        <Text fontSize="1rem" fontWeight="500">
                            No received friend requests
                        </Text>
                    </VStack>
                ) : null}

                {receivedRequestsQuery.data?.map((request) => {
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
                                <Button variant="error">Reject</Button>
                            </HStack>
                        </VStack>
                    );
                })}
            </VStack>

            <VStack
                alignItems="start"
                w="50%"
                bgColor="gray.700"
                borderRadius="10px"
                border="2px solid"
                borderColor="gray.600"
                p="1rem"
                gap="1rem"
            >
                <Heading as="h2" fontFamily="cubano">
                    Sent
                </Heading>

                <Divider borderColor="gray.500" />

                {sentRequestsQuery.isPending ? (
                    <Spinner size="lg" thickness="3px" />
                ) : null}

                {sentRequestsQuery.data?.length === 0 ? (
                    <VStack my="2rem" w="100%" color="gray.400">
                        <FontAwesomeIcon icon={faInbox} size="4x" />
                        <Text fontSize="1rem" fontWeight="500">
                            No requests sent
                        </Text>
                    </VStack>
                ) : null}

                {sentRequestsQuery.data?.map((request) => {
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
