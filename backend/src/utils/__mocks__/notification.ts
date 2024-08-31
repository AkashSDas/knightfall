import { jest } from "@jest/globals";

export const Notify = jest.fn().mockImplementation(() => {
    return {
        createNotification: jest.fn<any>().mockImplementation(() => {
            return Promise.resolve({
                sendNotification: jest.fn(),
            });
        }),
        sendNotification: jest.fn(),
    };
});
