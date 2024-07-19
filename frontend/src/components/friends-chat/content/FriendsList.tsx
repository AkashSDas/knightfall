import {
    Avatar,
    Center,
    Divider,
    HStack,
    Heading,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { useFriendManager } from "../../../hooks/friend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { friendsChatActions } from "../../../store/friends-chat/slice";

export function FriendsList() {
    const { friends } = useFriendManager();
    const { isSidebarOpen } = useAppSelector((state) => state.friendsChat);
    const dispatch = useAppDispatch();

    return (
        <VStack
            alignItems="start"
            w="100%"
            px={isSidebarOpen ? "0px" : "1rem"}
            gap="12px"
        >
            <Heading
                as="h3"
                letterSpacing="1px"
                fontSize="24px"
                fontFamily="cubano"
            >
                Friends
            </Heading>

            <Divider borderColor="gray.500" />

            <VStack alignItems="start" w="100%">
                {friends.map((friend) => {
                    return (
                        <Tooltip
                            label={friend.friend.username}
                            openDelay={300}
                            key={friend.id}
                            placement="right"
                        >
                            <HStack
                                w="100%"
                                cursor="pointer"
                                p="8px"
                                borderRadius="10px"
                                transition="transform 0.3s ease-in-out"
                                _hover={{ bgColor: "gray.600" }}
                                _active={{ bgColor: "gray.600" }}
                                onClick={() => {
                                    dispatch(
                                        friendsChatActions.setMainContent({
                                            type: "chat",
                                            friendId: friend.id,
                                        })
                                    );
                                }}
                            >
                                <Avatar
                                    src={friend.friend.profilePic.URL}
                                    h="30px"
                                    w="30px"
                                    border="2px solid #303230"
                                    boxShadow="0px 0px 0px 2px #616261"
                                    objectFit="cover"
                                />

                                <Text
                                    color="gray.200"
                                    fontWeight="600"
                                    noOfLines={1}
                                    flexGrow={1}
                                >
                                    {friend.friend.username}
                                </Text>

                                <Center
                                    w="18px"
                                    h="18px"
                                    color="gray.400"
                                    fontSize="11px"
                                >
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        aria-label="User active status"
                                    />
                                </Center>
                            </HStack>
                        </Tooltip>
                    );
                })}
            </VStack>
        </VStack>
    );
}
