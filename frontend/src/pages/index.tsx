import { Heading, Text } from "@chakra-ui/react";
import { useState } from "react";

export function HomePage() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <Text fontFamily="cubano">Good morning</Text>

            <Heading fontFamily="cubano">Knightfall</Heading>

            <button onClick={() => setCount((prev) => prev + 1)}>
                {count}
            </button>
        </div>
    );
}
