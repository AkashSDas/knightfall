import { Heading, Image, Text, VStack, Wrap } from "@chakra-ui/react";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useMemo } from "react";

import { type GetUserPublicProfileResponse } from "@/services/user";
import {
    getAchievementImages,
    getAchievementsBoardImages,
    getRankImageSrc,
    getWinPointsSrc,
} from "@/utils/achievements";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
        },
    },
};

const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
};

export function AchievementsBoard(
    props: Pick<
        GetUserPublicProfileResponse["user"],
        "achievements" | "rank" | "winPoints"
    >
) {
    const { achievements, rank, winPoints } = props;
    const imgs: string[] = useMemo(
        function (): string[] {
            const imgs: string[] = [];

            imgs.push(getWinPointsSrc(winPoints));

            const rankImg = getRankImageSrc(rank);
            if (rankImg) imgs.push(rankImg);

            const achivementImg = getAchievementImages(achievements);
            imgs.push(...achivementImg);

            return imgs;
        },
        [achievements, rank, winPoints]
    );

    const allImgs = useMemo(
        function (): { src: string; isAchievement: boolean }[] {
            let initImgs = getAchievementsBoardImages();

            // Push all of the images in 'imgs' in front of 'initImgs'
            // and remove duplicates
            initImgs = [...imgs, ...initImgs].filter(
                (value, index, self) => self.indexOf(value) === index
            );

            console.log({ imgs, initImgs });

            return initImgs.map((img) => {
                return {
                    src: img,
                    isAchievement: imgs.includes(img),
                };
            });
        },
        [imgs]
    );

    return (
        <VStack alignItems="start" gap="12px" p={{ base: "10px", md: "1rem" }}>
            <Heading
                as="h2"
                fontSize={{ base: "20px", md: "24px" }}
                textAlign="center"
            >
                Achievements{" "}
                <Text fontSize="13px" as="span" color="gray.300">
                    (
                    <FontAwesomeIcon icon={faTrophy} size="sm" bounce />{" "}
                    {achievements.length + 2}/{allImgs.length})
                </Text>
            </Heading>

            <Wrap
                px="24px"
                py="1rem"
                borderRadius="10px"
                bgColor="gray.700"
                border="2px solid"
                borderColor="gray.500"
                as={motion.div}
                variants={container}
                initial="hidden"
                sx={{ "& ul": { justifyContent: "space-evenly" } }}
                animate="show"
            >
                {allImgs.map((img) => {
                    return (
                        <motion.div key={img.src} variants={item}>
                            <Image
                                src={img.src}
                                alt="Achievement"
                                h="80px"
                                w="80px"
                                objectFit="cover"
                                filter={
                                    !img.isAchievement ? "grayscale(100%)" : ""
                                }
                                opacity={!img.isAchievement ? 0.3 : 1}
                            />
                        </motion.div>
                    );
                })}
            </Wrap>
        </VStack>
    );
}
