import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import OwnerServices from '../../src/services/OwnerService';
import RestaurantServices from '../../src/services/RestaurantService';
import OwnerController from '../../src/controllers/OwnerController';
import { TRequest } from '../../src/controllers/types/types';

import dotenv from 'dotenv';
dotenv.config();

jest.mock('jsonwebtoken');
jest.mock('../../src/services/OwnerService');
jest.mock('../../src/services/RestaurantService');

describe('OwnerController - login', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a token if the email and password are correct', async () => {
    const owner = {
      _id: 'ownerId',
      password: 'password123',
    };
    const secret = process.env.JWT_SECRET_OWNER || 'ASecretPhrase';
    const token = 'generatedToken';

    (OwnerServices.getOneOwner as jest.Mock).mockResolvedValue(owner as never);
    (jwt.sign as jest.Mock).mockReturnValue(token);

    await OwnerController.login(req, res);

    expect(OwnerServices.getOneOwner).toHaveBeenCalledWith(req.body.email);
    expect(jwt.sign).toHaveBeenCalledWith({ _id: owner._id?.toString() }, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ token });
  });

  test('should return an unauthorized status if the password is incorrect', async () => {
    const owner = {
      _id: 'ownerId',
      password: 'wrongPassword',
    };

    (OwnerServices.getOneOwner as jest.Mock).mockResolvedValue(owner as never);

    await OwnerController.login(req, res);

    expect(OwnerServices.getOneOwner).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' });
  });

  test('should return a not found status if the owner does not exist', async () => {
    (OwnerServices.getOneOwner as jest.Mock).mockResolvedValue(null as never);

    await OwnerController.login(req, res);

    expect(OwnerServices.getOneOwner).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'Owner not found' });
  });

  test('should return an internal server error status if an error occurs', async () => {
    (OwnerServices.getOneOwner as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await OwnerController.login(req, res);

    expect(OwnerServices.getOneOwner).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while logging in' });
  });
});


describe('OwnerController - register', () => {

    test('should register a new owner and return a token', async () => {
    const req = {
        body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        companyName: 'ACME Inc.',
        password: 'password123',
        siret: '123456789',
        socialAdresse: '123 Main St',
        },
    } as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    const newOwner = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        companyName: req.body.companyName,
        password: req.body.password,
        siret: req.body.siret,
        socialAdresse: req.body.socialAdresse,
    };

    const owner = null; // Mocking that owner does not exist
    const addedOwner = { insertedId: 'ownerId' };
    const secret = process.env.JWT_SECRET_OWNER || 'ASecretPhrase';
    const token = 'generatedToken';

    (OwnerServices.getOneOwner as jest.Mock).mockResolvedValue(owner as never);
    (OwnerServices.addOwner as jest.Mock).mockResolvedValue(addedOwner as never);
    (jwt.sign as jest.Mock).mockReturnValue(token);

    await OwnerController.register(req, res);

    expect(OwnerServices.getOneOwner).toHaveBeenCalledWith(newOwner.email);
    expect(OwnerServices.addOwner).toHaveBeenCalledWith(newOwner);
    expect(jwt.sign).toHaveBeenCalledWith({ _id: addedOwner.insertedId?.toString() }, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(res.json).toHaveBeenCalledWith({ token });
    });

    test('should return a bad request status if the email format is incorrect', async () => {
    const req = {
        body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalidemail',
        companyName: 'ACME Inc.',
        password: 'password123',
        siret: '123456789',
        socialAdresse: '123 Main St',
        },
    } as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    await OwnerController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email format is not correct' });
    });

    test('should return a conflict status if the owner already exists', async () => {
    const req = {
        body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        companyName: 'ACME Inc.',
        password: 'password123',
        siret: '123456789',
        socialAdresse: '123 Main St',
        },
    } as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    const owner = { _id: 'ownerId' };

    (OwnerServices.getOneOwner as jest.Mock).mockResolvedValue(owner as never);

    await OwnerController.register(req, res);

    expect(OwnerServices.getOneOwner).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(res.json).toHaveBeenCalledWith({ message: 'Owner already exists' });
    });

    test('should return an internal server error status if an error occurs while adding owner', async () => {
    const req = {
        body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        companyName: 'ACME Inc.',
        password: 'password123',
        siret: '123456789',
        socialAdresse: '123 Main St',
        },
    } as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    const owner = null; // Mocking that owner does not exist

    (OwnerServices.getOneOwner as jest.Mock).mockResolvedValue(owner as never);
    (OwnerServices.addOwner as jest.Mock).mockResolvedValue(null as never);

    await OwnerController.register(req, res);

    expect(OwnerServices.getOneOwner).toHaveBeenCalledWith(req.body.email);
    expect(OwnerServices.addOwner).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding owner' });
    });

    test('should return an internal server error status if an error occurs', async () => {
    const req = {
        body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        companyName: 'ACME Inc.',
        password: 'password123',
        siret: '123456789',
        socialAdresse: '123 Main St',
        },
    } as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    (OwnerServices.getOneOwner as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await OwnerController.register(req, res);

    expect(OwnerServices.getOneOwner).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding owner, check if all fields are correct' });
    });
});


describe('OwnerController - getRestaurantsByOwner', () => {


    test('should return restaurants if found', async () => {
        const req = {
            token: { _id: 'ownerId' },
        } as TRequest;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const restaurants: unknown = [{ name: 'Restaurant 1' }, { name: 'Restaurant 2' }];

        (RestaurantServices.queryRestaurantsByOwner as jest.Mock).mockResolvedValue(restaurants as never);

        await OwnerController.getRestaurantsByOwner(req, res);

        expect(RestaurantServices.queryRestaurantsByOwner).toHaveBeenCalledWith(req.token?._id);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
        expect(res.json).toHaveBeenCalledWith({ restaurants });
    });

        test('should return not found if no restaurants found', async () => {
        const req = {
            token: { _id: 'ownerId' },
        } as TRequest;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        (RestaurantServices.queryRestaurantsByOwner as jest.Mock).mockResolvedValue(null as never);

        await OwnerController.getRestaurantsByOwner(req, res);

        expect(RestaurantServices.queryRestaurantsByOwner).toHaveBeenCalledWith(req.token?._id);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ message: 'No restaurant found' });
        });

        test('should return internal server error if an error occurs', async () => {
        const req = {
            token: { _id: 'ownerId' },
        } as TRequest;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        (RestaurantServices.queryRestaurantsByOwner as jest.Mock).mockRejectedValue(new Error('Some error') as never);

        await OwnerController.getRestaurantsByOwner(req, res);

        expect(RestaurantServices.queryRestaurantsByOwner).toHaveBeenCalledWith(req.token?._id);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting restaurants' });
    });
});