import {
    Box,
    Button,
    CenterProps,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { BaseLayout } from "../components/shared/layout/BaseLayout";
import { useUser } from "../hooks/auth";
import { ChessBoardBackground } from "../components/shared/chess-board-background/ChessBoardBackground";
import { motion, useAnimation } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessQueen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Keep this height outside of the component because when you hover over the button
// there's state change for `bounchChessIcon` which starts the chess board animation
// again because the `h` prop is recreated. By keeping this height outside of the component
// it prevents re-rendering of `ChessBoardBackground`.
const chessBoardHeight: CenterProps["h"] = {
    base: "480px",
    md: "640px",
    lg: "640px",
};

export function HomePage() {
    const { isAuthenticated, pushToLogin } = useUser();
    const controls = useAnimation();
    const [bounchChessIcon, setBounceChessIcon] = useState(false);
    const navigate = useNavigate();

    function handleMouseDown() {
        controls.start({
            rotate: 19.04,
            transformOrigin: "bottom center",
            transition: {
                duration: 0.2,
                ease: [0.42, 0, 0.58, 1],
                type: "tween",
            },
        });
    }

    function handleMouseUp() {
        controls.start({
            rotate: -19.04,
            transformOrigin: "bottom center",
            transition: {
                duration: 0.2,
                ease: [0.42, 0, 0.58, 1],
                type: "tween",
            },
        });
    }

    return (
        <BaseLayout>
            <VStack
                w="100%"
                as="main"
                pos="relative"
                justifyContent="center"
                alignItems="center"
                h={chessBoardHeight}
                overflowX="hidden"
                overflowY="hidden"
            >
                <VStack
                    zIndex={10}
                    gap={{ base: "18px", sm: "48px" }}
                    px="1rem"
                >
                    <Heading
                        as={motion.h1}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.6,
                                duration: 0.4,
                                ease: "easeInOut",
                            },
                        }}
                        fontFamily="cubano"
                        fontSize={{ base: "48px", sm: "52px", md: "60px" }}
                        textAlign="center"
                        textShadow="inset 2px 2px 4px rgba(0, 0, 0, 0.5)"
                    >
                        Welcome To <br />
                        Knightfall
                    </Heading>

                    <Text
                        color="gray.200"
                        textAlign="center"
                        fontSize={{ base: "18px", sm: "20px" }}
                        fontWeight="600"
                        w="100%"
                        maxW="550px"
                        textShadow="inset 2px 2px 4px rgba(0, 0, 0, 0.5)"
                        as={motion.p}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.75,
                                duration: 0.4,
                                ease: "easeInOut",
                            },
                        }}
                    >
                        Play the game of kings. Fight in the battlefield with
                        other strategists like you.
                    </Text>

                    <Button
                        as={motion.button}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.85,
                                duration: 0.4,
                                ease: "easeInOut",
                            },
                        }}
                        variant="primary"
                        h="60px"
                        w={{ base: "100%", sm: "200px" }}
                        fontSize="20px"
                        onClick={() => {
                            if (!isAuthenticated) {
                                pushToLogin();
                            } else {
                                navigate("/lobby");
                            }
                        }}
                        onHoverStart={() => setBounceChessIcon(true)}
                        onHoverEnd={() => setBounceChessIcon(false)}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        leftIcon={
                            <Box
                                as={motion.span}
                                initial={{ rotate: -19.04 }}
                                animate={controls}
                                style={{ marginBottom: "2px" }}
                            >
                                <FontAwesomeIcon
                                    icon={faChessQueen}
                                    size="sm"
                                    bounce={bounchChessIcon}
                                />
                            </Box>
                        }
                        sx={{
                            borderRadius: "15px",
                            borderBottom: "6px solid",
                            borderBottomColor: "brand.700",
                            _hover: {
                                bgColor: "brand.600",
                                borderBottom: "6px solid",
                                borderBottomColor: "brand.700",
                                _disabled: {
                                    bgColor: "brand.600",
                                    borderBottom: "6px solid",
                                    borderBottomColor: "brand.700",
                                },
                            },
                            _active: {
                                bgColor: "brand.600",
                                borderBottom: "1px solid",
                                borderBottomColor: "brand.700",
                            },
                        }}
                    >
                        Play
                    </Button>
                </VStack>

                <ChessBoardBackground h={chessBoardHeight} />
            </VStack>
        </BaseLayout>
    );
}
