import {
    Box,
    Button,
    Center,
    Divider,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    Portal,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { faArrowCircleRight, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useButtonAnimatedIcon } from "../../hooks/ui";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { EmptyNotification } from "./EmptyNotification";
import {
    useListenToNotifications,
    useNotificationRoom,
    useNotifications,
} from "../../hooks/notification";
import { NotificationCard } from "./NotificationCard";

export function NotificationButton() {
    const btn = useButtonAnimatedIcon();
    const controls = useAnimation();
    const { notifications, isLoading } = useNotifications({ limit: 5 });

    useNotificationRoom();
    useListenToNotifications();

    return (
        <Menu
            onClose={() => {
                controls.start({ visibility: "hidden", opacity: 0, y: -10 });
            }}
        >
            <MenuButton
                as={IconButton}
                variant="ghost"
                onMouseEnter={btn.onHoverStart}
                onMouseLeave={btn.onHoverEnd}
                onClick={() => {
                    controls.start({ visibility: "visible", opacity: 1, y: 0 });
                }}
            >
                <FontAwesomeIcon icon={faBell} size="xl" shake={btn.bounce} />
            </MenuButton>

            <Portal>
                <AnimatePresence mode="wait">
                    <MenuList
                        as={motion.div}
                        initial={{ visibility: "hidden", opacity: 0, y: -10 }}
                        animate={controls}
                        bgColor="gray.700"
                        borderRadius="10px"
                        border={{ base: "1.5px solid", md: "2px solid" }}
                        borderColor={{ base: "gray.500", md: "gray.500" }}
                        w="400px"
                        p="1rem"
                        boxShadow="dark-lg"
                    >
                        <HStack justifyContent="space-between">
                            <Text fontWeight="800" fontSize="18px">
                                Notifications
                            </Text>

                            <Button
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
                        </HStack>

                        <Divider my="12px" />

                        {notifications.length === 0 && !isLoading ? (
                            <EmptyNotification />
                        ) : null}

                        {isLoading ? (
                            <Center my="2rem">
                                <Spinner
                                    size="xl"
                                    color="gray.500"
                                    thickness="4px"
                                />
                            </Center>
                        ) : null}

                        {notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                            />
                        ))}

                        <Divider my="12px" />

                        <Button
                            role="group"
                            as={Link}
                            to="/notifications"
                            rightIcon={
                                <Box
                                    as="span"
                                    transition="transform 0.2s"
                                    _groupHover={{
                                        transform: "translateX(5px)",
                                    }}
                                >
                                    <FontAwesomeIcon
                                        size="lg"
                                        icon={faArrowCircleRight}
                                    />
                                </Box>
                            }
                            variant="subtle"
                            w="100%"
                            h="38px"
                            fontSize="14px"
                            justifyContent="space-between"
                        >
                            View More
                        </Button>
                    </MenuList>
                </AnimatePresence>
            </Portal>
        </Menu>
    );
}
