import {
    Box,
    Button,
    Divider,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    Portal,
    Text,
} from "@chakra-ui/react";
import {
    faArrowCircleRight,
    faBell,
    faGhost,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useButtonAnimatedIcon } from "../../hooks/ui";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";

export function NotificationButton() {
    const btn = useButtonAnimatedIcon();
    const controls = useAnimation();

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
                                _hover={{
                                    bgColor: "blue.600",
                                }}
                                _active={{
                                    bgColor: "blue.600",
                                    borderBottom: "2px solid",
                                    borderBottomColor: "blue.700",
                                }}
                            >
                                Mark as read
                            </Button>
                        </HStack>

                        <Divider my="12px" />

                        <EmptyNotification />

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

function EmptyNotification() {
    return (
        <HStack
            color="gray.400"
            py="24px"
            w="100%"
            justifyContent="center"
            as={motion.div}
            initial={{ opacity: 0.7 }}
            animate={{
                opacity: 1,
                transition: {
                    duration: 0.5,
                    ease: "circInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                },
            }}
        >
            <FontAwesomeIcon icon={faGhost} size="2xl" />
            <Text fontSize="30px" fontFamily="cubano">
                Empty
            </Text>
        </HStack>
    );
}
