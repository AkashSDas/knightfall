import { Box, Center, Grid, Image } from "@chakra-ui/react";
import { CHESS_BOARD_TYPE, getImageForChessPiece } from "../../utils/chess";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { matchActions, matchSelectors } from "../../store/match/slice";
import { motion } from "framer-motion";
import { useGetMatch } from "../../hooks/match";

// const generateRandomRotation = () => ({
//     rotateX: [0, Math.random() * 50 - 25, 0, Math.random() * 40 - 15, 0],
//     rotateY: [0, Math.random() * 50 - 15, 0, Math.random() * 40 - 5, 0],
// });

export function ChessBoard() {
    const board = useAppSelector(matchSelectors.board);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            h="100%"
            maxW="600px"
            maxH="600px"
            w="100%"
        >
            <Grid
                templateColumns="repeat(8, 1fr)"
                templateRows="repeat(8, 1fr)"
                width="90vmin"
                height="90vmin"
                maxWidth="100%"
                maxH="600px"
            >
                {Array.from({ length: 64 }).map((_, index) => {
                    const item = board[Math.floor(index / 8)][index % 8];

                    return (
                        <Center
                            as={motion.div}
                            key={index}
                            bgColor={
                                (Math.floor(index / 8) + index) % 2 === 0
                                    ? "#f0d9b5"
                                    : "#b58863"
                            }
                            width="100%"
                            height="100%"
                            boxShadow="inset 4px -8px 0px rgba(0,0,0,0.15)"
                            borderRadius="8px"
                            border={item.selected ? "4px solid" : "2px solid"}
                            borderColor={item.selected ? "red.500" : "gray.900"}
                            // initial={{ rotateX: 0, rotateY: 0 }}
                            // animate={{
                            //     ...generateRandomRotation(),
                            //     transition: {
                            //         duration: 2,
                            //         ease: "easeInOut",
                            //         // repeat: Infinity,
                            //         // repeatType: "loop",
                            //     },
                            // }}
                        >
                            <ChessPiece
                                rowIndex={Math.floor(index / 8)}
                                colIndex={index % 8}
                            />
                        </Center>
                    );
                })}
            </Grid>
        </Box>
    );
}

const MotionCenter = motion(Center);

function ChessPiece(props: { rowIndex: number; colIndex: number }) {
    const { rowIndex, colIndex } = props;
    const { players } = useGetMatch();
    const board = useAppSelector(matchSelectors.board);
    const turn = useAppSelector(matchSelectors.currentTurn);
    const { piece } = board[rowIndex][colIndex];
    const dispatch = useAppDispatch();

    const imgSrc = piece
        ? getImageForChessPiece(CHESS_BOARD_TYPE.NEO, piece.type)
        : null;

    function handleClick() {
        if (piece && piece.color === turn && players!.me?.color === turn) {
            dispatch(matchActions.selectPiece({ rowIndex, colIndex }));
        }
    }

    return (
        <MotionCenter
            key={`${rowIndex}${colIndex}`}
            animate={{
                scale: 0.6,
                transformOrigin: "center",
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 3,
            }}
            onClick={handleClick}
            cursor={
                piece && piece.color === turn && players!.me?.color === turn
                    ? "pointer"
                    : "default"
            }
        >
            {imgSrc ? (
                <Image
                    src={imgSrc ? imgSrc[piece!.color] : "black"}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                />
            ) : null}
        </MotionCenter>
    );
}
