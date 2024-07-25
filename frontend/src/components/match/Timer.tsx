import { Center, Text } from "@chakra-ui/react";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export function Timer(props: { timeInMs: number; onTimeOut: () => void }) {
    const [seconds, setSeconds] = useState(Math.floor(props.timeInMs / 1000));

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (seconds === 0) {
            props.onTimeOut();
        }
    }, [seconds]);

    const timeString = formatTime(seconds);

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
            <FontAwesomeIcon
                icon={faClock}
                size="sm"
                style={{ marginRight: "8px" }}
            />

            {timeString.split("").map((char, index) => (
                <Text
                    fontFamily="cubano"
                    as={motion.span}
                    key={char + index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.2 },
                    }}
                    exit={{ y: -10, opacity: 0, transition: { duration: 0.2 } }}
                >
                    {char}
                </Text>
            ))}
        </Center>
    );
}
