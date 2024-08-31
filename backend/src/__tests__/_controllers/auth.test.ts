import crypto from "crypto";
import supertest from "supertest";

import { app } from "@/api";
import { User } from "@/models/user";
import { REFRESH_TOKEN_COOKIE_KEY } from "@/utils/auth";
import { sendEmail } from "@/utils/email";
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from "@jest/globals";

import { inMemoryMongoDB } from "../db";
import { userStub } from "../stubs/user";

jest.mock("@/utils/email");
jest.mock("@/utils/notification");

describe("Auth Controllers", () => {
    let request: ReturnType<typeof supertest>;

    beforeAll(async function connectToMongoDB() {
        request = supertest(app);
        inMemoryMongoDB.connect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async function disconnectFromMongoDB() {
        inMemoryMongoDB.disconnect();
    });

    describe("emailSignupCtrl", () => {
        describe("when invalid payload is provided", () => {
            it("should give validation error", async () => {
                const res = await request.post("/api/auth/signup").send({});

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    message: "Missing or invalid fields",
                    errors: [
                        {
                            field: "username",
                            message: "Required",
                        },
                        {
                            field: "email",
                            message: "Required",
                        },
                    ],
                });
            });
        });

        describe("when valid payload is provided", () => {
            it("should create a user", async () => {
                const res = await request.post("/api/auth/signup").send({
                    username: userStub().username,
                    email: userStub().email,
                });

                expect(res.status).toBe(201);
                expect(res.body).toEqual({ message: "Account created" });
            });
        });

        describe("when username is taken", () => {
            beforeEach(async () => {
                await request.post("/api/auth/signup").send({
                    username: userStub().username,
                    email: "new@gmail.com",
                });
            });

            it("should give error", async () => {
                const res = await request.post("/api/auth/signup").send({
                    username: userStub().username,
                    email: userStub().email,
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    message: "Username/email already used",
                });
            });
        });

        describe("when email is taken", () => {
            beforeEach(async () => {
                await request.post("/api/auth/signup").send({
                    username: "NewName",
                    email: userStub().email,
                });
            });

            it("should give error", async () => {
                const res = await request.post("/api/auth/signup").send({
                    username: userStub().username,
                    email: userStub().email,
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    message: "Username/email already used",
                });
            });
        });
    });

    describe("initMagicLinkLoginCtrl", () => {
        describe("when the email is not registered", () => {
            it("should return 404 error", async () => {
                const res = await request.post("/api/auth/login").send({
                    email: "nonexistent@example.com",
                });

                expect(res.status).toBe(404);
                expect(res.body).toEqual({ message: "User not found" });
            });
        });

        describe("when the email is registered", () => {
            beforeEach(async () => {
                await request.post("/api/auth/signup").send({
                    username: userStub().username,
                    email: userStub().email,
                });
            });

            it("should send an email with the magic link", async () => {
                const res = await request.post("/api/auth/login").send({
                    email: userStub().email,
                });

                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    message:
                        "Email with login magic link is sent to your email.",
                });

                expect(sendEmail).toHaveBeenCalledWith(
                    expect.objectContaining({
                        to: userStub().email,
                        subject: "Magic link login",
                        text: expect.any(String),
                        html: expect.any(String),
                    }),
                );
            });

            it("should return 200 even if failed to send email", async () => {
                (sendEmail as jest.Mock<any>).mockRejectedValueOnce(
                    new Error("Email failed"),
                );

                const res = await request.post("/api/auth/login").send({
                    email: userStub().email,
                });

                expect(res.status).toBe(200);
            });
        });
    });

    describe("completeMagicLinkLoginCtrl", () => {
        let validToken: string;
        let invalidToken: string;

        beforeEach(async () => {
            await request.post("/api/auth/signup").send({
                username: userStub().username,
                email: userStub().email,
            });
            const user = await User.findOne({ email: userStub().email });

            validToken = user.createMagicLinkToken();
            invalidToken = crypto
                .createHash("sha256")
                .update("invalidToken")
                .digest("hex");

            user.magicLinkToken = crypto
                .createHash("sha256")
                .update(validToken)
                .digest("hex");
            user.magicLinkTokenExpiresAt = new Date(
                Date.now() + 10 * 60 * 1000,
            ); // 10 minutes from now

            await user.save({ validateModifiedOnly: true });
        });

        describe("when an invalid token is provided", () => {
            it("should return a 400 error", async () => {
                const res = await request.get(
                    `/api/auth/login/${invalidToken}`,
                );

                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "Invalid token" });
            });
        });

        describe("when a valid token is provided", () => {
            it("should log the user in and return access and refresh tokens", async () => {
                const res = await request.get(`/api/auth/login/${validToken}`);

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("accessToken");
                expect(res.body).toHaveProperty("user");
                expect(res.headers["set-cookie"]).toEqual(
                    expect.arrayContaining([
                        expect.stringContaining(REFRESH_TOKEN_COOKIE_KEY),
                    ]),
                );

                const user = await User.findOne({ email: userStub().email });
                expect(user).toBeDefined();
                expect(user?.magicLinkToken).toBeUndefined();
                expect(user?.magicLinkTokenExpiresAt).toBeUndefined();
            });
        });

        describe("when the token is expired", () => {
            beforeEach(async () => {
                const user = await User.findOne({ email: userStub().email });
                if (user) {
                    user.magicLinkTokenExpiresAt = new Date(Date.now() - 1); // Set expiration to the past

                    // Since there's validation which checks the date set should be in future
                    // That's why disabling validation here
                    await user.save({ validateBeforeSave: false });
                }
            });

            it("should return a 400 error", async () => {
                const res = await request.get(`/api/auth/login/${validToken}`);

                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "Invalid token" });
            });
        });
    });
});
