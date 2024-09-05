import { FormControl, HStack, IconButton, Input } from "@chakra-ui/react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { MutableRefObject, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "@/hooks/auth";
import { useFriendManager } from "@/hooks/friend";
import { SocketContext } from "@/lib/websocket";

const inputSchema = z.object({
    text: z.string({}).min(1, "Too short").max(256, "Too long"),
});

export function MessageInput(props: {
    emptyChat: boolean;
    friendId: string;
    isConnected: boolean;
    containerRef: MutableRefObject<HTMLDivElement | null>;
}) {
    const { user } = useUser();
    const form = useForm<z.infer<typeof inputSchema>>({
        defaultValues: { text: "" },
        resolver: zodResolver(inputSchema),
    });
    const { friends } = useFriendManager();
    const { socket } = useContext(SocketContext);

    const submit = form.handleSubmit(({ text }) => {
        socket?.emit("directMessage", {
            room: `dm_${props.friendId}`,
            text,
            senderUserId: user?.id,
            friendId: props.friendId,
        });

        form.reset();
    });

    const [childWidth, setChildWidth] = useState(700);

    const updateChildWidth = () => {
        if (props.containerRef.current) {
            const containerWidth = props.containerRef.current.offsetWidth;
            setChildWidth(Math.min(containerWidth, 700)); // Example: 90% of container width
        }
    };

    const username = friends.find((f) => f.id === props.friendId)?.friend
        .username;

    useEffect(function onWindowResizeChangeInputWidth() {
        updateChildWidth();
        window.addEventListener("resize", updateChildWidth);

        return () => window.removeEventListener("resize", updateChildWidth);
    }, []);

    return (
        <HStack
            as="form"
            gap="1rem"
            px="1rem"
            pb="1rem"
            w="100%"
            maxW={`${childWidth}px`}
            onSubmit={submit}
            alignItems="center"
            pos="fixed"
            bottom={0}
            bgColor="gray.800"
        >
            <FormControl
                isInvalid={form.formState.errors.text ? true : false}
                mb="0.5rem"
            >
                <Input
                    variant="contained"
                    {...form.register("text")}
                    autoComplete="off"
                    placeholder={
                        props.emptyChat
                            ? `Start conversation with ${username}`
                            : `Send message to ${username}`
                    }
                />
            </FormControl>

            <IconButton
                type="submit"
                variant="primary"
                h="48px"
                w="fit-content"
                as={motion.button}
                mb="8px"
                px="16px"
                aria-label="Search"
                borderBottomWidth="6px"
                _hover={{ borderBottomWidth: "6px" }}
                _active={{ borderBottomWidth: "2px" }}
                disabled={!props.isConnected}
            >
                <FontAwesomeIcon icon={faPaperPlane} size="lg" />
            </IconButton>
        </HStack>
    );
}
