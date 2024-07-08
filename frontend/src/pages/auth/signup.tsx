import {
    Button,
    Center,
    Divider,
    HStack,
    Heading,
    Image,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import LogoChip from "../../assets/images/text-logo-chip.svg";
import GoogleSvg from "../../assets/images/google.svg";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { OAUTH_REDIRECT_INFO, OAUTH_REDIRECT_INFO_KEY } from "../../utils/auth";
import { SignupForm } from "../../components/auth/SignupForm";

function openSignupWindow(): void {
    window.open(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup/google`,
        "_self"
    );
}

export function SignupPage() {
    const toast = useToast();
    const [searchParams] = useSearchParams();

    useEffect(
        function checkForSuccessfulSignup() {
            switch (searchParams.get(OAUTH_REDIRECT_INFO_KEY)) {
                case OAUTH_REDIRECT_INFO.signupSuccess:
                    toast({
                        id: OAUTH_REDIRECT_INFO.signupSuccess,
                        title: "Success",
                        description: "Login email is sent to your gmail",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
            }
        },
        [searchParams, toast]
    );

    return (
        <BaseLayout>
            <Center mt="2rem" as="main" px="1rem">
                <VStack
                    bgColor="gray.700"
                    borderRadius="10px"
                    border={{ base: "1.5px solid", md: "2px solid" }}
                    borderColor={{ base: "gray.500", md: "gray.500" }}
                    alignItems="start"
                    w="100%"
                    maxW="600px"
                    gap={{ base: "18px", md: "2rem" }}
                    p={{ base: "12px", md: "2rem" }}
                    shadow="lg"
                >
                    <VStack alignItems="start" gap="1rem">
                        <Heading as="h1" fontFamily="cubano">
                            Signup
                        </Heading>

                        <Text
                            display="flex"
                            gap="8px"
                            alignItems="center"
                            color="gray.300"
                        >
                            Create an account on{" "}
                            <Image
                                src={LogoChip}
                                alt="Knightfall"
                                display="inline-block"
                                h="20px"
                            />
                        </Text>
                    </VStack>

                    <Button
                        variant="contained"
                        leftIcon={<Image src={GoogleSvg} alt="Google" />}
                        h="48px"
                        w="100%"
                        aria-label="Signup with Google"
                        onMouseDown={openSignupWindow}
                        onClick={openSignupWindow}
                    >
                        Continue with Google
                    </Button>

                    <HStack w="100%">
                        <Divider w="100%" borderStyle="dashed" />
                        <Text fontFamily="cubano">OR</Text>
                        <Divider w="100%" borderStyle="dashed" />
                    </HStack>

                    <SignupForm />
                </VStack>
            </Center>
        </BaseLayout>
    );
}
