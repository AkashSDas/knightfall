import { VStack } from "@chakra-ui/react";
import { AuthProtectedBaseLayout } from "../../components/shared/layout/AuthProtectedBaseLayout";
import { BaseLayout } from "../../components/shared/layout/BaseLayout";

export function MatchRoomPage() {
    return (
        <AuthProtectedBaseLayout>
            <MatchRoomContent />
        </AuthProtectedBaseLayout>
    );
}

function MatchRoomContent() {
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
                ></VStack>
            </VStack>
        </BaseLayout>
    );
}
