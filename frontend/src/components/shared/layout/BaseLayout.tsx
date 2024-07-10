import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Navbar } from "../navbar";
import ChessBg from "../../../assets/images/chess-board-bg.png";

export function BaseLayout(props: PropsWithChildren<unknown>) {
    return (
        <Box pos="relative">
            <Box zIndex={1} pos="relative">
                <Navbar />
                {props.children}
            </Box>

            <Box
                sx={{
                    pos: "absolute",
                    top: "0",
                    left: "0",
                    backgroundImage: `url('${ChessBg}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                    h: "100vh",
                    w: "100vw",
                    overflow: "hidden",
                    zIndex: 0,
                }}
            />
        </Box>
    );
}
