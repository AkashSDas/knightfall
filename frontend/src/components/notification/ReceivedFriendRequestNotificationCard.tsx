import { HStack, Center, VStack, Text, Avatar, Button } from "@chakra-ui/react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Notification } from "../../services/notification";
import { formatNotificationDate } from "../../utils/datetime";
import { Link } from "react-router-dom";

export function ReceivedFriendRequestNotificationCard(props: {
    notification: Extract<
        Notification,
        { type: "receivedFriendRequest" | "acceptedFriendRequest" }
    >;
}) {
    const { notification } = props;

    return (
        <HStack
            py="4px"
            px="6px"
            borderRadius="10px"
            gap="10px"
            alignItems="start"
            w="100%"
        >
            <Center
                h="28px"
                w="28px"
                color={notification.seen ? "gray.500" : "red.500"}
            >
                <FontAwesomeIcon icon={faCircle} size="xs" />
            </Center>

            <VStack my="3px" w="100%" alignItems="start" gap="4px">
                <HStack alignItems="start">
                    <Avatar
                        as={Link}
                        to={`/player/${notification.metadata.userId}`}
                        src={notification.metadata.profilePicURL}
                        h="24px"
                        w="24px"
                        objectFit="cover"
                        border="1.5px solid black"
                    />

                    <Text fontWeight="600" color="gray.100">
                        {notification.title}
                    </Text>
                </HStack>

                <Text color="gray.300" fontSize="13px">
                    {formatNotificationDate(notification.createdAt)}
                </Text>

                {notification.type === "receivedFriendRequest" ? (
                    <HStack mt="0.5rem">
                        <Button variant="success">Accept</Button>
                        <Button variant="error">Reject</Button>
                    </HStack>
                ) : null}
            </VStack>
        </HStack>
    );
}
