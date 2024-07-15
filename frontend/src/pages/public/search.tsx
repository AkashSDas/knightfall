import { Center, Heading, VStack } from "@chakra-ui/react";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";

export function SearchPage() {
    return (
        <BaseLayout>
            <Center
                py="2rem"
                px="1rem"
                pos="relative"
                overflowX="hidden"
                overflowY="hidden"
                as="main"
            >
                <VStack
                    w="100%"
                    maxW="700px"
                    as="main"
                    alignItems="start"
                    gap="1rem"
                    zIndex={10}
                    my={{ base: "2rem", md: "4rem" }}
                >
                    <Heading as="h1">Search</Heading>
                </VStack>
            </Center>
        </BaseLayout>
    );
}
