import { FormControl, HStack, IconButton, Input } from "@chakra-ui/react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { MutableRefObject, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    text: z.string({}).min(1, "Too short").max(256, "Too long"),
});

export function MessageInput(props: {
    containerRef: MutableRefObject<HTMLDivElement | null>;
}) {
    const form = useForm<z.infer<typeof schema>>({
        defaultValues: { text: "" },
        resolver: zodResolver(schema),
    });

    const submit = form.handleSubmit(() => {
        // TODO
    });

    const [childWidth, setChildWidth] = useState(700);

    const updateChildWidth = () => {
        if (props.containerRef.current) {
            const containerWidth = props.containerRef.current.offsetWidth;
            setChildWidth(Math.min(containerWidth, 700)); // Example: 90% of container width
        }
    };

    useEffect(() => {
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
                    placeholder="Message"
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
            >
                <FontAwesomeIcon icon={faPaperPlane} size="lg" />
            </IconButton>
        </HStack>
    );
}
