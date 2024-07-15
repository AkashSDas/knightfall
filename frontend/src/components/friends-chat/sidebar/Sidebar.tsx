import { VStack, Tooltip, IconButton, Text } from "@chakra-ui/react";
import {
    faAngleDoubleLeft,
    faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
    friendsChatActions,
    friendsChatSelectors,
} from "../../../store/friends-chat/slice";

export function Sidebar() {
    const controls = useAnimation();
    const { isSidebarOpen } = useAppSelector(
        friendsChatSelectors.selectSidebar
    );
    const dispatch = useAppDispatch();

    return (
        <AnimatePresence mode="wait">
            <VStack
                alignItems="start"
                w="400px"
                bgColor="gray.700"
                borderRight="2px solid"
                borderRightColor="gray.600"
                h="calc(100vh - 72px)"
                pos="absolute"
                top={"72px"}
                left={0}
                as={motion.div}
                initial={{ translateX: "0" }}
                animate={controls}
                role="group"
                px="40px"
            >
                <Text>Hello</Text>

                <Tooltip label={"Close sidebar"} openDelay={500}>
                    <IconButton
                        opacity={0}
                        _groupHover={{ opacity: isSidebarOpen ? 1 : 0 }}
                        pointerEvents={isSidebarOpen ? "initial" : "none"}
                        variant="ghost"
                        aria-label="Close sidebar"
                        color="gray.200"
                        h="38px"
                        right="4px"
                        top="4px"
                        pos="absolute"
                        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        _active={{ bgColor: "gray.600" }}
                        onClick={() => {
                            controls.start({
                                translateX: "-360px",
                                transition: {
                                    ease: "easeInOut",
                                },
                            });
                            dispatch(friendsChatActions.setSidebarOpen(false));
                        }}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleLeft} size="sm" />
                    </IconButton>
                </Tooltip>

                <Tooltip label={"Open sidebar"} openDelay={500}>
                    <IconButton
                        opacity={isSidebarOpen ? 0 : 1}
                        pointerEvents={!isSidebarOpen ? "initial" : "none"}
                        variant="ghost"
                        aria-label="Close sidebar"
                        color="gray.200"
                        h="38px"
                        right="4px"
                        top="50%"
                        pos="absolute"
                        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        _active={{ bgColor: "gray.600" }}
                        onClick={() => {
                            controls.start({
                                translateX: "0px",
                                transition: {
                                    ease: "easeInOut",
                                },
                            });
                            dispatch(friendsChatActions.setSidebarOpen(true));
                        }}
                        minW="28px"
                        borderRadius="6px"
                    >
                        <FontAwesomeIcon icon={faGripLinesVertical} size="sm" />
                    </IconButton>
                </Tooltip>
            </VStack>
        </AnimatePresence>
    );
}
