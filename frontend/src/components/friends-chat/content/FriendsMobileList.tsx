import {
    Button,
    Divider,
    HStack,
    Heading,
    IconButton,
    Tooltip,
    VStack,
    useBreakpointValue,
} from "@chakra-ui/react";
import {
    IconDefinition,
    faArrowLeft,
    faBan,
    faInbox,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppDispatch } from "@/hooks/store";
import {
    FriendsChatState,
    friendsChatActions,
} from "@/store/friends-chat/slice";

import { FriendsList } from "./FriendsList";

export function FriendsMobileList() {
    const dispatch = useAppDispatch();
    const isMd = useBreakpointValue({ base: false, md: true }, { ssr: false });

    function openContent(payload: FriendsChatState["mainContent"]) {
        dispatch(friendsChatActions.setMainContent(payload));
    }

    return (
        <VStack justifyContent="start" w="100%" px="1rem">
            {/* Header buttons */}

            {!isMd ? (
                <HStack alignItems="start" w="100%" my="2rem" gap="12px">
                    <Item
                        icon={faArrowLeft}
                        label="Back"
                        onClick={() => openContent({ type: "friendRequests" })}
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

            <VStack alignItems="start" w="100%" gap="1rem">
                <Heading
                    as="h3"
                    letterSpacing="1px"
                    fontSize="24px"
                    fontFamily="cubano"
                >
                    Friends
                </Heading>

                <Divider borderColor="gray.500" />

                <FriendsList />
            </VStack>
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
