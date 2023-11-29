import { describe, expect, test, beforeEach, afterEach, jest, it } from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import UserServices from '../../src/services/UserService';
import UserController from '../../src/controllers/UserController';
import CheckInput from '../../src/tools/CheckInput';
import { TRequest } from '../../src/controllers/types/types';

import dotenv from 'dotenv';
import MessageService from '../../src/services/MessageService';
dotenv.config();

jest.mock('jsonwebtoken');
jest.mock('../../src/services/UserService');
jest.mock('../../src/tools/CheckInput');
jest.mock('../../src/services/MessageService');

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
        birthDay: new Date('1990-01-01'),
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
      birthDay: new Date('1990-01-01'),
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
    (CheckInput.dateInferiorToToday as jest.Mock).mockReturnValue(true);
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
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(CheckInput.dateInferiorToToday).toHaveBeenCalledWith(req.body.birthDay);
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
    (CheckInput.phone as jest.Mock).mockReturnValue(false);
    (CheckInput.dateInferiorToToday as jest.Mock).mockReturnValue(false);

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
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (CheckInput.dateInferiorToToday as jest.Mock).mockReturnValue(true);
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
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(CheckInput.dateInferiorToToday).toHaveBeenCalledWith(req.body.birthDay);
    expect(UserServices.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  test('should return an internal server error status if an error occurs', async () => {
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (CheckInput.dateInferiorToToday as jest.Mock).mockReturnValue(true);
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
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(CheckInput.dateInferiorToToday).toHaveBeenCalledWith(req.body.birthDay);
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



describe('UserController - getUserProfile', () => {
  test('should return user profile if user exists', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const user = {
      _id: 'userId',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
  
    (UserServices.getUserById as jest.Mock).mockResolvedValue(user as never);
  
    await UserController.getUserProfile(req, res);
  
    expect(UserServices.getUserById).toHaveBeenCalledWith(req.token?._id);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ user });
  });
  
  test('should return not found status if user does not exist', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (UserServices.getUserById as jest.Mock).mockResolvedValue(null as never);
  
    await UserController.getUserProfile(req, res);
  
    expect(UserServices.getUserById).toHaveBeenCalledWith(req.token?._id);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
  
  test('should return internal server error status if an error occurs', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (UserServices.getUserById as jest.Mock).mockRejectedValue(new Error('Some error') as never);
  
    await UserController.getUserProfile(req, res);
  
    expect(UserServices.getUserById).toHaveBeenCalledWith(req.token?._id);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting user information' });
  });
});


//------------------------------------------------------------


describe('UserController - updateUserProfile', () => {
  test('should update user profile and return success message', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        birthDay: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: '1234567890',
        sexe: 'male',
        ville: 'New York',
        address: '123 Main St',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(true);
    (UserServices.getUserById as jest.Mock).mockResolvedValue({ _id: 'userId' } as never);
    (UserServices.updateUser as jest.Mock).mockResolvedValue(true as never);
  
    await UserController.updateUserProfile(req, res);
  
    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
    ]);
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(CheckInput.email).toHaveBeenCalledWith(req.body.email);
    expect(UserServices.getUserById).toHaveBeenCalledWith(req.token?._id);
    expect(UserServices.updateUser).toHaveBeenCalledWith(req.token?._id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDay: req.body.birthDay,
      email: req.body.email,
      phone: req.body.phone,
      sexe: req.body.sexe,
      ville: req.body.ville,
      address: req.body.address,
      image: 'http://thispersondoesnotexist.com/',
    });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ message: 'User information updated' });
  });
  
  test('should return bad request status if any field is missing', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      body: {
        firstName: '',
        lastName: '',
        birthDay: '',
        email: '',
        phone: '',
        sexe: '',
        ville: '',
        address: '',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(false);
  
    await UserController.updateUserProfile(req, res);
  
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
  });
  
  test('should return bad request status if phone number is invalid', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        birthDay: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: 'invalidPhoneNumber',
        sexe: 'male',
        ville: 'New York',
        address: '123 Main St',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(false);
  
    await UserController.updateUserProfile(req, res);
  
    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
    ]);
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid phone number' });
  });
  
  test('should return bad request status if email format is incorrect', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        birthDay: new Date('1990-01-01'),
        email: 'invalidEmail',
        phone: '1234567890',
        sexe: 'male',
        ville: 'New York',
        address: '123 Main St',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(false);
  
    await UserController.updateUserProfile(req, res);
  
    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
    ]);
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(CheckInput.email).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email format is not correct' });
  });
  
  test('should return not found status if user does not exist', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        birthDay: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: '1234567890',
        sexe: 'male',
        ville: 'New York',
        address: '123 Main St',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(true);
    (UserServices.getUserById as jest.Mock).mockResolvedValue(null as never);
  
    await UserController.updateUserProfile(req, res);
  
    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
    ]);
    expect(UserServices.getUserById).toHaveBeenCalledWith(req.token?._id);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
  
  test('should return internal server error status if an error occurs', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        birthDay: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phone: '1234567890',
        sexe: 'male',
        ville: 'New York',
        address: '123 Main St',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (CheckInput.areNotEmpty as jest.Mock).mockReturnValue(true);
    (CheckInput.phone as jest.Mock).mockReturnValue(true);
    (CheckInput.email as jest.Mock).mockReturnValue(true);
    (UserServices.getUserById as jest.Mock).mockResolvedValue({ _id: 'userId' } as never);
    (UserServices.updateUser as jest.Mock).mockRejectedValue(new Error('Some error') as never);
  
    await UserController.updateUserProfile(req, res);
  
    expect(CheckInput.areNotEmpty).toHaveBeenCalledWith([
      req.body.firstName,
      req.body.lastName,
      req.body.birthDay,
      req.body.email,
      req.body.phone,
      req.body.sexe,
      req.body.ville,
      req.body.address,
    ]);
    expect(CheckInput.phone).toHaveBeenCalledWith(req.body.phone);
    expect(CheckInput.email).toHaveBeenCalledWith(req.body.email);
    expect(UserServices.getUserById).toHaveBeenCalledWith(req.token?._id);
    expect(UserServices.updateUser).toHaveBeenCalledWith(req.token?._id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDay: req.body.birthDay,
      email: req.body.email,
      phone: req.body.phone,
      sexe: req.body.sexe,
      ville: req.body.ville,
      address: req.body.address,
      image: 'http://thispersondoesnotexist.com/',
    });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating user information' });
  });
});



// ---------------------------------------------------------------

describe('UserController - deleteUserProfile', () => {
  test('should delete user profile and return success message', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (UserServices.deleteUser as jest.Mock).mockResolvedValue(true as never);
  
    await UserController.deleteUserProfile(req, res);
  
    expect(UserServices.deleteUser).toHaveBeenCalledWith(req.token?._id);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
  });
  
  test('should return internal server error if an error occurs while deleting user profile', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
    } as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (UserServices.deleteUser as jest.Mock).mockRejectedValue(new Error('Some error') as never);
  
    await UserController.deleteUserProfile(req, res);
  
    expect(UserServices.deleteUser).toHaveBeenCalledWith(req.token?._id);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while deleting user' });
  });
});

describe('UserController - getUserMessage', () => {
  let messages = 
  it('should return all messages for a user with no more message', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      query: {
        limit: 2,
        offset: 0,
      },
    } as unknown as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const messages = [
      { _id: 'messageId1', message: 'Message 1' },
      { _id: 'messageId2', message: 'Message 2' },
    ];
  
    (MessageService.queryMessagesForUser as jest.Mock).mockReturnValue(messages as never);
  
    await UserController.getUserMessage(req, res);
  
    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith(req.token?._id, 3, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      length: messages.length,
      messages: messages,
      more: false,
    });
  });
  it('should return all messages for a user with more message', async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      query: {
        limit: 2,
        offset: 0,
      },
    } as unknown as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const messages = [
      { _id: 'messageId1', message: 'Message 1' },
      { _id: 'messageId2', message: 'Message 2' },
      { _id: 'messageId3', message: 'Message 3' },
    ];
  
    (MessageService.queryMessagesForUser as jest.Mock).mockReturnValue(messages as never);
  
    await UserController.getUserMessage(req, res);
  
    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith(req.token?._id, 3, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      length: messages.length,
      messages: [messages[0], messages[1]],
      more: true,
    });
  });
  it("should return not found status if user doesn't exist", async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      query: {
        limit: 2,
        offset: 0,
      },
    } as unknown as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (MessageService.queryMessagesForUser as jest.Mock).mockReturnValue(null as never);
  
    await UserController.getUserMessage(req, res);
  
    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith(req.token?._id, 3, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'No message found' });
  });
  it("should return internal server error status if an error occurs", async () => {
    const req = {
      token: {
        _id: 'userId',
      },
      query: {
        limit: 2,
        offset: 0,
      },
    } as unknown as TRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  
    (MessageService.queryMessagesForUser as jest.Mock).mockRejectedValue(new Error('Some error') as never);
  
    await UserController.getUserMessage(req, res);
  
    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith(req.token?._id, 3, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Some error' });
  });


  describe("should return bad request status if limit or offset are missing", () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    test("limit is missing", async () => {
      const req = {
        token: {
          _id: 'userId',
        },
        query: {
          offset: 0,
        },
      } as unknown as TRequest;
      
      await UserController.getUserMessage(req, res);
    
      expect(MessageService.queryMessagesForUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
    });
    test("offset is missing", async () => {
      const req = {
        token: {
          _id: 'userId',
        },
        query: {
          limit: 2,
        },
      } as unknown as TRequest;
      
      await UserController.getUserMessage(req, res);
    
      expect(MessageService.queryMessagesForUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
    });
  });
});