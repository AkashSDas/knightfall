/**
 * Type utility to get union of all of the values of a record.
 *
 * For example:
 * ```typescript
 * const CHESS_PIECES = {
 *     BISHOP: "bishop",
 *     KING: "king",
 *     KNIGHT: "knight",
 *     PAWN: "pawn",
 *     QUEEN: "queen",
 *     ROOK: "rook",
 * } as const;
 *
 * type ChessPiece = ValueOf<typeof CHESS_PIECES>;
 * // i.e.
 * type ChessPiece = "bishop" | "king" | "knight" | "pawn" | "queen" | "rook"
 * ```
 **/
export type ValueOf<T extends Record<string, string>> = T[keyof T];
