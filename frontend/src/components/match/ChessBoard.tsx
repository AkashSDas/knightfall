import { Box, Center, Grid, Image } from "@chakra-ui/react";
import {
    CHESS_BOARD_TYPE,
    CHESS_PIECE_COLOR,
    getImageForChessPiece,
} from "../../utils/chess";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
    type ChessPiece,
    matchActions,
    matchSelectors,
} from "../../store/match/slice";
import { motion } from "framer-motion";
import { useGetMatch } from "../../hooks/match";

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
    const { players } = useGetMatch();
    const turn = useAppSelector(matchSelectors.currentTurn);
    const dispatch = useAppDispatch();

    // If current player's chess piece color is black then we have to rotate the board
    // so that the opponent's chess piece are always on top. By default piece color
    // at bottom is white
    const isBlackPiece = players?.me?.color === CHESS_PIECE_COLOR.BLACK;

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
                transform={isBlackPiece ? "rotate(180deg)" : ""}
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
                                handleClick(Math.floor(index / 8), index % 8);
                            }}
                            as={motion.div}
                            key={index + (highlighted ? "-h" : "-n")}
                            cursor={
                                (piece &&
                                    piece.color === turn &&
                                    players!.me?.color === turn) ||
                                (highlighted && players!.me?.color === turn)
                                    ? "pointer"
                                    : "default"
                            }
                            transform={isBlackPiece ? "rotate(180deg)" : ""}
                            bgColor={
                                item.showPath
                                    ? "pink.300"
                                    : item.selected
                                      ? "yellow.300"
                                      : (Math.floor(index / 8) + index) % 2 ===
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
