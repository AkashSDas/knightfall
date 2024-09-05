import { Box, Button, Center, Grid, Image, Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { useFetchMatch } from "../../hooks/match";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
    type ChessPiece,
    matchActions,
    matchSelectors,
} from "../../store/match/slice";
import {
    CHESS_BOARD_TYPE,
    CHESS_PIECE_COLOR,
    MATCH_STATUS,
    getImageForChessPiece,
} from "../../utils/chess";

// const generateRandomRotation = () => ({
//     rotateX: [0, Math.random() * 50 - 25, 0, Math.random() * 40 - 15, 0],
//     rotateY: [0, Math.random() * 50 - 15, 0, Math.random() * 40 - 5, 0],
// });

const calculateDistanceDelay = (
    row1: number,
    col1: number,
    row2: number,
    col2: number
) => {
    const distance = Math.sqrt(
        Math.pow(row1 - row2, 2) + Math.pow(col1 - col2, 2)
    );
    return distance * 0.05; // Adjust the multiplier as needed for delay intensity
};

const variants = {
    hidden: { opacity: 1 },
    visible: ({
        row,
        col,
        selectedRow,
        selectedCol,
    }: {
        row: number;
        col: number;
        selectedRow: number;
        selectedCol: number;
    }) => ({
        opacity: 1,
        backgroundColor: ["#FBB6CE", "#F687B3", "#D53F8C"],
        transition: {
            delay: calculateDistanceDelay(row, col, selectedRow, selectedCol),
            duration: 0.1,
            ease: "easeInOut",
        },
    }),
};

export function ChessBoard() {
    const board = useAppSelector(matchSelectors.board);
    const { players } = useFetchMatch();
    const turn = useAppSelector(matchSelectors.currentTurn);
    const dispatch = useAppDispatch();
    const status = useAppSelector(matchSelectors.status);
    const matchEndedMetadata = useAppSelector(
        matchSelectors.matchEndedMetadata
    );
    const winner = useAppSelector(matchSelectors.winner);

    // If current player's chess piece color is black then we have to rotate the board
    // so that the opponent's chess piece are always on top. By default piece color
    // at bottom is white
    const isBlackPiece = players?.me?.color === CHESS_PIECE_COLOR.BLACK;

    const isPending =
        status === MATCH_STATUS.IN_PROGRESS || status === MATCH_STATUS.PENDING;

    function handleClick(rowIndex: number, colIndex: number) {
        if (players!.me?.color === turn) {
            dispatch(matchActions.selectPiece({ rowIndex, colIndex }));
        }
    }

    // Animation variants for staggering effect
    // const variants = {
    //     hidden: { opacity: 1 },
    //     visible: ({ row, col }: { row: number; col: number }) => ({
    //         // visible: (i: number) => ({
    //         opacity: 1,
    //         backgroundColor: ["#FBB6CE", "#F687B3", "#D53F8C"],
    //         transition: {
    //             // delay: i * 0.025,
    //             delay: row * 0.25 + col * 0.45,
    //             duration: 0.06,
    //             ease: "easeInOut",
    //             // repeat: Infinity,
    //             // repeatType: "reverse",
    //         },
    //     }),
    // };

    const gameOverText = useMemo(
        function () {
            if (status === MATCH_STATUS.DRAW) {
                return "Game is a draw";
            } else if (status === MATCH_STATUS.CANCELLED) {
                return "Game cancelled";
            } else if (
                status === MATCH_STATUS.CHECKMATE ||
                status === MATCH_STATUS.FINISHED
            ) {
                if (players?.me.color === winner) {
                    return "You won";
                } else {
                    return "You lost";
                }
            } else if (
                status === MATCH_STATUS.IN_PROGRESS ||
                status === MATCH_STATUS.PENDING
            ) {
                return "Gone";
            } else if (status === MATCH_STATUS.TIMEOUT) {
                return "Timeout";
            }
        },
        [status, winner]
    );

    const additionGameOverText = useMemo(
        function () {
            if (
                status === MATCH_STATUS.CANCELLED &&
                matchEndedMetadata?.byPlayer
            ) {
                if (matchEndedMetadata.byPlayer.id === players?.me.user.id) {
                    return `You have cancelled the game`;
                } else {
                    // return `${matchEndedMetadata.byPlayer.username} has cancelled the game`;
                    return `Opponent has cancelled the game`;
                }
            }
        },
        [status]
    );

    const controls = useAnimation();

    useEffect(
        function () {
            if (!isPending) {
                controls.start({
                    opacity: 0.2,
                    filter: "grayscale(0.1)",
                    transition: {
                        duration: 0.5,
                        ease: "easeInOut",
                    },
                });
            }
        },
        [isPending]
    );

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            h="100%"
            maxW="600px"
            maxH="600px"
            w="100%"
            pos="relative"
        >
            <AnimatePresence>
                {!isPending && (
                    <Center
                        pos="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w="100%"
                        zIndex={10}
                        as={motion.div}
                        initial={{ opacity: 0, y: "-30%", x: "-50%" }}
                        animate={{
                            opacity: 1,
                            y: "-50%",
                            x: "-50%",
                            transition: {
                                delay: 0.5,
                                duration: 0.5,
                                ease: "easeInOut",
                            },
                        }}
                        bgColor="gray.700"
                        border="2px solid"
                        borderColor="gray.500"
                        borderRadius="8px"
                        boxShadow="dark-lg"
                        flexDir="column"
                        pb="12px"
                    >
                        <Text
                            fontFamily="cubano"
                            fontSize={{ base: "30px", sm: "60px" }}
                            color={"gray.100"}
                            textShadow="dark-lg"
                        >
                            {gameOverText}
                        </Text>

                        <Text
                            fontSize="18px"
                            color="gray.300"
                            fontWeight="700"
                            mb="1rem"
                        >
                            {additionGameOverText}
                        </Text>

                        <Button as={Link} to="/" variant="primary" mb="1rem">
                            Go Home
                        </Button>
                    </Center>
                )}
            </AnimatePresence>

            <Grid
                templateColumns="repeat(8, 1fr)"
                templateRows="repeat(8, 1fr)"
                width="90vmin"
                height="90vmin"
                maxWidth="100%"
                maxH="600px"
                transform={isBlackPiece ? "rotate(180deg)" : ""}
                as={motion.div}
                initial={{ opacity: 1, filter: "" }}
                animate={controls}
            >
                {Array.from({ length: 64 }).map((_, index) => {
                    const item = board[Math.floor(index / 8)][index % 8];
                    const piece = item?.piece;
                    const highlighted = item.showPath;

                    let rowIndex: null | number = null;
                    let colIndex: null | number = null;

                    board.find((row, rowIdx) =>
                        row.find((block, colIdx) => {
                            if (block.selected) {
                                rowIndex = rowIdx;
                                colIndex = colIdx;
                            }

                            return block.selected;
                        })
                    );

                    const selectedRow = rowIndex ?? 0;
                    const selectedCol = colIndex ?? 0;

                    return (
                        <Center
                            onClick={() => {
                                if (
                                    status === MATCH_STATUS.PENDING ||
                                    status === MATCH_STATUS.IN_PROGRESS
                                ) {
                                    handleClick(
                                        Math.floor(index / 8),
                                        index % 8
                                    );
                                }
                            }}
                            as={motion.div}
                            key={index + (highlighted ? "-h" : "-n")}
                            pointerEvents={!isPending ? "none" : "auto"}
                            cursor={
                                !isPending
                                    ? "default"
                                    : (piece &&
                                            piece.color === turn &&
                                            players!.me?.color === turn) ||
                                        (highlighted &&
                                            players!.me?.color === turn)
                                      ? "pointer"
                                      : "default"
                            }
                            transform={isBlackPiece ? "rotate(180deg)" : ""}
                            bgColor={
                                item.showKingDangerPath
                                    ? "red.600"
                                    : item.showPath
                                      ? "pink.300"
                                      : item.selected
                                        ? "yellow.300"
                                        : (Math.floor(index / 8) + index) %
                                                2 ===
                                            0
                                          ? "#E9EDCC"
                                          : "#779954"
                            }
                            width="100%"
                            height="100%"
                            boxShadow="inset 4px -8px 0px rgba(0,0,0,0.15)"
                            borderRadius="8px"
                            border={item.selected ? "4px solid" : "2px solid"}
                            borderColor={"gray.900"}
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
                            custom={{
                                row: Math.floor(index / 8),
                                col: index % 8,
                                selectedRow,
                                selectedCol,
                            }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            variants={(highlighted ? variants : null) as any}
                            initial="hidden"
                            animate={highlighted ? "visible" : "hidden"}
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
    const board = useAppSelector(matchSelectors.board);
    const { piece } = board[rowIndex][colIndex];

    const imgSrc = piece
        ? getImageForChessPiece(CHESS_BOARD_TYPE.NEO, piece.type)
        : null;

    return (
        <MotionCenter
            key={`${rowIndex}${colIndex}`}
            // animate={{
            //     scale: 0.6,
            //     transformOrigin: "center",
            // }}
            transform="scale(0.6)"
            // transition={{
            //     type: "spring",
            //     stiffness: 400,
            //     damping: 25,
            //     mass: 3,
            // }}
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
