import {
    VStack,
    Tooltip,
    IconButton,
    Button,
    useBreakpointValue,
} from "@chakra-ui/react";
import {
    faAngleDoubleLeft,
    faBan,
    faGripLinesVertical,
    faInbox,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
    FriendsChatState,
    friendsChatActions,
    friendsChatSelectors,
} from "../../../store/friends-chat/slice";
import { useEffect } from "react";
import { FriendsList } from "../content/FriendsList";

export function Sidebar() {
    const controls = useAnimation();
    const { isSidebarOpen } = useAppSelector(
        friendsChatSelectors.selectSidebar
    );
    const dispatch = useAppDispatch();
    const isMd = useBreakpointValue({ base: false, md: true }, { ssr: false });

    function openContent(payload: FriendsChatState["mainContent"]) {
        dispatch(friendsChatActions.setMainContent(payload));
    }

    useEffect(
        function () {
            if (isMd) {
                // openContent({ type: "friends" });
                controls.start({
                    translateX: "0px",
                    transition: { ease: "easeInOut" },
                });
                dispatch(friendsChatActions.setSidebarOpen(true));
            } else {
                // openContent({ type: "friends" });
                controls.start({
                    translateX: "-240px",
                    transition: { ease: "easeInOut" },
                });
                dispatch(friendsChatActions.setSidebarOpen(false));
            }
        },
        [isMd]
    );

    if (!isMd) return null;

    return (
        <AnimatePresence mode="wait">
            <VStack
                alignItems="start"
                w={isMd ? "240px" : "0px"}
                bgColor="gray.700"
                borderRight="2px solid"
                borderRightColor="gray.600"
                h="calc(100vh - 72px)"
                pos="fixed"
                top={"72px"}
                left={0}
                as={motion.div}
                initial={{ translateX: "0" }}
                animate={controls}
                role="group"
                px="8px"
            >
                {isSidebarOpen ? null : (
                    <Tooltip
                        label={"Open sidebar"}
                        openDelay={200}
                        placement="right"
                    >
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
                                    transition: { ease: "easeInOut" },
                                });
                                dispatch(
                                    friendsChatActions.setSidebarOpen(true)
                                );
                            }}
                            minW="28px"
                            borderRadius="6px"
                        >
                            <FontAwesomeIcon
                                icon={faGripLinesVertical}
                                size="sm"
                            />
                        </IconButton>
                    </Tooltip>
                )}

                {!isSidebarOpen ? null : (
                    <>
                        <Tooltip
                            label={"Close sidebar"}
                            openDelay={200}
                            placement="right"
                        >
                            <IconButton
                                opacity={0}
                                _groupHover={{ opacity: isSidebarOpen ? 1 : 0 }}
                                pointerEvents={
                                    isSidebarOpen ? "initial" : "none"
                                }
                                variant="ghost"
                                aria-label="Close sidebar"
                                color="gray.200"
                                h="28px"
                                right="4px"
                                top="4px"
                                borderRadius="8px"
                                px="8px"
                                pos="absolute"
                                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                                _active={{ bgColor: "gray.600" }}
                                onClick={() => {
                                    controls.start({
                                        translateX: "-200px",
                                        transition: { ease: "easeInOut" },
                                    });
                                    dispatch(
                                        friendsChatActions.setSidebarOpen(false)
                                    );
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faAngleDoubleLeft}
                                    size="sm"
                                />
                            </IconButton>
                        </Tooltip>

                        {/* Top content */}

                        <VStack alignItems="start" w="100%" my="2rem" gap={0}>
                            <Tooltip
                                label="Search your friends"
                                openDelay={200}
                                placement="right"
                            >
                                <Button
                                    variant="ghost"
                                    leftIcon={
                                        <FontAwesomeIcon
                                            icon={faSearch}
                                            size="sm"
                                            style={{ marginRight: "8px" }}
                                        />
                                    }
                                    fontSize="16px"
                                    w="100%"
                                    _active={{ bgColor: "gray.600" }}
                                    justifyContent="start"
                                    transition="all 0.2s ease-in-out"
                                    h="38px"
                                    borderRadius="8px"
                                    onClick={() =>
                                        openContent({ type: "search" })
                                    }
                                >
                                    Search
                                </Button>
                            </Tooltip>

                            <Tooltip
                                label="Inbox"
                                openDelay={200}
                                placement="right"
                            >
                                <Button
                                    variant="ghost"
                                    leftIcon={
                                        <FontAwesomeIcon
                                            icon={faInbox}
                                            size="sm"
                                            style={{ marginRight: "8px" }}
                                        />
                                    }
                                    fontSize="16px"
                                    w="100%"
                                    _active={{ bgColor: "gray.600" }}
                                    justifyContent="start"
                                    h="38px"
                                    borderRadius="8px"
                                    onClick={() =>
                                        openContent({ type: "friendRequests" })
                                    }
                                >
                                    Friend Requests
                                </Button>
                            </Tooltip>

                            <Tooltip
                                label="Blocked users"
                                openDelay={200}
                                placement="right"
                            >
                                <Button
                                    variant="ghost"
                                    leftIcon={
                                        <FontAwesomeIcon
                                            icon={faBan}
                                            size="sm"
                                            style={{ marginRight: "8px" }}
                                        />
                                    }
                                    fontSize="16px"
                                    w="100%"
                                    _active={{ bgColor: "gray.600" }}
                                    justifyContent="start"
                                    h="38px"
                                    borderRadius="8px"
                                    onClick={() =>
                                        openContent({ type: "blocked" })
                                    }
                                >
                                    Blocked
                                </Button>
                            </Tooltip>
                        </VStack>

                        <FriendsList />
                    </>
                )}
            </VStack>
        </AnimatePresence>
    );
}
