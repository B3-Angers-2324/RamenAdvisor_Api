import { Request, Response } from 'express';
import MessageController from '../../src/controllers/MessageController';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';

// Mock the UserController module
jest.mock('../../src/services/ReportService', () => ({
    getReportByMessageId: jest.fn(async (uid: string) => { 
        return (uid=="test_full")?{id: "test_report"}:null; 
    }),
    addReport: jest.fn(async (userId: string, messageId: string, restaurantId: string) => { 
        return true; 
    }),
    updateReport: jest.fn(async (report: any) => { 
        return true; 
    }),
    queryReportedMessages: jest.fn(async (limit: number, offset: number) => { 
        return []; 
    }),
    getReportById: jest.fn(async (uid: string) => { 
        return (uid=="test_full")?{messageId: "test_report"}:null; 
    }),
    deleteReport: jest.fn(async (uid: string) => { return true;}),
}));

jest.mock('../../src/services/MessageService', () => ({
    getMessagesForRestaurant: jest.fn(async (uid: string, limit: number, offset: number) => {
        return (uid=="test_full")?[{id: "test_message"}]:[];
    }),
    deleteMessage: jest.fn(async (uid: string) => {return true;}),
    queryMessagesForRestaurant: jest.fn(async (uid: string, limit: number, offset: number) => (uid=="test_full")?[{_id: "test_message", user: {_id: "user_id", firstName: "test", lastName: "test", image: "test"}, message: "test", date: "2023-11-21T17:06:58.026Z", note: 5}]:[]),
}));

//Avoid the middleware connection
jest.mock('../../src/middleware/AdminMiddleware', () => ({
    adminLoginMiddleware: jest.fn( (req: Request, res: Response, next: Function) => { 
        next(); 
    }),
}));


describe('Get messages for a restaurant', () => {
    it("Should return a 200 when everything is correct", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_full"
            },
            query: {
                limit: 10,
                offset: 0
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.getMessagesForRestaurant(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            number: 1,
            obj: [{ id: "test_message", user: { id: "user_id", firstName: "test", lastName: "test", img: "test" }, content: "test", date: "2023-11-21T17:06:58.026Z", note: 5 }]
        });
    });
    it("Should return a 200 when everything is correct with no limit nor offset", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_full"
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.getMessagesForRestaurant(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            number: 1,
            obj: [{ id: "test_message", user: { id: "user_id", firstName: "test", lastName: "test", img: "test" }, content: "test", date: "2023-11-21T17:06:58.026Z", note: 5 }]
        });
    });
    it ("Should return a empty list when there is no message for that restaurant", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_empty"
            },
            query: {
                limit: 10,
                offset: 0
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.getMessagesForRestaurant(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            number: 0,
            obj: []
        });
    });
    it ("Should return a 400 list when there is no uid ", async () => {
        // Arrange
        const req = {
            params: {},
            query: {
                limit: 10,
                offset: 0
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.getMessagesForRestaurant(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "No id provided"});
    });
});


describe('Report a message', () => {
    describe('Report a message for the moderator to forsee', () => {
        it('Should return a 200 when everything is correct wirth a new report', async () => {
            // Arrange
            const req = {
                params: {
                    uid: "test_empty"
                },
                body:{
                    userId: "test",
                    restaurantId: "test",
                    messageId: "test"
                }
            }as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            // Act
            await MessageController.reportMessage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({"message": "Report added"});
        });

        it("Should return a 200 when everything is correct wirth a report that already exist", async () => {
            // Arrange
            const req = {
                params: {
                    uid: "test_full"
                },
                body: {
                    userId: "test",
                    restaurantId: "test",
                    messageId: "test"
                }
            }as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            // Act
            await MessageController.reportMessage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({"message": "Report added"});
        });
        it("Should return a 400 when there is no uid", async () => {
            // Arrange
            const req = {
                params: {},
                body: {
                    userId: "test",
                    restaurantId: "test",
                    messageId: "test"
                }
            }as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            // Act
            await MessageController.reportMessage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({"message": "No id provided"});
        });
        it("Should return a 400 when there is no body or missing field", async () => {
            // Arrange
            const req = {
                params: {
                    uid: "test_full"
                },
                body: {}
            }as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            // Act
            await MessageController.reportMessage(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({"message": "Missing field in body"});
        });
    });
});

describe("Get reported messages", () => {
    it("Should return a 200 when everything is correct", async () => {
        // Arrange
        const req = {
            query: {
                limit: 10,
                offset: 0
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.getReportedMessages(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            number: 0,
            obj: []
        });
    });
    it("Should return a 200 whi no limit nor offset provided", async () => {
        // Arrange
        const req = {
            query: {}
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.getReportedMessages(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            number: 0,
            obj: []
        });
    });
});

describe("Delete a report", () => {
    /* Work */
    it("Should return a 200 when everything is correct and the message is rejected", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_full"
            },
            query: {
                rejected: "true"
            }
        }as unknown as Request;
        /*const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;*/

        let resolveStatusPromise: (value: unknown) => void;
        const statusPromise = new Promise(resolve => {
            resolveStatusPromise = resolve;
        });

        const resMock = {
            status: jest.fn().mockImplementation(() => {
                resolveStatusPromise(null);
                return resMock;
            }),
            json: jest.fn(),
        } as unknown as Response;


        // Act
        await MessageController.deleteReport(req, resMock);

        // Wait for the status function to be called
        await statusPromise;

        // Assert
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({"message": "Report deleted"});
    });
    it("Should return a 200 when everything is correct and the message is not rejected", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_full"
            },
            query: {
                rejected: "false"
            }
        }as unknown as Request;
        let resolveStatusPromise: (value: unknown) => void;
        const statusPromise = new Promise(resolve => {
            resolveStatusPromise = resolve;
        });

        const resMock = {
            status: jest.fn().mockImplementation(() => {
                resolveStatusPromise(null);
                return resMock;
            }),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.deleteReport(req, resMock);

        // Wait for the status function to be called
        await statusPromise;
        // Assert
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({"message": "Report deleted"});
    });
    /* Don't work */
    it("Should return a 404 when there is no report for that uid", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_empty"
            },
            query: {
                rejected: "true"
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.deleteReport(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({"message": "Report not found"});
    });
    it("Should return a 400 when there is no rejected parameter", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_full"
            },
            query: {}
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.deleteReport(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "No rejected parameter provided"});
    });
    it("Should return a 400 when there is no uid parameter", async () => {
        // Arrange
        const req = {
            params: {},
            query: {
                rejected: "true"
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.deleteReport(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "No id provided"});
    });
});
