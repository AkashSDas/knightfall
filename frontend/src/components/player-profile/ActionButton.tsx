import { Button, HStack, Text } from "@chakra-ui/react";
import { faCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import { useUser } from "@/hooks/auth";
import { useFriendManager } from "@/hooks/friend";

/**
 * A lot of actions here are same as search player list in search players page
 */
export function ActionButton(props: { friendUserId: string | undefined }) {
    const { friendUserId } = props;
    const navigate = useNavigate();
    const { isAuthenticated, pushToLogin } = useUser();
    const { getStatusForFriendRequest, sendRequest, friends } =
        useFriendManager();

    const friend = friends.find((f) => f.friend.id === friendUserId);
    const info = getStatusForFriendRequest(friendUserId ?? "");

    async function handleAddFriendClick() {
        if (!isAuthenticated) {
            pushToLogin();
        } else if (friendUserId) {
            await sendRequest.mutation({ userId: friendUserId });
        }
    }

    if (info === undefined) {
        return (
            <Button
                variant="primary"
                leftIcon={<FontAwesomeIcon icon={faPaperPlane} size="sm" />}
                minW={{ base: "100%", sm: "fit-content" }}
                isLoading={sendRequest.isPending}
                onClick={handleAddFriendClick}
            >
                Add Friend
            </Button>
        );
    }

    if (info !== undefined && info.type === "accepted") {
        return (
            <Button
                variant="primary"
                leftIcon={<FontAwesomeIcon icon={faPaperPlane} size="sm" />}
                minW={{ base: "100%", sm: "fit-content" }}
                onClick={() => {
                    navigate(`/friends?friend=${friend!.id}`);
                }}
            >
                Chat
            </Button>
        );
    }

    return (
        <HStack
            minW="fit-content"
            transition="all 300ms ease-in-out"
            border="1.5px solid"
            borderColor="red.600"
            px="12px"
            py="8px"
            fontSize="13px"
            borderRadius="6px"
            color="red.600"
            bgColor="gray.700"
        >
            <FontAwesomeIcon icon={faCircle} fade />

            <Text fontWeight="800">
                {info.status[0].toUpperCase() + info.status.slice(1)} friend
                request
            </Text>
        </HStack>
    );
}
