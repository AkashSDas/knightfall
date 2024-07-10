import {
    Button,
    Divider,
    HStack,
    Heading,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { SignupForm } from "../../components/auth/SignupForm";
import { useUser } from "../../hooks/auth";
import { CancelOAuthText } from "../../components/auth/CancelOAuthText";
import { CompleteOAuthSignupForm } from "../../components/auth/CompleteOAuthSignupForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChessBoardBackground } from "../../components/shared/chess-board-background/ChessBoardBackground";
import GoogleSvg from "../../assets/images/google.svg";

function openSignupWindow(): void {
    window.open(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup/google`,
        "_self"
    );
}

export function SignupPage() {
    const { isLoggedIn, user, isSignupCompleted } = useUser();
    const navigate = useNavigate();

    useEffect(
        function () {
            if (isSignupCompleted) {
                navigate("/");
            }
        },
        [isSignupCompleted, navigate]
    );

    return (
        <BaseLayout>
            <VStack
                as="main"
                py="2rem"
                px="1rem"
                h={{ base: "calc(100vh - 56px)", md: "calc(100vh - 72px)" }}
                overflowX="hidden"
                overflowY="auto"
                pos="relative"
            >
                <VStack
                    as={motion.main}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.2, duration: 0.5 },
                    }}
                    zIndex={10}
                    bgColor="gray.700"
                    borderRadius="10px"
                    border={{ base: "1.5px solid", md: "2px solid" }}
                    borderColor={{ base: "gray.500", md: "gray.500" }}
                    alignItems="start"
                    w="100%"
                    maxW="600px"
                    gap={{ base: "18px", md: "2rem" }}
                    p={{ base: "12px", md: "2rem" }}
                    shadow="dark-lg"
                >
                    <VStack alignItems="start" gap="1rem">
                        <Heading as="h1" fontFamily="cubano">
                            Signup
                        </Heading>

                        {!isLoggedIn ? (
                            <Text color="gray.300">
                                Create an account on{" "}
                                <Text
                                    as="span"
                                    fontWeight="700"
                                    color="gray.200"
                                >
                                    Knightfall
                                </Text>
                                .
                            </Text>
                        ) : (
                            <CancelOAuthText email={user?.email} />
                        )}
                    </VStack>

                    {!isLoggedIn ? (
                        <Button
                            variant="contained"
                            leftIcon={<Image src={GoogleSvg} alt="Google" />}
                            h="48px"
                            w="100%"
                            aria-label="Signup with Google"
                            onClick={openSignupWindow}
                        >
                            Continue with Google
                        </Button>
                    ) : null}

                    {!isLoggedIn ? (
                        <HStack w="100%">
                            <Divider w="100%" borderStyle="dashed" />
                            <Text fontFamily="cubano">OR</Text>
                            <Divider w="100%" borderStyle="dashed" />
                        </HStack>
                    ) : null}

                    {!isLoggedIn ? <SignupForm /> : <CompleteOAuthSignupForm />}
                </VStack>

                <ChessBoardBackground
                    h={{ base: "calc(100vh - 56px)", md: "calc(100vh - 72px)" }}
                />
            </VStack>
        </BaseLayout>
    );
}
