import {
    Button,
    Divider,
    HStack,
    Heading,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import GoogleSvg from "@/assets/images/google.svg";
import { LoginForm } from "@/components/auth/LogintForm";
import { ChessBoardBackground } from "@/components/shared/chess-board-background/ChessBoardBackground";
import { BaseLayout } from "@/components/shared/layout/BaseLayout";
import { useMagicLinkLogin } from "@/hooks/auth";
import { useAppToast } from "@/hooks/ui";
import {
    OAUTH_LOGIN_FAILED_PARAM_KEY,
    OAUTH_LOGIN_FAILED_PARAM_VALUE,
} from "@/utils/auth";
import { envVariables } from "@/utils/env";

function openLoginWindow(): void {
    window.open(
        `${envVariables.VITE_BACKEND_URL}/api/auth/login/google`,
        "_self"
    );
}

export function LoginPage() {
    useMagicLinkLogin();
    const { errorToast } = useAppToast();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(
        function checkForIncompleteSignup() {
            const loginInfo = searchParams.get(OAUTH_LOGIN_FAILED_PARAM_KEY);

            if (
                typeof loginInfo === "string" &&
                loginInfo === OAUTH_LOGIN_FAILED_PARAM_VALUE
            ) {
                errorToast("Account doesn't exist or signup is incomplete");
                searchParams.delete(OAUTH_LOGIN_FAILED_PARAM_KEY);
                setSearchParams(searchParams);
            }
        },
        [searchParams]
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
                            Login
                        </Heading>
                        <Text color="gray.300">
                            Welcome back to{" "}
                            <Text as="span" fontWeight="700" color="gray.200">
                                Knightfall
                            </Text>
                            .
                        </Text>
                    </VStack>

                    <Button
                        variant="contained"
                        leftIcon={<Image src={GoogleSvg} alt="Google" />}
                        h="48px"
                        w="100%"
                        aria-label="Signup with Google"
                        onClick={openLoginWindow}
                    >
                        Continue with Google
                    </Button>

                    <HStack w="100%">
                        <Divider w="100%" borderStyle="dashed" />
                        <Text fontFamily="cubano">OR</Text>
                        <Divider w="100%" borderStyle="dashed" />
                    </HStack>

                    <LoginForm />
                </VStack>

                <ChessBoardBackground
                    h={{ base: "calc(100vh - 56px)", md: "calc(100vh - 72px)" }}
                />
            </VStack>
        </BaseLayout>
    );
}
