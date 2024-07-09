import { Center, Image } from "@chakra-ui/react";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import {
    getImageForChessPiece,
    CHESS_BOARD_TYPE,
    CHESS_PIECE_COLOR,
    CHESS_PIECES,
} from "../../../utils/chess";

function getRandomPiece() {
    const pieces = Object.values(CHESS_PIECES);
    const colors = Object.values(CHESS_PIECE_COLOR);

    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return { piece, color };
}

export function ChessPiece(props: { rowIndex: number; colIndex: number }) {
    const { rowIndex, colIndex } = props;
    const { piece, color } = getRandomPiece();
    const { black, white } = getImageForChessPiece(CHESS_BOARD_TYPE.NEO, piece);
    const isBlack = color === CHESS_PIECE_COLOR.BLACK;
    const MotionCenter = motion(Center);
    const [scope, animate] = useAnimate();

    useEffect(
        function () {
            let doAnimate = false;

            const inInterval = setInterval(
                () => {
                    doAnimate = Math.random() > 0.5;
                    console.log({ doAnimate });

                    if (doAnimate) {
                        animate(
                            scope.current,
                            { scale: 0.3, transformOrigin: "center" },
                            {
                                duration: 0.5,
                                delay: colIndex * 0.1 + rowIndex * 0.02,
                                ease: [0.5, 0.25, 0.7, 0.7],
                            }
                        );
                    }
                },
                1000 * 4 + (colIndex * 1 + rowIndex * 0.2)
            );

            const outInterval = setInterval(
                () => {
                    if (doAnimate) {
                        animate(
                            scope.current,
                            { scale: 1, transformOrigin: "center" },
                            {
                                duration: 0.5,
                                delay: colIndex * 0.1 + rowIndex * 0.02,
                                ease: [0.5, 0.25, 0.7, 0.7],
                            }
                        );
                    }
                },
                1000 * 4.5 + (colIndex * 1 + rowIndex * 0.2)
            );

            return () => {
                clearInterval(inInterval);
                clearInterval(outInterval);
            };
        },
        [colIndex, rowIndex, scope, animate]
    );

    return (
        <MotionCenter
            ref={scope}
            key={`${colIndex}${rowIndex}`}
            width={{ base: "50px", sm: "80px" }}
            height={{ base: "50px", sm: "80px" }}
            bgColor={isBlack ? "gray.700" : "gray.500"}
            border="1px solid"
            borderColor="black"
            initial={{ opacity: 0, scale: 0.2, transformOrigin: "top left" }}
            animate={{ opacity: 0.075, scale: 1, transformOrigin: "top left" }}
            boxShadow="inset 8px -8px 0px rgba(0,0,0,0.35)"
            borderRadius="8px"
            transition={{
                delay: colIndex * 0.1 + rowIndex * 0.02,
                duration: 0.5,
                ease: [0.5, 0.25, 0.7, 0.7],
            }}
        >
            <Center
                width={{ base: "30px", sm: "60px" }}
                height={{ base: "30px", sm: "60px" }}
            >
                <Image src={isBlack ? black : white} alt="" />
            </Center>
        </MotionCenter>
    );
}
