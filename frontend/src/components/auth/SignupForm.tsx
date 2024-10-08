import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { faChessKing } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { object, string, z } from "zod";

import { useButtonAnimatedIcon } from "@/hooks/ui";
import { authService } from "@/services/auth";

const inputSchema = object({
    email: string({ required_error: "Required" }).email({
        message: "Invalid email",
    }),
    username: string({ required_error: "Required" })
        .min(2, { message: "Too short" })
        .max(256, { message: "Too long" }),
});

export type EmailSignupInputs = z.infer<typeof inputSchema>;

export function SignupForm() {
    const toast = useToast();
    const form = useForm<EmailSignupInputs>({
        defaultValues: { email: "", username: "" },
        resolver: zodResolver(inputSchema),
    });

    const btn = useButtonAnimatedIcon();

    const mutation = useMutation({
        async mutationFn(payload: EmailSignupInputs) {
            const [, err] = await authService.emailSignup(payload);
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
                    description: "Login email is sent to your gmail",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
    });

    const createAccount = form.handleSubmit(
        async (data) => await mutation.mutateAsync(data)
    );

    return (
        <VStack as="form" gap="1rem" w="100%" onSubmit={createAccount}>
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

            <FormControl
                isInvalid={form.formState.errors.email ? true : false}
                mb="0.5rem"
                isRequired
            >
                <FormLabel fontSize="14px">Email</FormLabel>
                <Input
                    variant="contained"
                    {...form.register("email")}
                    placeholder="Enter email to login with"
                />
                <FormErrorMessage variant="solid" fontWeight="bold">
                    {form.formState.errors.email?.message}
                </FormErrorMessage>
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
                        icon={faChessKing}
                        size="sm"
                        bounce={btn.bounce}
                    />
                }
            >
                Create Account
            </Button>
        </VStack>
    );
}
