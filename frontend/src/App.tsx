import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { theme } from "@/lib/chakra";
import { queryClient } from "@/lib/react-query";
import { routes } from "@/lib/routes";
import { SocketProvider } from "@/providers/SocketProvider";
import { store } from "@/store";

const router = createBrowserRouter(routes);

export default function App() {
    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <SocketProvider>
                        <RouterProvider router={router} />
                    </SocketProvider>
                </Provider>
            </QueryClientProvider>
        </ChakraProvider>
    );
}
