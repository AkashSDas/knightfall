import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { object, string } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../services/auth";

export type EmailSignupInputs = {
    email: string;
    username: string;
};

const schema = object({
    email: string({ required_error: "Required" }).email({
        message: "Invalid email",
    }),
    username: string({ required_error: "Required" })
        .min(2, { message: "Too short" })
        .max(256, { message: "Too long" }),
});

export function SignupForm() {
    const toast = useToast();
    const form = useForm<EmailSignupInputs>({
        defaultValues: { email: "", username: "" },
        resolver: zodResolver(schema),
    });

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
            >
                Create Account
            </Button>
        </VStack>
    );
}
