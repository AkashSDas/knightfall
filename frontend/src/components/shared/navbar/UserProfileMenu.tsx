import {
    Avatar,
    Button,
    Divider,
    Menu,
    MenuButton,
    MenuList,
    Portal,
} from "@chakra-ui/react";
import { useUser } from "../../../hooks/auth";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
    faGear,
    faPeopleGroup,
    faRightFromBracket,
    faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { UserProfileMenuItem } from "./UserProfileMenuItem";
import { Link } from "react-router-dom";

export function UserProfileMenu() {
    const { isAuthenticated, user, logoutMutation } = useUser();
    const controls = useAnimation();

    if (!isAuthenticated || !user) return null;

    return (
        <Menu
            onClose={() => {
                controls.start({ visibility: "hidden", opacity: 0, y: -10 });
            }}
        >
            <MenuButton
                as={Button}
                variant="unstyled"
                onClick={() => {
                    controls.start({
                        visibility: "visible",
                        opacity: 1,
                        y: 0,
                    });
                }}
            >
                <Avatar
                    src={user.profilePic.URL}
                    h="38px"
                    w="38px"
                    border="2px solid #303230"
                    boxShadow="0px 0px 0px 2px #616261"
                    transition="transform 0.3s ease-in-out"
                    _hover={{ transform: "scale(0.95)" }}
                    _active={{ transform: "scale(0.9)" }}
                />
            </MenuButton>

            <Portal>
                <AnimatePresence mode="wait">
                    <MenuList
                        as={motion.div}
                        initial={{ visibility: "hidden", opacity: 0, y: -10 }}
                        animate={controls}
                        bgColor="gray.700"
                        borderRadius="10px"
                        border={{ base: "1.5px solid", md: "2px solid" }}
                        borderColor={{ base: "gray.500", md: "gray.500" }}
                        w="240px"
                        p="1rem"
                        boxShadow="dark-lg"
                    >
                        <Link to="/history">
                            <UserProfileMenuItem
                                icon={faTrophy}
                                label="History"
                            />
                        </Link>

                        <Link to="/friends">
                            <UserProfileMenuItem
                                icon={faPeopleGroup}
                                label="Friends"
                            />
                        </Link>

                        <Link to="/settings">
                            <UserProfileMenuItem
                                icon={faGear}
                                label="Settings"
                            />
                        </Link>

                        <Divider my="12px" borderColor="gray.500" />

                        <Button
                            variant="unstyled"
                            w="100%"
                            onClick={() => logoutMutation.mutateAsync()}
                            isDisabled={logoutMutation.isPending}
                            isLoading={logoutMutation.isPending}
                        >
                            <UserProfileMenuItem
                                icon={faRightFromBracket}
                                label="Logout"
                            />
                        </Button>
                    </MenuList>
                </AnimatePresence>
            </Portal>
        </Menu>
    );
}
