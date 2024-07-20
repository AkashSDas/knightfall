import {
    Avatar,
    Center,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    Spinner,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { object, string, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    faCircle,
    faCommentDots,
    faSearch,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useSearchPlayers } from "../../hooks/search";
import InfiniteScroll from "react-infinite-scroll-component";
import { getWinPointsSrc } from "../../utils/achievements";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFriendManager } from "../../hooks/friend";

const schema = object({ queryText: string({}).optional() });
export type SearchInputs = z.infer<typeof schema>;

export function SearchPlayersPage() {
    const form = useForm<SearchInputs>({
        defaultValues: { queryText: "" },
        resolver: zodResolver(schema),
    });
    const [searchText, setSearchText] = useState("");
    const { getStatusForFriendRequest, sendRequest, friends } =
        useFriendManager();
    const navigate = useNavigate();

    const {
        fetchMore,
        hasMore,
        isLoading,
        players,
        totalCount,
        isFetchingMore,
    } = useSearchPlayers({ searchText });

    const submit = form.handleSubmit((data) =>
        setSearchText(data.queryText ?? "")
    );

    return (
        <BaseLayout>
            <Center
                py="2rem"
                px="1rem"
                pos="relative"
                overflowX="hidden"
                overflowY="hidden"
                as="main"
                className="search-players-page"
            >
                <VStack
                    w="100%"
                    maxW="700px"
                    as="main"
                    alignItems="start"
                    gap="1rem"
                    zIndex={10}
                >
                    <HStack
                        as="form"
                        gap="1rem"
                        w="100%"
                        onSubmit={submit}
                        alignItems="end"
                    >
                        <FormControl
                            isInvalid={
                                form.formState.errors.queryText ? true : false
                            }
                            mb="0.5rem"
                        >
                            <FormLabel fontSize="14px">
                                Username or ID
                            </FormLabel>
                            <Input
                                variant="contained"
                                {...form.register("queryText")}
                                placeholder="Search player"
                            />
                            <FormErrorMessage variant="solid" fontWeight="bold">
                                {form.formState.errors.queryText?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <IconButton
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            h="48px"
                            w="fit-content"
                            as={motion.button}
                            mb="8px"
                            px="16px"
                            aria-label="Search"
                            borderBottomWidth="6px"
                            _hover={{ borderBottomWidth: "6px" }}
                            _active={{ borderBottomWidth: "2px" }}
                        >
                            <FontAwesomeIcon icon={faSearch} size="lg" />
                        </IconButton>
                    </HStack>

                    <InfiniteScroll
                        dataLength={totalCount}
                        next={fetchMore}
                        hasMore={hasMore}
                        style={{ width: "100%" }}
                        loader={
                            isFetchingMore ? (
                                <HStack
                                    w="100%"
                                    justifyContent="center"
                                    mb="2rem"
                                    mt="1rem"
                                >
                                    <Spinner />
                                </HStack>
                            ) : null
                        }
                        endMessage={
                            <HStack
                                w="100%"
                                justifyContent="center"
                                mb="2rem"
                                mt="1rem"
                            >
                                <Text
                                    textAlign="center"
                                    color="gray.500"
                                    fontWeight="500"
                                >
                                    {searchText.length === 0
                                        ? ""
                                        : players.length === 0
                                          ? "No results found"
                                          : "Yay! You have seen it all"}
                                </Text>
                            </HStack>
                        }
                    >
                        {players.map((player) => {
                            const friend = friends.find(
                                (f) => f.friend.id === player.id
                            );
                            const info = getStatusForFriendRequest(player.id);

                            return (
                                <HStack
                                    as={Link}
                                    to={`/player/${player.id}`}
                                    key={player.id}
                                    justifyContent="start"
                                    w="100%"
                                    px="12px"
                                    h="60px"
                                    borderRadius="10px"
                                    bgColor="gray.700"
                                    border="1.5px solid"
                                    borderColor="gray.600"
                                    cursor="pointer"
                                    mb="12px"
                                    transition="all 0.2s ease-in-out"
                                    role="group"
                                >
                                    <Avatar
                                        src={player.profilePic.URL}
                                        h="2rem"
                                        w="2rem"
                                        border="2px solid"
                                        borderColor="gray.900 !important"
                                    />

                                    <Tooltip
                                        label={player.username}
                                        openDelay={500}
                                    >
                                        <Text
                                            flexGrow={1}
                                            noOfLines={1}
                                            fontWeight="bold"
                                        >
                                            {player.username}
                                        </Text>
                                    </Tooltip>

                                    {info === undefined ? (
                                        <Tooltip
                                            label="Make friend"
                                            openDelay={500}
                                        >
                                            <IconButton
                                                as={motion.button}
                                                aria-label="Make friend"
                                                variant="ghost"
                                                isLoading={
                                                    sendRequest.isPending
                                                }
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await sendRequest.mutation({
                                                        userId: player.id,
                                                    });
                                                }}
                                                opacity={0}
                                                transition="all 300ms ease-in-out"
                                                _groupHover={{ opacity: 1 }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faUserPlus}
                                                    size="1x"
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}

                                    {info !== undefined &&
                                    info.type === "accepted" ? (
                                        <Tooltip label="Chat" openDelay={500}>
                                            <IconButton
                                                as={motion.button}
                                                aria-label="Make friend"
                                                variant="ghost"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    navigate(
                                                        `/friends?friend=${friend!.id}`
                                                    );
                                                }}
                                                opacity={0}
                                                transition="all 300ms ease-in-out"
                                                _groupHover={{ opacity: 1 }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCommentDots}
                                                    size="1x"
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}

                                    {info !== undefined &&
                                    info.type !== "accepted" ? (
                                        <Tooltip
                                            label="Friend request status"
                                            openDelay={500}
                                        >
                                            <HStack
                                                minW="fit-content"
                                                opacity={0}
                                                transition="all 300ms ease-in-out"
                                                _groupHover={{ opacity: 1 }}
                                                border="1.5px solid"
                                                borderColor="red.600"
                                                px="4px"
                                                py="4px"
                                                fontSize="11px"
                                                borderRadius="6px"
                                                color="red.600"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCircle}
                                                    bounce
                                                />

                                                <Text fontWeight="800">
                                                    {info.status[0].toUpperCase() +
                                                        info.status.slice(
                                                            1
                                                        )}{" "}
                                                    friend request
                                                </Text>
                                            </HStack>
                                        </Tooltip>
                                    ) : null}

                                    <Image
                                        src={getWinPointsSrc(player.winPoints)}
                                        mt="10px"
                                        h="45px"
                                        w="45px"
                                        objectFit="cover"
                                    />
                                </HStack>
                            );
                        })}
                    </InfiniteScroll>
                </VStack>
            </Center>
        </BaseLayout>
    );
}
