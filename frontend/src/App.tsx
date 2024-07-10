import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./lib/chakra";
import { queryClient } from "./lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./lib/routes";

const router = createBrowserRouter(routes);

export default function App() {
    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </QueryClientProvider>
        </ChakraProvider>
    );
}
