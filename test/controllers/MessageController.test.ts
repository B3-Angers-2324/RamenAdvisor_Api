import { Request, Response } from 'express';
import MessageController from '../../src/controllers/MessageController';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';

import MessageService from '../../src/services/MessageService';
import RestaurantService from '../../src/services/RestaurantService';
import { ObjectId } from 'mongodb';
import { TRequest } from '../../src/controllers/types/types';

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
    queryMessagesForRestaurant: jest.fn(async (uid: string, limit: number, offset: number) => (uid=="test_full")?[{_id: "test_message", user: {_id: "user_id", firstName: "test", lastName: "test", image: "test"}, message: "test", date: "2023-11-21T17:06:58.026Z", note: 5, detailNote: "test"}]:[]),
    lasTimeUserSentMessage: jest.fn(async (userId: string) => {return (userId=="test_user_id")?{date: new Date()}:null;}),
    addMessage: jest.fn(async (message: any) => { return true;}),
}));

jest.mock('../../src/services/RestaurantService', () => ({
    restaurantExistsById: jest.fn(async (uid: string) => { return (uid=="test_full")?true:false;}),
}));

//Avoid the middleware connection
jest.mock('../../src/middleware/AdminMiddleware', () => ({
    adminLoginMiddleware: jest.fn( (req: Request, res: Response, next: Function) => { 
        next(); 
    }),
}));

jest.mock('../../src/middleware/UserMiddleware', () => ({
    userLoginMiddleware: jest.fn( (req: TRequest, res: Response, next: Function) => { 
        req = Object.assign(req, { token: { _id: "64a685757acccfac3d045af3" } });
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
            obj: [{ id: "test_message", user: { id: "user_id", firstName: "test", lastName: "test", img: "test" }, content: "test", date: "2023-11-21T17:06:58.026Z", note: 5, detailNote:"test"}],
            more: false
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
            obj: [{ id: "test_message", user: { id: "user_id", firstName: "test", lastName: "test", img: "test" }, content: "test", date: "2023-11-21T17:06:58.026Z", note: 5, detailNote:"test"}],
            more: false
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
            obj: [],
            more: false
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


describe('Add a message', () => {
    it("Should return a 200 when everything is correct", async () => {
        // Arrange
        const req = {
            params: {
                uid: "64a685757acccfac3d045ad9"
            },
            token: {
                _id: "test_user_id"
            },
            body: {
                message: "test_message",
                note: "5"
            }
        } as unknown as Request;
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


        jest.spyOn(RestaurantService, 'restaurantExistsById').mockResolvedValue(true);
        
        jest.spyOn(MessageService, 'lasTimeUserSentMessage').mockResolvedValue(null as never);

        jest.spyOn(MessageService, 'addMessage').mockResolvedValue(null as never);

 
        // Act
        await MessageController.addMessage(req, resMock);

        await statusPromise;

        // Assert
        expect(resMock.status).toHaveBeenCalledWith(200);//-----------------------------------------------
        expect(resMock.json).toHaveBeenCalledWith({"message": "Message added"});
    });

    it("Should return a 400 when no restaurant is provided", async () => {
        // Arrange
        const req = {
            params: {},
            token: {
                _id: "64a685757acccfac3d045ad9"
            },
            body: {
                message: "test_message",
                note: "5"
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await MessageController.addMessage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "No restaurant provided"});
    });

    it("Should return a 404 when the restaurant is not found", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_restaurant"
            },
            token: {
                _id: "test_user_id"
            },
            body: {
                message: "test_message",
                note: "5"
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Mock the restaurantExistsById function
        jest.spyOn(RestaurantService, 'restaurantExistsById').mockResolvedValue(false);

        // Act
        await MessageController.addMessage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({"message": "Restaurant not found"});
    });

    it("Should return a 400 when the user has already sent a message within the last 24 hours", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_restaurant"
            },
            token: {
                _id: "test_user_id"
            },
            body: {
                message: "test_message",
                note: "5"
            }
        } as unknown as Request;
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

        // Mock the restaurantExistsById function

        jest.spyOn(RestaurantService, 'restaurantExistsById').mockResolvedValue(true);

        // Mock the lasTimeUserSentMessage function
        const lastMessage = {
            _id: new ObjectId(),
            date: new Date()
        };
        jest.spyOn(MessageService, 'lasTimeUserSentMessage').mockResolvedValue(lastMessage);

        // Act
        await MessageController.addMessage(req, resMock);

        await statusPromise;

        // Assert
        expect(resMock.status).toHaveBeenCalledWith(400); ///-----------------------------------------------
        expect(resMock.json).toHaveBeenCalledWith({"message": "You can't send more than one message per day"});
    });

    it("Should return a 400 when missing field in body", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_restaurant"
            },
            token: {
                _id: "test_user_id"
            },
            body: {}
        } as unknown as Request;
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
        await MessageController.addMessage(req, resMock);

        await statusPromise;

        // Assert
        expect(resMock.status).toHaveBeenCalledWith(400);
        expect(resMock.json).toHaveBeenCalledWith({"message": "Missing field in body"});
    });

    it("Should return a 500 when an error occurs", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test_restaurant"
            },
            token: {
                _id: "test_user_id"
            },
            body: {
                message: "test_message",
                note: "5"
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Mock the restaurantExistsById function
        jest.spyOn(RestaurantService, 'restaurantExistsById').mockRejectedValue(new Error("Internal server error"));

        // Act
        await MessageController.addMessage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({"message": "Internal server error"});
    });
});