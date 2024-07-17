import {
    Center,
    VStack,
    Spinner,
    Text,
    HStack,
    Image,
    Button,
    Divider,
    Heading,
    Wrap,
} from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { ChessBoardBackground } from "../../components/shared/chess-board-background/ChessBoardBackground";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetUserPublicProfile, userService } from "../../services/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    fa0,
    fa4,
    faPaperPlane,
    faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../hooks/auth";
import { useMemo } from "react";
import {
    getAchievementImages,
    getAchievementsBoardImages,
    getRankImageSrc,
    getWinPointsSrc,
} from "../../utils/achievements";
import { useFriendManager } from "../../hooks/friend";

export function UserPublicProfilePage() {
    const params = useParams();
    const { pushToLogin, isAuthenticated } = useUser();
    const { sendRequest } = useFriendManager();

    const { isLoading, data } = useQuery({
        enabled: typeof params.playerId === "string",
        queryKey: ["user", params.playerId],
        queryFn: () => userService.getPlayerProfile(params.playerId!),
        staleTime: 1000 * 60 * 5, // 5mins
    });

    async function handleAddFriendClick() {
        if (!isAuthenticated) {
            pushToLogin();
        } else if (data?.id) {
            await sendRequest.mutation({ userId: data.id });
        }
    }

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

                                <Button
                                    variant="primary"
                                    leftIcon={
                                        <FontAwesomeIcon
                                            icon={faPaperPlane}
                                            size="sm"
                                        />
                                    }
                                    minW="fit-content"
                                    isLoading={sendRequest.isPending}
                                    onClick={handleAddFriendClick}
                                >
                                    Add Friend
                                </Button>
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

function AchievementsBoard(
    props: Pick<
        GetUserPublicProfile["user"],
        "achievements" | "rank" | "winPoints"
    >
) {
    const { achievements, rank, winPoints } = props;
    const imgs: string[] = useMemo(
        function (): string[] {
            const imgs: string[] = [];

            imgs.push(getWinPointsSrc(winPoints));

            const rankImg = getRankImageSrc(rank);
            if (rankImg) imgs.push(rankImg);

            const achivementImg = getAchievementImages(achievements);
            imgs.push(...achivementImg);

            return imgs;
        },
        [achievements, rank, winPoints]
    );

    const allImgs = useMemo(
        function (): { src: string; isAchievement: boolean }[] {
            let initImgs = getAchievementsBoardImages();

            // Push all of the images in 'imgs' in front of 'initImgs'
            // and remove duplicates
            initImgs = [...imgs, ...initImgs].filter(
                (value, index, self) => self.indexOf(value) === index
            );

            console.log({ imgs, initImgs });

            return initImgs.map((img) => {
                return {
                    src: img,
                    isAchievement: imgs.includes(img),
                };
            });
        },
        [imgs]
    );

    return (
        <VStack alignItems="start" gap="12px" p={{ base: "10px", md: "1rem" }}>
            <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                textAlign="center"
            >
                Achievements{" "}
                <Text fontSize="13px" as="span" color="gray.300">
                    (
                    <FontAwesomeIcon icon={faTrophy} size="sm" bounce />{" "}
                    {achievements.length + 2}/{allImgs.length})
                </Text>
            </Heading>

            <Wrap px="24px" py="1rem" borderRadius="10px" bgColor="gray.700">
                {allImgs.map((img) => {
                    return (
                        <Image
                            src={img.src}
                            alt="Achievement"
                            key={img.src}
                            h="80px"
                            w="80px"
                            objectFit="cover"
                            filter={!img.isAchievement ? "grayscale(100%)" : ""}
                            opacity={!img.isAchievement ? 0.5 : 1}
                        />
                    );
                })}
            </Wrap>
        </VStack>
    );
}
