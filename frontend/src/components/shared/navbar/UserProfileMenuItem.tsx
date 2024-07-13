import { Box, HStack, Text } from "@chakra-ui/react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function UserProfileMenuItem(props: {
    icon: IconDefinition;
    label: string;
}) {
    return (
        <HStack
            w="100%"
            h="38px"
            px="12px"
            borderRadius="10px"
            bgColor="gray.700"
            _hover={{ bgColor: "gray.600" }}
            _active={{ bgColor: "gray.600" }}
            transition="all 0.2s ease-in-out"
            cursor="pointer"
            gap="12px"
            color="gray.200"
            role="group"
        >
            <Box
                transition="transform 0.3s ease-in-out"
                transformOrigin="bottom center"
                _groupHover={{ transform: "rotate(-10deg)" }}
                _groupActive={{ transform: "rotate(20deg)" }}
                h="20px"
                w="20px"
            >
                <FontAwesomeIcon icon={props.icon} size="sm" />
            </Box>

            <Text fontSize="15px" fontWeight="600">
                {props.label}
            </Text>
        </HStack>
    );
}
