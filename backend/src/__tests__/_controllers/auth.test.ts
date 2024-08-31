import supertest from "supertest";

import { app } from "@/api";
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
});
