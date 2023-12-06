import { Request, Response } from 'express';
import RestaurantController from '../../src/controllers/RestaurantController';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';
import CheckInput from "../../src/tools/CheckInput";
import { TRequest } from '../../src/controllers/types/types';

// Mock the UserController module
jest.mock('../../src/services/RestaurantService', () => ({
    queryBestRestaurants: jest.fn( (limit: number) => {
        let out = (limit==1)?[{_id: "test", name: "test", foodtype: "test", note: 5, position: "test", images: ["test"]}]:[]
        if (limit==0) throw new Error()
        return out}),
    queryRestaurantById: jest.fn( (uid: string) => {
        return {_id: "test"}
    }),
    createRestaurant: jest.fn( (name: string, foodtype: string, note: number, position: string, images: string[]) => {
        return {_id: "test"}
    }),
    updateRestaurant: jest.fn( (uid: string, name: string, foodtype: string, note: number, position: string, images: string[]) => {
        return {_id: "test"}
    }),
}));

jest.mock('../../src/tools/CheckInput', () => ({
    areNotEmpty: jest.fn( (input: string[]) => {return true}),
    phone: jest.fn( (input: string) => {return true})
}));

jest.mock('../../src/middleware/OwnerMiddleware', () => ({
    ownerLoginMiddleware: jest.fn( (req: TRequest, res: Response, next: any) => {
        req = Object.assign(req, { token: { _id: "64a685757acccfac3d045af3" } });
        next();
    }),
}));

describe('getBestRestaurants', () => {
    describe('Get the best restaurant with result in the db', () => {
        it('Should return a 200 when everything is correct', async () => {
            // Arrange
            const req = {
                query: {
                    limit: 1
                }
            }as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            // Act
            await RestaurantController.getBestRestaurants(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    it('Should return a 404 with no result in the db', async () => {
        // Arrange
        const req = {
            query: {
                limit: 2
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await RestaurantController.getBestRestaurants(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
    });
    it ('Should return a 500 with an error', async () => {
        // Arrange
        const req = {
            query: {
                limit: 0
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await RestaurantController.getBestRestaurants(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe('getRestaurantById', () => {
    describe('Get the restaurant with id in the db', () => {
        it('Should return a 200 when everything is correct', async () => {
            // Arrange
            const req = {
                params: {
                    uid: "test"
                }
            }as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            // Act
            await RestaurantController.getRestaurantById(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    it('Should return a 400 with no uid', async () => {
        // Arrange
        const req = {
            params: {}
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // Act
        await RestaurantController.getRestaurantById(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
    });
});

describe('createRestaurant', () => {
    it("Should return a 200 when everything is correct", async () => {
        // Arrange
        const req = {
            body: {
                name: "test",
                foodtype: "test",
                note: 5,
                position: "test",
                images: ["test"]
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        //CheckInput
        jest.mocked(CheckInput.areNotEmpty).mockImplementation((input: string[]) => {return true})
        jest.mocked(CheckInput.phone).mockImplementation( (input: string) => {return true})


        // Act
        await RestaurantController.createRestaurant(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("Should return a 400 with Missing parameter", async () => {
        // Arrange
        const req = {
            body: {
                name: "test",
                foodtype: "test",
                note: 5,
                position: "test",
                images: ["test"]
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        //CheckInput
        jest.mocked(CheckInput.areNotEmpty).mockImplementation( (input: string[]) => {return false})
        jest.mocked(CheckInput.phone).mockImplementation( (input: string) => {return true})

        // Act
        await RestaurantController.createRestaurant(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "Missing parameters"});
    });
    it("Should return a 400 with Invalid phone number", async () => {
        // Arrange
        const req = {
            body: {
                name: "test",
                foodtype: "test",
                note: 5,
                position: "test",
                images: ["test"]
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        //CheckInput
        jest.mocked(CheckInput.areNotEmpty).mockImplementation( (input: string[]) => {return true})
        jest.mocked(CheckInput.phone).mockImplementation( (input: string) => {return false})

        // Act
        await RestaurantController.createRestaurant(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "Invalid phone number"});
    });
});

describe('updateRestaurant', () => {
    it("Should return a 200 when everything is correct", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test"
            },
            body: {
                name: "test",
                foodtype: "test",
                note: 5,
                position: "test",
                images: ["test"]
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        //CheckInput
        jest.mocked(CheckInput.areNotEmpty).mockImplementation((input: string[]) => {return true})
        jest.mocked(CheckInput.phone).mockImplementation( (input: string) => {return true})

        // Act
        await RestaurantController.updateRestaurant(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("Should return a 400 with Missing parameter", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test"
            },
            body: {
                name: "test",
                foodtype: "test",
                note: 5,
                position: "test",
                images: ["test"]
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        //CheckInput
        jest.mocked(CheckInput.areNotEmpty).mockImplementation( (input: string[]) => {return false})
        jest.mocked(CheckInput.phone).mockImplementation( (input: string) => {return true})

        // Act
        await RestaurantController.updateRestaurant(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "Missing parameters"});
    });
    it("Should return a 400 with Invalid phone number", async () => {
        // Arrange
        const req = {
            params: {
                uid: "test"
            },
            body: {
                name: "test",
                foodtype: "test",
                note: 5,
                position: "test",
                images: ["test"]
            }
        }as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        //CheckInput
        jest.mocked(CheckInput.areNotEmpty).mockImplementation( (input: string[]) => {return true})
        jest.mocked(CheckInput.phone).mockImplementation( (input: string) => {return false})

        // Act
        await RestaurantController.updateRestaurant(req, res)

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "Invalid phone number"});
    });
});