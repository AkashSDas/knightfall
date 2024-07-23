import { Center, Spinner, VStack } from "@chakra-ui/react";
import { AuthProtectedBaseLayout } from "../../components/shared/layout/AuthProtectedBaseLayout";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";
import { useGetMatch } from "../../hooks/match";

export function MatchRoomPage() {
    return (
        <AuthProtectedBaseLayout>
            <MatchRoomContent />
        </AuthProtectedBaseLayout>
    );
}

function MatchRoomContent() {
    const { isLoading, match } = useGetMatch();

    return (
        <BaseLayout>
            <VStack
                w="100%"
                as="main"
                justifyContent="center"
                alignItems="center"
            >
                <VStack
                    zIndex={10}
                    gap={{ base: "18px", sm: "48px" }}
                    px="1rem"
                >
                    {isLoading ? (
                        <Center w="100%" my="2rem">
                            <Spinner size="lg" thickness="3px" />
                        </Center>
                    ) : null}
                </VStack>
            </VStack>
        </BaseLayout>
    );
}
