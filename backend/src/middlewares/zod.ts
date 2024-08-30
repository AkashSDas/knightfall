import type { NextFunction, Request, Response } from "express";
import { type AnyZodObject, ZodError } from "zod";

/**
 * Validate request's body, params and query as per the Zod schema. If the request
 * is invalid, then it will send a response with status 400 and the error message.
 *
 * @remark If the path isn't defined in the schema, then `err.path[1]` will be undefined.
 * So include path while defining the schema even for the `refine` method
 *
 * @param schema Zod schema to validate the request body
 * @returns Middleware function
 *
 * @example
 * An example for the errors in data sent by the client:
 * ```json
 * {
 *   "errors": [
 *     {
 *       "field": "fullName",
 *       "msg": "Fullname is required"
 *     },
 *     {
 *       "field": "confirmPassword",
 *       "msg": "Password and confirm password does not match"
 *     }
 *   ]
 * }
 * ```
 *
 * @example
 * An example for `path` inside `.refine`:
 * ```typescript
 * export const signupSchema = z.object({
 *   body: z.object({
 *     username: z
 *       .string({ required_error: "Required" })
 *       .min(3, "Too short")
 *       .max(32, "Too long"),
 *     email: z.string({ required_error: "Required" }).email("Invalid"),
 *     password: z
 *       .string({ required_error: "Required" })
 *       .min(8, "Too short")
 *       .max(64, "Too long")
 *       .refine(
 *         function checkPasswordStrength(pwd) {
 *           return passwordRegex.test(pwd);
 *         },
 *         { message: "Weak", path: ["password"] }
 *       ),
 *   }),
 * });
 * ```
 */
export function validateResource(schema: AnyZodObject) {
    return function validateResourceMiddleware(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // If the schema is able to parse the given fields then it means that
            // user has provided the required fields
            const output = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            req.body = output.body;
            req.query = output.query;
            req.params = output.params;
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Missing or invalid fields",
                    errors: error.errors.map(function parseError(err) {
                        return { field: err.path[1], message: err.message };
                    }),
                });
            }

            return res.status(500).json({ message: "Internal server error" });
        }
    };
}
