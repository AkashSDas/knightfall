import {
    Avatar,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { useSearchFriends } from "../../../hooks/friend";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { getWinPointsSrc } from "../../../utils/achievements";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const schema = z.object({
    queryText: z.string({}).min(2, "Too short").max(256, "Too long"),
});

export function SearchFriends() {
    const form = useForm<z.infer<typeof schema>>({
        defaultValues: { queryText: "" },
        resolver: zodResolver(schema),
    });

    const { changeSearchText, isLoading, friends } = useSearchFriends();

    const submit = form.handleSubmit((data) =>
        changeSearchText(data.queryText ?? "")
    );

    return (
        <VStack w="100%" p="1rem">
            <HStack
                as="form"
                gap="1rem"
                w="100%"
                onSubmit={submit}
                alignItems={form.formState.errors.queryText ? "center" : "end"}
            >
                <FormControl
                    isInvalid={form.formState.errors.queryText ? true : false}
                    mb="0.5rem"
                >
                    <FormLabel fontSize="14px">Username or ID</FormLabel>
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

            {friends.map((friend) => {
                return (
                    <HStack
                        as={Link}
                        to={`/player/${friend.friend.id}`}
                        key={friend.id}
                        justifyContent="start"
                        w="100%"
                        px="12px"
                        h="60px"
                        borderRadius="10px"
                        bgColor="gray.700"
                        border="1.5px solid"
                        borderColor="gray.600"
                        cursor="pointer"
                        role="grid"
                        mb="12px"
                        transition="all 0.2s ease-in-out"
                    >
                        <Avatar
                            src={friend.friend.profilePic.URL}
                            h="2rem"
                            w="2rem"
                            border="2px solid"
                            borderColor="gray.900 !important"
                        />

                        <Tooltip label={friend.friend.username} openDelay={500}>
                            <Text flexGrow={1} noOfLines={1} fontWeight="bold">
                                {friend.friend.username}
                            </Text>
                        </Tooltip>

                        <Image
                            src={getWinPointsSrc(friend.friend.winPoints)}
                            mt="10px"
                            h="45px"
                            w="45px"
                            objectFit="cover"
                        />
                    </HStack>
                );
            })}
        </VStack>
    );
}
