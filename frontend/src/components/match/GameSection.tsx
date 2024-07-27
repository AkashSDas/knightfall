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
import { useAppSelector } from "../../hooks/store";
import { matchSelectors } from "../../store/match/slice";
import { ChessBoard } from "./ChessBoard";

export function GameSection() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { players } = useGetMatch();
    const time = useAppSelector(matchSelectors.startTimeInMs);

    useMatchRoom();
    useListenMatchRoom();

    return (
        <VStack w="100%" maxW="600px" gap="24px">
            <PlayerInfo player={players!.opponent} />

            <ChessBoard />

            <HStack w="100%" justifyContent="space-between">
                <HStack>
                    <Timer
                        timeInMs={time}
                        onTimeOut={() => console.log("time out")}
                    />
                    <TurnText player={players!.me} />
                </HStack>

                <Button variant="error" onClick={onOpen}>
                    End Game
                </Button>
            </HStack>

            <PlayerInfo player={players!.me} />

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
                        <Button variant="error" onClick={onClose} w="100%">
                            Yes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
