import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { object, string, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../services/auth";
import { useUser } from "../../hooks/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useButtonAnimatedIcon } from "../../hooks/ui";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessQueen } from "@fortawesome/free-solid-svg-icons";

const schema = object({
    username: string({ required_error: "Required" })
        .min(2, { message: "Too short" })
        .max(256, { message: "Too long" }),
});

export type CompleteOAuthSignupInputs = z.infer<typeof schema>;

export function CompleteOAuthSignupForm() {
    const toast = useToast();
    const { user } = useUser();
    const form = useForm<CompleteOAuthSignupInputs>({
        defaultValues: { username: "" },
        resolver: zodResolver(schema),
    });
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const btn = useButtonAnimatedIcon();

    const mutation = useMutation({
        async mutationFn(payload: CompleteOAuthSignupInputs) {
            const [, err] = await authService.completeOAuthSignup(payload);
            if (err) {
                toast({
                    title: "Error",
                    description: err.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Success",
                    description: "Account created successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                navigate("/");
                await Promise.all([
                    queryClient.refetchQueries({ queryKey: ["loggedInUser"] }),
                    queryClient.refetchQueries({ queryKey: ["accessToken"] }),
                ]);
            }
        },
    });

    const completeOAuthSignup = form.handleSubmit(
        async (data) => await mutation.mutateAsync(data)
    );

    useEffect(
        function () {
            if (user?.username) {
                form.setValue("username", user.username);
            }
        },
        [user, form]
    );

    return (
        <VStack as="form" gap="1rem" w="100%" onSubmit={completeOAuthSignup}>
            <FormControl
                isInvalid={form.formState.errors.username ? true : false}
                mb="0.5rem"
                isRequired
            >
                <FormLabel fontSize="14px">Username</FormLabel>
                <Input
                    variant="contained"
                    {...form.register("username")}
                    placeholder="What to call you champion?"
                />
                <FormErrorMessage variant="solid" fontWeight="bold">
                    {form.formState.errors.username?.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl mb="0.5rem" isRequired>
                <FormLabel fontSize="14px">Email</FormLabel>
                <Input
                    variant="contained"
                    defaultValue={user?.email ?? ""}
                    disabled
                />
            </FormControl>

            <Button
                type="submit"
                variant="primary"
                isLoading={mutation.isPending}
                h="48px"
                w="100%"
                as={motion.button}
                onHoverStart={btn.onHoverStart}
                onHoverEnd={btn.onHoverEnd}
                leftIcon={
                    <FontAwesomeIcon
                        style={{ marginBottom: "2px" }}
                        icon={faChessQueen}
                        size="sm"
                        bounce={btn.bounce}
                    />
                }
            >
                Complete Signup
            </Button>
        </VStack>
    );
}
