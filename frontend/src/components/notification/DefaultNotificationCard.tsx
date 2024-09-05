import { Center, HStack, Text, VStack } from "@chakra-ui/react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { formatNotificationDate } from "@/utils/datetime";
import { type Notification } from "@/utils/schemas";

export function DefaultNotificationCard(props: {
    notification: Extract<
        Notification,
        { type: "default" | "loginWelcomeBack" | "signupWelcome" }
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

            <VStack my="3px" w="100%" alignItems="start" gap="2px">
                <Text fontWeight="600" color="gray.100">
                    {notification.title}
                </Text>

                <Text color="gray.300" fontSize="13px">
                    {formatNotificationDate(notification.createdAt)}
                </Text>
            </VStack>
        </HStack>
    );
}
