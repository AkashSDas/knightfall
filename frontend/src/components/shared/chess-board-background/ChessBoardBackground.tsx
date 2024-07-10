import { Center, CenterProps, HStack, VStack } from "@chakra-ui/react";
import { ChessPiece } from "./ChessPiece";
import React from "react";

export const ChessBoardBackground = React.memo(function ChessBoardBackground({
    h = { base: "480px", sm: "640px" },
}: Pick<CenterProps, "h">) {
    return (
        <Center
            overflow="hidden"
            h={h}
            bgColor="gray.800"
            pointerEvents="none"
            pos="absolute"
            top={0}
            left={0}
        >
            <HStack gap={0}>
                {[...Array(20)].map((_, colIndex) => {
                    return (
                        <VStack gap={0} key={colIndex}>
                            {[...Array(20)].map((_, rowIndex) => {
                                return (
                                    <ChessPiece
                                        key={`${colIndex}${rowIndex}`}
                                        rowIndex={rowIndex}
                                        colIndex={colIndex}
                                    />
                                );
                            })}
                        </VStack>
                    );
                })}
            </HStack>
        </Center>
    );
});
