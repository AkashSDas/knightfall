import { Types } from "mongoose";
import { z } from "zod";

// ====================================
// Schemas
// ====================================

export const getLoggedInUserNotificationsSchema = z.object({
    query: z
        .object({
            limit: z
                .string()
                .regex(/^\d+$/)
                .transform((limit) => parseInt(limit, 10))
                .optional()
                .refine((val) => val > 0, {
                    message: "'limit' must be a positive integer.",
                })
                .refine((val) => val <= 20, {
                    message: "'limit' must not exceed 20.",
                }),
            offset: z
                .string()
                .regex(/^\d+$/)
                .transform((offset) => parseInt(offset, 10))
                .optional()
                .refine((val) => val >= 0, {
                    message: "'offset' must be a positive integer.",
                }),
        })
        .refine(
            (data) => {
                return !(data.limit !== undefined && data.offset === undefined);
            },
            { message: "'offset' must be provided if 'limit' is provided." },
        ),
});

export const markNotificationsAsSeenSchema = z.object({
    query: z
        .object({
            markAll: z
                .string()
                .refine((val) => val === "true", {
                    message: "'markAll' must be 'true'.",
                })
                .optional(),
            ids: z
                .string()
                .transform((ids) => ids.split(","))
                .refine((val) => val.length > 0, {
                    message: "'ids' must not be empty.",
                })
                .refine(
                    (val) => {
                        const validIds = val.map((id) =>
                            Types.ObjectId.isValid(id),
                        );
                        return !validIds.includes(false);
                    },
                    { message: "Invalid 'ids'." },
                )
                .optional(),
        })
        .refine(
            (data) => {
                // at least one has to be provided, either `ids` or `markAll`
                const bothAreEmpty = !data.markAll && !data.ids;
                return !bothAreEmpty;
            },
            { message: "One of 'ids' or 'markAll' must be provided." },
        ),
});

// ====================================
// Types
// ====================================

export type GetLoggedInUserNotificationsSchema = z.infer<
    typeof getLoggedInUserNotificationsSchema
>;
export type MarkNotificationsAsSeenSchema = z.infer<
    typeof markNotificationsAsSeenSchema
>;
