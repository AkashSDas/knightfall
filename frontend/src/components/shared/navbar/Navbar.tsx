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
    useDisclosure,
} from "@chakra-ui/react";
import LogoImg from "../../../assets/images/chess-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

export function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    return (
        <HStack
            as="nav"
            justifyContent="space-between"
            gap={{ base: "0.5rem", md: "2rem" }}
            px={{ base: "1rem", md: "2rem" }}
            h={{ base: "56px", md: "72px" }}
            bgColor="gray.800"
            borderBottom="1px solid"
            borderBottomColor="gray.900"
            zIndex={1}
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

            {/* Desktop navbar actions */}
            <Show above="md">
                <HStack gap="1.5rem">
                    <Button variant="contained" as={Link} to="/auth/login">
                        Login
                    </Button>

                    <Button variant="primary" as={Link} to="/auth/signup">
                        Signup
                    </Button>
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
                            </HStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Show>
        </HStack>
    );
}
