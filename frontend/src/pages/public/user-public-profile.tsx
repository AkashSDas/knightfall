import {
    Center,
    VStack,
    Spinner,
    Text,
    HStack,
    Image,
    Divider,
} from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { ChessBoardBackground } from "../../components/shared/chess-board-background/ChessBoardBackground";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa0, fa4 } from "@fortawesome/free-solid-svg-icons";
import { AchievementsBoard } from "../../components/player-profile/AchievementBoard";
import { ActionButton } from "../../components/player-profile/ActionButton";

export function UserPublicProfilePage() {
    const params = useParams();

    const { isLoading, data } = useQuery({
        enabled: typeof params.playerId === "string",
        queryKey: ["user", params.playerId],
        queryFn: () => userService.getPlayerProfile(params.playerId!),
        staleTime: 1000 * 60 * 5, // 5mins
    });

    return (
        <BaseLayout>
            <Center
                py="2rem"
                px="1rem"
                pos="relative"
                overflowX="hidden"
                overflowY="hidden"
                as="main"
            >
                <VStack
                    w="100%"
                    maxW="700px"
                    as="main"
                    alignItems="start"
                    gap="1rem"
                    zIndex={10}
                    my={{ base: "2rem", md: "4rem" }}
                >
                    {!isLoading && data === null ? (
                        <Center
                            w="100%"
                            fontSize="30px"
                            color="gray.200"
                            gap="1rem"
                        >
                            <HStack>
                                <FontAwesomeIcon icon={fa4} size="xl" bounce />
                                <FontAwesomeIcon icon={fa0} size="xl" bounce />
                                <FontAwesomeIcon icon={fa4} size="xl" bounce />
                            </HStack>

                            <Text
                                fontWeight="600"
                                fontFamily="cubano"
                                fontSize="40px"
                            >
                                Player not found
                            </Text>
                        </Center>
                    ) : null}

                    {isLoading ? (
                        <Center w="100%">
                            <Spinner size="xl" thickness="4px" />
                        </Center>
                    ) : (
                        <>
                            <HStack w="100%" gap={{ base: "12px", md: "1rem" }}>
                                <Image
                                    src={data?.profilePic.URL}
                                    alt="Profile pic"
                                    h="108px"
                                    w="108px"
                                    minW="108px"
                                    minH="108px"
                                    objectFit="cover"
                                    borderRadius="10px"
                                    border="2px solid"
                                    borderColor="black"
                                />

                                <Text
                                    fontSize="24px"
                                    fontWeight="700"
                                    color="gray.200"
                                    flexGrow={1}
                                    wordBreak="break-all"
                                >
                                    {data?.username}
                                </Text>

                                <ActionButton friendUserId={data?.id} />
                            </HStack>

                            <Divider borderColor="gray.600" />

                            <AchievementsBoard
                                achievements={data?.achievements ?? []}
                                rank={data?.rank ?? "Above 100"}
                                winPoints={data?.winPoints ?? 0}
                            />
                        </>
                    )}
                </VStack>

                <ChessBoardBackground h="140px" />
            </Center>
        </BaseLayout>
    );
}
