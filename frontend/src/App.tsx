import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { theme } from "./lib/chakra";

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <ChakraProvider theme={theme}>
            <h1>Knightfall</h1>

            <button onClick={() => setCount((prev) => prev + 1)}>
                {count}
            </button>
        </ChakraProvider>
    );
}
