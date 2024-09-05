import { Avatar, HStack, Text } from "@chakra-ui/react";

import { useFetchMatch } from "../../hooks/match";

export function PlayerInfo(props: {
    player:
        | NonNullable<ReturnType<typeof useFetchMatch>["players"]>["opponent"]
        | NonNullable<ReturnType<typeof useFetchMatch>["players"]>["me"];
}) {
    const { player } = props;

    return (
        <HStack
            w="100%"
            h="50px"
            borderRadius="12px"
            border="2px solid"
            borderColor="gray.600"
            bgColor="gray.700"
            py="8px"
            px="12px"
        >
            <Avatar
                src={player.user.profilePic.URL}
                name={player.user.username}
                size="md"
                boxSize="2rem"
                border="1.5px solid black"
                transition="all 0.2s ease-in-out"
            />

            <Text noOfLines={1} fontWeight="700" color="gray.200" flexGrow={1}>
                {player.user.username}
            </Text>
        </HStack>
    );
}
