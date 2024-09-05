import { Button, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/services/auth";

export function CancelOAuthText(props: { email: string | null | undefined }) {
    const queryClient = useQueryClient();

    const cancelOAuthMutation = useMutation({
        async mutationFn() {
            await authService.cancelOAuthSignup();
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ["loggedInUser"] }),
                queryClient.refetchQueries({ queryKey: ["accessToken"] }),
            ]);
        },
    });

    return (
        <Text color="gray.300">
            Your Google account{" "}
            <Text as="span" fontWeight="700" color="gray.200">
                {props.email}
            </Text>{" "}
            will be connected to your new Knightfall account. Wrong identity?{" "}
            <Text
                color="blue.400"
                as={Button}
                bgColor="transparent"
                variant="text"
                border="none"
                p="0"
                h="fit-content"
                _hover={{
                    bgColor: "transparent",
                    textDecor: "underline",
                }}
                _active={{
                    bgColor: "transparent",
                    textDecor: "underline",
                }}
                fontWeight="700"
                cursor="pointer"
                onClick={() => {
                    cancelOAuthMutation.mutateAsync();
                }}
            >
                {cancelOAuthMutation.isPending ? "Cancelling..." : "Start over"}
            </Text>
        </Text>
    );
}
