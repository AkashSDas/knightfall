import { Center, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GoogleImage from "@/assets/images/google.svg";
import { useUser } from "@/hooks/auth";
import { textShadowStyle } from "@/lib/chakra";

export function SocialLogins() {
    const { isAuthenticated, user } = useUser();

    if (!isAuthenticated || !user) return null;

    return (
        <VStack w="100%" alignItems="start">
            <Heading
                as="h3"
                letterSpacing="1px"
                fontFamily="cubano"
                css={textShadowStyle}
            >
                Social Logins
            </Heading>

            <Text color="gray.200">
                Your account is connected to the following social logins.
            </Text>

            {user.oauthProviders.length === 0 ? (
                <Center
                    w="100%"
                    my="2rem"
                    gap="12px"
                    color="gray.200"
                    fontSize="24px"
                >
                    <FontAwesomeIcon icon={faGhost} bounce />

                    <Text fontWeight="600">No social logins found.</Text>
                </Center>
            ) : null}

            {user.oauthProviders.some((item) => item.provider === "google") ? (
                <HStack
                    w="100%"
                    my="1rem"
                    px="1rem"
                    h="44px"
                    bgColor="gray.600"
                    borderRadius={"10px"}
                    gap="1rem"
                >
                    <Center>
                        <Image
                            src={GoogleImage}
                            alt="Google Login"
                            h="24px"
                            w="24px"
                        />
                    </Center>

                    <Text fontWeight="500">Google</Text>
                </HStack>
            ) : null}
        </VStack>
    );
}
