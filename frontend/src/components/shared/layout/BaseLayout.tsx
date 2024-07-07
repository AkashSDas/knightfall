import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Navbar } from "../navbar";

export function BaseLayout(props: PropsWithChildren<unknown>) {
    return (
        <Box>
            <Navbar />
            {props.children}
        </Box>
    );
}
