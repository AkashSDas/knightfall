import { Box, Spacer } from "@chakra-ui/react";
import { PropsWithChildren, useMemo } from "react";
import { Navbar } from "../navbar";
import ChessBg from "../../../assets/images/chess-board-bg.png";
import { useLocation } from "react-router-dom";

const pathnames: string[] = ["/"];

export function BaseLayout(props: PropsWithChildren<unknown>) {
    const location = useLocation();
    const bgImage = useMemo(
        function () {
            if (pathnames.includes(location.pathname)) {
                return `url('${ChessBg}')`;
            } else {
                return undefined;
            }
        },
        [location]
    );

    return (
        <Box pos="relative">
            <Box zIndex={1} pos="relative">
                <Navbar />
                <Spacer h={{ base: "56px", md: "72px" }} />
                {props.children}
            </Box>

            <Box
                sx={{
                    pos: "absolute",
                    top: "0",
                    left: "0",
                    backgroundImage: bgImage,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                    h: "100vh",
                    w: "100vw",
                    overflow: "hidden",
                    zIndex: 0,
                    opacity: "30%",
                }}
            />
        </Box>
    );
}
