import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Image,
    Input,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "../../../hooks/auth";
import { useAppToast } from "../../../hooks/ui";
import { userService } from "../../../services/user";

export type ProfileInputs = {
    username: string;
    email: string;
};

const defaultValues: ProfileInputs = {
    username: "",
    email: "",
};

const schema = z.object({
    username: z.string().min(3, { message: "Too short" }).optional(),
    email: z.string().email({ message: "Invalid" }).optional(),
});

export function UpdateUserProfileForm() {
    const imgRef = useRef<HTMLInputElement>(null);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const { user, isAuthenticated } = useUser();
    const form = useForm<ProfileInputs>({
        defaultValues,
        resolver: zodResolver(schema),
    });
    const { errorToast, successToast } = useAppToast();

    const update = useMutation({
        mutationFn: (payload: ProfileInputs) => {
            const formData = new FormData();

            formData.append("username", payload.username);
            if (profilePic) {
                formData.append("profilePic", profilePic);
            }

            return userService.patchLoggedInUserProfile(formData);
        },
        onSuccess(data, _variables, _context) {
            const [ok, err] = data;

            if (err || !ok) {
                errorToast(err?.message ?? "Failed to update profile");
            } else {
                successToast("Porfile update");
            }
        },
        onError(error, _variables, _context) {
            errorToast(error.message);
        },
    });

    const formSubmit = form.handleSubmit(
        async (data) => await update.mutateAsync(data)
    );

    useEffect(
        function initUpdateProfile() {
            if (isAuthenticated) {
                form.setValue("username", user?.username ?? "");
                form.setValue("email", user?.email ?? "");
            }
        },
        [isAuthenticated]
    );

    if (!isAuthenticated) return null;

    return (
        <VStack alignItems="start">
            <Box pos="relative">
                <Image
                    src={
                        (profilePic && URL.createObjectURL(profilePic)) ??
                        user?.profilePic?.URL
                    }
                    alt="Profile pic"
                    h="160px"
                    w="160px"
                    objectFit="cover"
                    borderRadius="10px"
                    border="4px solid"
                    borderColor="gray.700"
                />

                <Tooltip label="Change profile picture" openDelay={500}>
                    <IconButton
                        aria-label="Open image uploader"
                        onClick={() => imgRef.current?.click()}
                        variant="contained"
                        shadow="dark-lg"
                        pos="absolute"
                        bottom="8px"
                        right="8px"
                        borderBottomWidth="4px"
                        _hover={{ borderBottomWidth: "4px" }}
                        _active={{ borderBottomWidth: "1px" }}
                    >
                        <FontAwesomeIcon icon={faCamera} size="lg" />
                    </IconButton>
                </Tooltip>

                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={imgRef}
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setProfilePic(e.target.files[0]!);
                        }
                    }}
                />
            </Box>

            <VStack
                as="form"
                gap="1rem"
                w="100%"
                onSubmit={formSubmit}
                mt="24px"
            >
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
                        disabled
                    />
                    <FormErrorMessage variant="solid" fontWeight="bold">
                        {form.formState.errors.email?.message}
                    </FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={update.isPending}
                    h="48px"
                    w="100%"
                >
                    Save
                </Button>
            </VStack>
        </VStack>
    );
}
