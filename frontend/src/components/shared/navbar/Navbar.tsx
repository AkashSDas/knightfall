import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    IconButton,
    Image,
    Show,
    Text,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import LogoImg from "../../../assets/images/chess-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faChessKing,
    faCommentDots,
    faSearch,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../hooks/auth";
import { NotificationMenu } from "../../notification/NotificationMenu";
import { UserProfileMenu } from "./UserProfileMenu";

export function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const { isAuthenticated, logoutMutation } = useUser();

    return (
        <HStack
            as="nav"
            justifyContent="space-between"
            gap={{ base: "0.5rem", md: "2rem" }}
            px={{ base: "1rem", md: "2rem" }}
            h={{ base: "56px", md: "72px" }}
            bgColor="gray.700"
            borderBottom="2px solid"
            borderBottomColor="gray.600"
            zIndex={1}
            pos="fixed"
            w="100%"
        >
            <Tooltip
                label={
                    <Text>
                        <FontAwesomeIcon
                            icon={faChessKing}
                            size="sm"
                            style={{ marginRight: "6px" }}
                            bounce
                        />
                        Knightfall
                    </Text>
                }
                openDelay={500}
            >
                <Link to="/">
                    <Image
                        onMouseDown={() => navigate("/")}
                        src={LogoImg}
                        alt="Knightfall Logo"
                        w="37.85px"
                        h="30.09px"
                    />
                </Link>
            </Tooltip>

            {/* Desktop navbar actions */}
            <Show above="md">
                <HStack gap="1.5rem">
                    <Tooltip label="Search Players" openDelay={500}>
                        <IconButton
                            as={Link}
                            to="/search"
                            aria-label="Search Players"
                            variant="ghost"
                        >
                            <FontAwesomeIcon icon={faSearch} size="lg" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip label="Global Chat" openDelay={500}>
                        <IconButton
                            as={Link}
                            to="/global-chat"
                            aria-label="Global Chat"
                            variant="ghost"
                        >
                            <FontAwesomeIcon icon={faCommentDots} size="lg" />
                        </IconButton>
                    </Tooltip>

                    {isAuthenticated ? (
                        <>
                            <NotificationMenu />
                            <UserProfileMenu />
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                as={Link}
                                to="/auth/login"
                            >
                                Login
                            </Button>

                            <Button
                                variant="primary"
                                as={Link}
                                to="/auth/signup"
                            >
                                Signup
                            </Button>
                        </>
                    )}
                </HStack>
            </Show>

            {/* Mobile navbar */}
            <Show below="md">
                <IconButton
                    aria-label="Open Menu"
                    variant="ghost"
                    onMouseDown={onOpen}
                    onClick={onOpen}
                >
                    <FontAwesomeIcon
                        icon={faBars}
                        style={{ color: "gray" }}
                        size="lg"
                    />
                </IconButton>

                <Drawer
                    isOpen={isOpen}
                    placement="bottom"
                    onClose={onClose}
                    size="md"
                >
                    <DrawerOverlay />

                    <DrawerContent minH="500px" maxH="500px" bgColor="gray.800">
                        <DrawerCloseButton
                            onMouseDown={onClose}
                            as={IconButton}
                            aria-label="Close Menu"
                            icon={
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    style={{ color: "gray" }}
                                    size="2x"
                                />
                            }
                            _hover={{ bgColor: "gray.600" }}
                            _active={{ bgColor: "gray.700" }}
                        />

                        <DrawerHeader>
                            <Image
                                src={LogoImg}
                                alt="Knightfall Logo"
                                w="37.85px"
                                h="30.09px"
                            />
                        </DrawerHeader>

                        <DrawerBody pos="relative" h="100%" p={0}>
                            {/* Footer */}
                            <HStack
                                gap="1.5rem"
                                pos="fixed"
                                bottom="12px"
                                borderTop="1px solid"
                                borderTopColor="gray.900"
                                pt="1rem"
                                px="1rem"
                                w="100%"
                            >
                                {isAuthenticated ? (
                                    <Button
                                        variant="contained"
                                        disabled={logoutMutation.isPending}
                                        isLoading={logoutMutation.isPending}
                                        onClick={() =>
                                            logoutMutation.mutateAsync()
                                        }
                                        w="100%"
                                        h="44px"
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="contained"
                                            as={Link}
                                            to="/auth/login"
                                            h="44px"
                                            w="100%"
                                        >
                                            Login
                                        </Button>

                                        <Button
                                            variant="primary"
                                            as={Link}
                                            to="/auth/signup"
                                            h="44px"
                                            w="100%"
                                        >
                                            Signup
                                        </Button>
                                    </>
                                )}
                            </HStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Show>
        </HStack>
    );
}
