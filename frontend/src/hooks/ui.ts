import { useToast } from "@chakra-ui/react";
import { useAnimation } from "framer-motion";
import { useCallback, useState } from "react";

export function useAppToast() {
    const errorToast = useToast();
    const successToast = useToast();

    const showErrorToast = useCallback(
        function (message: string, id?: string) {
            errorToast({
                id: id,
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        [errorToast]
    );

    const showSuccessToast = useCallback(
        function (message: string) {
            successToast({
                title: "Success",
                description: message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        [successToast]
    );

    return {
        errorToast: showErrorToast,
        successToast: showSuccessToast,
    };
}

export function useButtonAnimatedIcon() {
    const controls = useAnimation();
    const [bounchChessIcon, setBounceChessIcon] = useState(false);

    function handleMouseDown() {
        controls.start({
            rotate: 19.04,
            transformOrigin: "bottom center",
            transition: {
                duration: 0.2,
                ease: [0.42, 0, 0.58, 1],
                type: "tween",
            },
        });
    }

    function handleMouseUp() {
        controls.start({
            rotate: -19.04,
            transformOrigin: "bottom center",
            transition: {
                duration: 0.2,
                ease: [0.42, 0, 0.58, 1],
                type: "tween",
            },
        });
    }

    function onHoverStart() {
        setBounceChessIcon(true);
    }

    function onHoverEnd() {
        setBounceChessIcon(false);
    }

    return {
        bounce: bounchChessIcon,
        setBounce: setBounceChessIcon,
        onHoverStart,
        onHoverEnd,
        handleMouseDown,
        handleMouseUp,
    };
}
