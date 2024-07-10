import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { object, string, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../services/auth";
import { useAppToast, useButtonAnimatedIcon } from "../../hooks/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faChessKnight } from "@fortawesome/free-solid-svg-icons";

const schema = object({
    email: string({ required_error: "Required" }).email({
        message: "Invalid email",
    }),
});

export type EmailLoginInputs = z.infer<typeof schema>;

export function LoginForm() {
    const form = useForm<EmailLoginInputs>({
        defaultValues: { email: "" },
        resolver: zodResolver(schema),
    });
    const { errorToast, successToast } = useAppToast();

    const btn = useButtonAnimatedIcon();

    const mutation = useMutation({
        async mutationFn(payload: EmailLoginInputs) {
            const [, err] = await authService.emailLogin(payload);
            if (err) {
                errorToast(err.message);
            } else {
                successToast("Login email is sent to your gmail");
            }
        },
    });

    const login = form.handleSubmit(
        async (data) => await mutation.mutateAsync(data)
    );

    return (
        <VStack as="form" gap="1rem" w="100%" onSubmit={login}>
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
                        icon={faChessKnight}
                        size="sm"
                        bounce={btn.bounce}
                    />
                }
            >
                Login
            </Button>
        </VStack>
    );
}
