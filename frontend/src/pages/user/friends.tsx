import { Center, VStack, Heading } from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";

export function FriendsPage() {
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
                        Friends
                    </Heading>
                </VStack>
            </Center>
        </BaseLayout>
    );
}
