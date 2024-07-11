import { Center, HStack, Text, VStack } from "@chakra-ui/react";
import { Notification } from "../../services/notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

/** @example 'Jul 23, 2024 at 09:45 PM' */
function formatDate(date: Date): string {
    let time = date.toLocaleTimeString();

    if (time.includes(":")) {
        const [hours, minutes] = time.split(":");
        let hoursInt = parseInt(hours, 10);
        const ampm = hoursInt >= 12 ? "PM" : "AM";
        hoursInt = hoursInt % 12 || 12;
        time = `${hoursInt}:${minutes} ${ampm}`;
    }

    return `${date.toDateString()} at ${time}`;
}

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
                    {formatDate(notification.createdAt)}
                </Text>
            </VStack>
        </HStack>
    );
}
