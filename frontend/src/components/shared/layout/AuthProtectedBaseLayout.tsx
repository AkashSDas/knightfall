import { Center, Spinner } from "@chakra-ui/react";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "@/hooks/auth";

import { BaseLayout } from "./BaseLayout";

export function AuthProtectedBaseLayout(props: PropsWithChildren<unknown>) {
    const { isAuthenticated, isLoading } = useUser();
    const navigate = useNavigate();

    useEffect(
        function () {
            if (!isLoading && !isAuthenticated) {
                navigate("/auth/login");
            }
        },
        [isLoading, isAuthenticated]
    );

    if (!isAuthenticated) {
        return (
            <BaseLayout>
                <Center w="100%" my="2rem">
                    <Spinner size="xl" thickness="4px" />
                </Center>
            </BaseLayout>
        );
    } else {
        return props.children;
    }
}
