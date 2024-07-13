import {
    Center,
    VStack,
    Heading,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
} from "@chakra-ui/react";
import { BaseLayout } from "../components/shared/layout/BaseLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup, faSkull } from "@fortawesome/free-solid-svg-icons";

export function SettingsPage() {
    return (
        <BaseLayout>
            <Center py="2rem" px="1rem">
                <VStack
                    w="100%"
                    maxW="700px"
                    as="main"
                    alignItems="start"
                    gap="1rem"
                >
                    <Heading
                        fontFamily="cubano"
                        as="h1"
                        letterSpacing="1px"
                        fontSize={{ base: "2.5rem", md: "3.5rem" }}
                    >
                        Settings
                    </Heading>

                    <Tabs w="100%" isLazy isFitted>
                        <TabList
                            pb="1rem"
                            borderBottom="1px solid"
                            borderColor="gray.600"
                            w="100%"
                            h="60px"
                        >
                            <Tab>
                                <FontAwesomeIcon icon={faSkull} size="sm" />
                                Profile
                            </Tab>

                            <Tab>
                                <FontAwesomeIcon
                                    icon={faPeopleGroup}
                                    size="sm"
                                />
                                Friends
                            </Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>Profile form</TabPanel>

                            <TabPanel>Friends List</TabPanel>
                        </TabPanels>
                    </Tabs>
                </VStack>
            </Center>
        </BaseLayout>
    );
}
