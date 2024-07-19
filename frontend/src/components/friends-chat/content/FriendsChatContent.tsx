import {
    Button,
    HStack,
    IconButton,
    Tooltip,
    VStack,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { FriendRequestsReceivedAndSent } from "./FriendRequestsReceivedAndSent";
import { FriendRequestsRejected } from "./FriendRequestsRejected";
import {
    FriendsChatState,
    friendsChatActions,
} from "../../../store/friends-chat/slice";
import {
    faArrowLeft,
    faSearch,
    faInbox,
    faBan,
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FriendsList } from "./FriendsList";
import { SearchFriends } from "./SearchFriends";
import { ChatRoom } from "../direct-message/ChatRoom";

export function FriendsChatContent() {
    const dispatch = useAppDispatch();
    const isMd = useBreakpointValue({ base: false, md: true }, { ssr: false });

    const { type } = useAppSelector((state) => state.friendsChat.mainContent);

    function openContent(payload: FriendsChatState["mainContent"]) {
        dispatch(friendsChatActions.setMainContent(payload));
    }

    return (
        <VStack justifyContent="start" w="100%">
            {/* Header buttons */}

            {!isMd ? (
                <HStack
                    alignItems="start"
                    w="100%"
                    pt="2rem"
                    pb="1rem"
                    gap="12px"
                    px="1rem"
                    pos={type === "chat" ? "fixed" : "unset"}
                    zIndex={10}
                    bgColor="gray.800"
                >
                    <Item
                        icon={faArrowLeft}
                        label="Back"
                        onClick={() => openContent({ type: "friends" })}
                    />

                    <Item
                        icon={faSearch}
                        label="Search"
                        onClick={() => openContent({ type: "search" })}
                    />

                    <Item
                        icon={faInbox}
                        label="Requests"
                        onClick={() => openContent({ type: "friendRequests" })}
                    />

                    <Item
                        icon={faBan}
                        label="Blocked"
                        onClick={() => openContent({ type: "blocked" })}
                    />
                </HStack>
            ) : null}

            <Content />
        </VStack>
    );
}

function Item(props: {
    icon: IconDefinition;
    onClick: () => void;
    label: string;
}) {
    const isMd = useBreakpointValue({ base: false, md: true }, { ssr: false });

    if (isMd) {
        return (
            <Button
                flexGrow={1}
                variant="darkContained"
                leftIcon={
                    <FontAwesomeIcon
                        icon={props.icon}
                        size="sm"
                        style={{ marginRight: "8px" }}
                    />
                }
                fontSize="14px"
                w="100%"
                justifyContent="start"
                transition="all 0.2s ease-in-out"
                h="38px"
                borderRadius="8px"
                onClick={props.onClick}
            >
                {props.label}
            </Button>
        );
    } else {
        return (
            <Tooltip label={props.label} openDelay={200}>
                <IconButton
                    aria-label={props.label}
                    flexGrow={1}
                    variant="darkContained"
                    w="100%"
                    transition="all 0.2s ease-in-out"
                    h="38px"
                    borderRadius="8px"
                    onClick={props.onClick}
                >
                    <FontAwesomeIcon icon={props.icon} size="1x" />
                </IconButton>
            </Tooltip>
        );
    }
}

function Content() {
    const { mainContent: content, isSidebarOpen } = useAppSelector(
        (state) => state.friendsChat
    );

    switch (content.type) {
        case "chat":
            return <ChatRoom />;
        case "search":
            return <SearchFriends />;
        case "friendRequests":
            return <FriendRequestsReceivedAndSent />;
        case "blocked":
            return <FriendRequestsRejected />;
        default:
            return isSidebarOpen ? null : <FriendsList />;
    }
}
