import { Request, Response } from 'express';
import RestaurantController from '../../src/controllers/RestaurantController';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, jest} from '@jest/globals';
import CheckInput from "../../src/tools/CheckInput";
import { TRequest } from '../../src/controllers/types/types';
import RestaurantService from '../../src/services/RestaurantService';
import ImageContoller from '../../src/controllers/ImageContoller';
import MessageService from '../../src/services/MessageService';
import HttpStatus from '../../src/constants/HttpStatus';

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
    updateRestaurantImage: jest.fn( (uid: string, imageNb: number, image: string, deleteOldImage: boolean) => {
        return {_id: "test"}
    }),
    deleteRestaurant: jest.fn( (uid: string) => {
        return true
    }),
}));

jest.mock('../../src/tools/CheckInput', () => ({
    areNotEmpty: jest.fn( (input: string[]) => {return true}),
    phone: jest.fn( (input: string) => {return true}),
    isImage: jest.fn( (input: string) => {return true}),
    isUnder15Mo: jest.fn( (input: number) => {return true}),
}));

jest.mock('../../src/middleware/OwnerMiddleware', () => ({
    ownerLoginMiddleware: jest.fn( (req: TRequest, res: Response, next: any) => {
        req = Object.assign(req, { token: { _id: "64a685757acccfac3d045af3" } });
        next();
    }),
}));

jest.mock('../../src/controllers/ImageContoller', () => ({
    deleteImage: jest.fn( (uid: string) => {return true}),
    addImage: jest.fn( (image: Buffer, mimetype: string) => {return "000000000000000000000002"}),
}));

jest.mock('../../src/services/MessageService', () => ({
    deleteAllMessagesForRestaurant: jest.fn( (uid: string) => {return true}),
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

// ---------------------------------------------------------------------------------

describe('updateRestaurantImage', () => {
    it('Should return a 200 and update the image', async () => {
        // Arrange
        const req = {
            params: {
                uid: "test",
                imageNb: 0
            },
            file: {
                mimetype: "image/jpeg",
                size: 100,
                buffer: Buffer.from("test")
            }
        } as unknown as Request;
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn(),
        // } as unknown as Response;

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

        // mock
        (CheckInput.isImage as jest.Mock).mockReturnValue(true);
        (CheckInput.isUnder15Mo as jest.Mock).mockReturnValue(true);
        (RestaurantService.queryRestaurantById as jest.Mock).mockReturnValue({_id: "test", images: ["oldImage"]});
        (ImageContoller.deleteImage as jest.Mock).mockReturnValue(true);
        (ImageContoller.addImage as jest.Mock).mockReturnValue("000000000000000000000002");
        (RestaurantService.updateRestaurantImage as jest.Mock).mockReturnValue({_id: "000000000000000000000002"});

        // Act
        await RestaurantController.updateRestaurantImage(req, resMock);

        await statusPromise;
        // Assert
        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({ "message": "Image updated" });
    });

    it('Should return a 404 if the restaurant is not found', async () => {
        // Arrange
        const req = {
            params: {
                uid: "test",
                imageNb: 0
            },
            file: {
                mimetype: "image/jpeg",
                size: 100,
                buffer: Buffer.from("test")
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // mock
        (CheckInput.isImage as jest.Mock).mockReturnValue(true);
        (CheckInput.isUnder15Mo as jest.Mock).mockReturnValue(true);
        (RestaurantService.queryRestaurantById as jest.Mock).mockReturnValue(null);

        // Act
        await RestaurantController.updateRestaurantImage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({"message": "Restaurant not found"});
        expect(RestaurantService.queryRestaurantById).toHaveBeenCalledWith("test");
    });

    it('Should return a 400 if the image is not an image', async () => {
        // Arrange
        const req = {
            params: {
                uid: "test",
                imageNb: 0
            },
            file: {
                mimetype: "text/plain",
                size: 100,
                buffer: Buffer.from("test")
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // mock
        (CheckInput.isImage as jest.Mock).mockReturnValue(false);

        // Act
        await RestaurantController.updateRestaurantImage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "Image must be a jpg, png, jpeg or gif"});
        expect(RestaurantService.queryRestaurantById).toHaveBeenCalledWith("test");
        expect(CheckInput.isImage).toHaveBeenCalledWith("text/plain");
    });

    it('Should return a 400 if the image is over 15Mo', async () => {
        // Arrange
        const req = {
            params: {
                uid: "test",
                imageNb: 0
            },
            file: {
                mimetype: "image/jpeg",
                size: 20000000,
                buffer: Buffer.from("test")
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // mock
        (CheckInput.isImage as jest.Mock).mockReturnValue(true);
        (CheckInput.isUnder15Mo as jest.Mock).mockReturnValue(false);

        // Act
        await RestaurantController.updateRestaurantImage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"message": "Image must be under 15Mo"});
        expect(RestaurantService.queryRestaurantById).toHaveBeenCalledWith("test");
        expect(CheckInput.isImage).toHaveBeenCalledWith("image/jpeg");
        expect(CheckInput.isUnder15Mo).toHaveBeenCalledWith(20000000);
    });

    it('Should return a 500 with an error message', async () => {
        // Arrange
        const req = {
            params: {
                uid: "test",
                imageNb: 0
            },
            file: {
                mimetype: "image/jpeg",
                size: 100,
                buffer: Buffer.from("test")
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        // mock
        (CheckInput.isImage as jest.Mock).mockReturnValue(true);
        (CheckInput.isUnder15Mo as jest.Mock).mockReturnValue(true);
        (RestaurantService.queryRestaurantById as jest.Mock).mockImplementation(() => {throw new Error()});
        (ImageContoller.deleteImage as jest.Mock).mockReturnValue(true);
        (ImageContoller.addImage as jest.Mock).mockReturnValue("newImage");

        // Act
        await RestaurantController.updateRestaurantImage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({"message": "Internal server error"});
        expect(RestaurantService.queryRestaurantById).toHaveBeenCalledWith("test");
    });
});

// ---------------------------------------------------------------------------------

describe('deleteRestaurant', () => {
    it('Should delete the restaurant and return a 200 status code', async () => {
        // Arrange
        const req = {
            params: {
                uid: "test"
            }
        } as unknown as Request;
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn(),
        // } as unknown as Response;

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

        (RestaurantService.queryRestaurantById as jest.Mock).mockResolvedValueOnce({_id: "test", images: ["image1.jpg", "image2.jpg"]} as never);
        (ImageContoller.deleteImage as jest.Mock).mockResolvedValueOnce(true as never);
        (MessageService.deleteAllMessagesForRestaurant as jest.Mock).mockResolvedValueOnce(true as never);
        (RestaurantService.deleteRestaurant as jest.Mock).mockResolvedValueOnce(true as never);

        // Act
        await RestaurantController.deleteRestaurant(req, resMock);

        await statusPromise;

        // Assert
        expect(RestaurantService.queryRestaurantById).toHaveBeenCalledWith("test");
        expect(ImageContoller.deleteImage).toHaveBeenCalledTimes(3);
        expect(resMock.status).toHaveBeenCalledWith(HttpStatus.OK);
        expect(resMock.json).toHaveBeenCalledWith({"message": "Restaurant deleted"});
    });

    it('Should return a 404 status code if the restaurant is not found', async () => {
        // Arrange
        const req = {
            params: {
                uid: "test"
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        (RestaurantService.queryRestaurantById as jest.Mock).mockResolvedValueOnce(null as never);

        // Act
        await RestaurantController.deleteRestaurant(req, res);

        // Assert
        expect(RestaurantService.queryRestaurantById).toHaveBeenCalledWith("test");
        expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({"message": "Restaurant not found"});
    });

    it('Should return a 500 status code if an error occurs', async () => {
        // Arrange
        const req = {
            params: {
                uid: "test"
            }
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        (RestaurantService.queryRestaurantById as jest.Mock).mockRejectedValueOnce(new Error("Internal server error") as never);

        // Act
        await RestaurantController.deleteRestaurant(req, res);

        // Assert
        expect(RestaurantService.queryRestaurantById).toHaveBeenCalledWith("test");
        expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({"message": "Internal server error"});
    });
});