import { Center, Text } from "@chakra-ui/react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { useFetchMatch } from "@/hooks/match";
import { useAppSelector } from "@/hooks/store";
import { matchSelectors } from "@/store/match/slice";

export function TurnText(props: {
    player: NonNullable<ReturnType<typeof useFetchMatch>["players"]>["me"];
}) {
    const currentTurn = useAppSelector(matchSelectors.currentTurn);

    return (
        <Center
            color="gray.300"
            borderRadius="8px"
            border="1.5px solid"
            borderColor="gray.600"
            bgColor="gray.700"
            px="12px"
            py="4px"
        >
            <Text
                fontFamily="cubano"
                as={motion.span}
                key={currentTurn}
                initial={{ y: 10, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.2 },
                }}
                exit={{ y: -10, opacity: 0, transition: { duration: 0.2 } }}
                color={
                    currentTurn === props.player.color ? "green.500" : "red.500"
                }
            >
                <FontAwesomeIcon
                    icon={faCircle}
                    size="sm"
                    bounce={currentTurn === props.player.color ? true : false}
                />
            </Text>
        </Center>
    );
}
