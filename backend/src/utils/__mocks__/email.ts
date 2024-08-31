import { jest } from "@jest/globals";

export const sendEmail = jest.fn().mockImplementation(() => {
    return Promise.resolve({});
});
