import {
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import { Timer } from "./Timer";
import { TurnText } from "./TurnText";
import { PlayerInfo } from "./PlayerInfo";
import {
    useGetMatch,
    useListenMatchRoom,
    useMatchRoom,
} from "../../hooks/match";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { matchActions, matchSelectors } from "../../store/match/slice";
import { ChessBoard } from "./ChessBoard";
import { useContext, useEffect } from "react";
import { SocketContext } from "../../lib/websocket";
import { MATCH_STATUS } from "../../utils/chess";
import { useUser } from "../../hooks/auth";
import { motion, useAnimation } from "framer-motion";

export function GameSection() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { players, matchId } = useGetMatch();
    const time = useAppSelector(matchSelectors.startTimeInMs);
    const { socket } = useContext(SocketContext);
    const { user } = useUser();
    const status = useAppSelector(matchSelectors.status);
    const controls = useAnimation();
    const isPending =
        status === MATCH_STATUS.IN_PROGRESS || status === MATCH_STATUS.PENDING;
    const dispatch = useAppDispatch();

    useEffect(
        function () {
            if (!isPending) {
                controls.start({
                    opacity: 0.2,
                    filter: "grayscale(0.1)",
                    transition: { duration: 0.5, ease: "easeInOut" },
                });
            } else {
                socket?.emit("matchChessStart", { matchId });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPending]
    );

    useMatchRoom();
    useListenMatchRoom();

    return (
        <VStack w="100%" maxW="600px" gap="24px">
            <motion.div
                initial={{ opacity: 1, filter: "" }}
                animate={controls}
                style={{ width: "100%" }}
            >
                <PlayerInfo player={players!.opponent} />
            </motion.div>

            <ChessBoard />

            <HStack
                w="100%"
                justifyContent="space-between"
                as={motion.div}
                initial={{ opacity: 1, filter: "" }}
                animate={controls}
            >
                <HStack>
                    <Timer
                        timeInMs={time}
                        onTimeOut={() => {
                            socket?.emit("matchChessEnd", {
                                matchId,
                                newStatus: MATCH_STATUS.TIMEOUT,
                                metadata: { reason: "Time out" },
                            });

                            dispatch(
                                matchActions.changeMatchStatus(
                                    MATCH_STATUS.TIMEOUT
                                )
                            );
                            dispatch(
                                matchActions.changeMatchEndedMetadata({
                                    reason: "Timeout",
                                })
                            );
                        }}
                    />
                    <TurnText player={players!.me} />
                </HStack>

                <Button variant="error" onClick={onOpen}>
                    End Game
                </Button>
            </HStack>

            <motion.div
                initial={{ opacity: 1, filter: "" }}
                animate={controls}
                style={{ width: "100%" }}
            >
                <PlayerInfo player={players!.me} />
            </motion.div>

            {/* End game modal */}

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                motionPreset="slideInBottom"
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    bgColor="gray.800"
                    border="2px solid"
                    borderColor="gray.600"
                    py="1rem"
                    borderRadius="12px"
                >
                    <ModalHeader fontFamily="cubano">Confirm</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text fontWeight="700" color="gray.100">
                            Are you sure you want to end the game?
                        </Text>
                    </ModalBody>

                    <ModalFooter gap="12px">
                        <Button variant="contained" onClick={onClose} w="100%">
                            No
                        </Button>
                        <Button
                            variant="error"
                            onClick={() => {
                                socket?.emit("matchChessEnd", {
                                    matchId,
                                    newStatus: MATCH_STATUS.CANCELLED,
                                    metadata: {
                                        reason: "Game ended",
                                        byPlayer: {
                                            username: user?.username,
                                            id: user?.id,
                                        },
                                    },
                                });
                                onClose();

                                dispatch(
                                    matchActions.changeMatchStatus(
                                        MATCH_STATUS.CANCELLED
                                    )
                                );
                                dispatch(
                                    matchActions.changeMatchEndedMetadata({
                                        reason: "Game ended",
                                        byPlayer: {
                                            username: user!.username!,
                                            id: user!.id!,
                                        },
                                    })
                                );
                            }}
                            w="100%"
                        >
                            Yes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
