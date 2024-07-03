import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { theme } from "./lib/chakra";
import { queryClient } from "./lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <h1>Knightfall</h1>

                <button onClick={() => setCount((prev) => prev + 1)}>
                    {count}
                </button>
            </QueryClientProvider>
        </ChakraProvider>
    );
}
