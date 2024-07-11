import { HStack, Text } from "@chakra-ui/react";
import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

export function EmptyNotification() {
    return (
        <HStack
            color="gray.400"
            py="24px"
            w="100%"
            justifyContent="center"
            as={motion.div}
            initial={{ opacity: 0.7 }}
            animate={{
                opacity: 1,
                transition: {
                    duration: 0.5,
                    ease: "circInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                },
            }}
        >
            <FontAwesomeIcon icon={faGhost} size="2xl" />
            <Text fontSize="30px" fontFamily="cubano">
                Empty
            </Text>
        </HStack>
    );
}
