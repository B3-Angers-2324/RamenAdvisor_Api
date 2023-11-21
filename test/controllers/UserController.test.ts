import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import UserServices from '../../src/services/UserService';
import UserController from '../../src/controllers/UserController';
import CheckInput from '../../src/tools/CheckInput';

import dotenv from 'dotenv';
dotenv.config();

jest.mock('jsonwebtoken');
jest.mock('../../src/services/UserService');
jest.mock('../../src/tools/CheckInput');

describe('UserController - login', () => {
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
    const user = {
      _id: 'userId',
      password: 'password123',
    };
    const secret = process.env.JWT_SECRET_USER || 'ASecretPhrase';
    const token = 'generatedToken';

    (UserServices.getOneUser as jest.Mock).mockResolvedValue(user as never);
    (jwt.sign as jest.Mock).mockReturnValue(token);

    await UserController.login(req, res);

    expect(UserServices.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(jwt.sign).toHaveBeenCalledWith({ _id: user._id?.toString() }, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ token });
  });

  test('should return an unauthorized status if the password is incorrect', async () => {
    const user = {
      _id: 'userId',
      password: 'wrongPassword',
    };

    (UserServices.getOneUser as jest.Mock).mockResolvedValue(user as never);

    await UserController.login(req, res);

    expect(UserServices.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' });
  });

  test('should return a not found status if the user does not exist', async () => {
    (UserServices.getOneUser as jest.Mock).mockResolvedValue(null as never);

    await UserController.login(req, res);

    expect(UserServices.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should return a bad request status if email or password are missing', async () => {
    req.body.email = '';
    req.body.password = '';

    await UserController.login(req, res);

    expect(UserServices.getOneUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });

  test('should return an internal server error status if an error occurs', async () => {
    (UserServices.getOneUser as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await UserController.login(req, res);

    expect(UserServices.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while logging in' });
  });
});


describe('UserController - register', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        birthDay: '1990-01-01',
        email: 'john.doe@example.com',
        phone: '1234567890',
        sexe: 'male',
        ville: 'New York',
        address: '123 Main St',
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

  test('should return a token if all fields are provided and valid', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      birthDay: '1990-01-01',
      email: 'john.doe@example.com',
      phone: '1234567890',
      sexe: 'male',
      ville: 'New York',
      address: '123 Main St',
      password: 'password123',
      image: 'http://thispersondoesnotexist.com/',
      ban: false,
    };

    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(true);
    (CheckInput.password as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (UserServices.getOneUser as jest.Mock).mockResolvedValue(null as never);
    (UserServices.addUser as jest.Mock).mockResolvedValue({ insertedId: 'userId' } as never);
    (jwt.sign as jest.Mock).mockReturnValue('generatedToken');

    await UserController.register(req, res);

    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
      req.body.password,
    ]);
    expect(CheckInput.email).toHaveBeenCalledWith(req.body.email);
    expect(CheckInput.password).toHaveBeenCalledWith(req.body.password);
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(UserServices.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(UserServices.addUser).toHaveBeenCalledWith(newUser);
    expect(jwt.sign).toHaveBeenCalledWith({ _id: 'userId' }, process.env.JWT_SECRET_USER || 'ASecretPhrase', {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(res.json).toHaveBeenCalledWith({ token: 'generatedToken' });
  });

  test('should return a bad request status if any field is missing', async () => {
    req.body.firstName = '';
    req.body.lastName = '';
    req.body.birthDay = '';
    req.body.email = '';
    req.body.phone = '';
    req.body.sexe = '';
    req.body.ville = '';
    req.body.address = '';
    req.body.password = '';

    await UserController.register(req, res);

    expect(CheckInput.areNotEmpty).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
  });

  test('should return a bad request status if any field is not valid', async () => {
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(false);
    (CheckInput.password as jest.Mock).mockReturnValue(false);
    (CheckInput.phone as jest.Mock).mockReturnValue(false);

    await UserController.register(req, res);

    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
      req.body.password,
    ]);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email format is not correct' });
  });

  test('should return a conflict status if the user already exists', async () => {
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(true);
    (CheckInput.password as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (UserServices.getOneUser as jest.Mock).mockResolvedValue({ _id: 'userId' } as never);

    await UserController.register(req, res);

    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
      req.body.password,
    ]);
    expect(CheckInput.email).toHaveBeenCalledWith(req.body.email);
    expect(CheckInput.password).toHaveBeenCalledWith(req.body.password);
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(UserServices.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  test('should return an internal server error status if an error occurs', async () => {
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(true);
    (CheckInput.password as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (UserServices.getOneUser as jest.Mock).mockRejectedValue(new Error('Some error') as never);
    (UserServices.addUser as jest.Mock).mockResolvedValue(null as never);

    await UserController.register(req, res);

    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
      req.body.password,
    ]);
    expect(CheckInput.email).toHaveBeenCalledWith(req.body.email);
    expect(CheckInput.password).toHaveBeenCalledWith(req.body.password);
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(UserServices.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding user, check if all fields are correct' });
  });
});


describe('UserController - getAll', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all users', async () => {
    const userlist = [
      { _id: 'userId1', name: 'User 1' },
      { _id: 'userId2', name: 'User 2' },
    ];

    (UserServices.getAll as jest.Mock).mockResolvedValue(userlist as never);

    await UserController.getAll(req, res);

    expect(UserServices.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ data: userlist });
  });

  test('should return an internal server error status if an error occurs', async () => {
    const error = new Error('Some error');

    (UserServices.getAll as jest.Mock).mockRejectedValue(error as never);

    await UserController.getAll(req, res);

    expect(UserServices.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error });
  });
});