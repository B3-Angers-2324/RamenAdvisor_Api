import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import UserServices from '../../src/services/UserService';
import MessageService from '../../src/services/MessageService';
import MessageController from '../../src/controllers/MessageController';
import UserController from '../../src/controllers/UserController';
import CheckInput from '../../src/tools/CheckInput';
import { TRequest } from '../../src/controllers/types/types';

import dotenv from 'dotenv';
dotenv.config();

jest.mock('jsonwebtoken');
jest.mock('../../src/services/UserService');
jest.mock('../../src/tools/CheckInput');
jest.mock('../../src/services/MessageService');
jest.mock('../../src/controllers/MessageController');

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
  let req: TRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      token: {
        _id: 'userId',
      },
    } as TRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete user profile and return success message', async () => {
    const messages = [
      {
        restaurant: {
          _id: 'restaurantId1',
        },
        note: 4,
      },
      {
        restaurant: {
          _id: 'restaurantId2',
        },
        note: 3,
      },
    ];

    (MessageService.queryMessagesForUser as jest.Mock).mockResolvedValue(messages as never);
    (MessageController.deleteNotePercentage as jest.Mock).mockResolvedValue(3.5 as never);
    (MessageService.deleteAllMessagesForUser as jest.Mock).mockResolvedValue(true as never);
    (UserServices.deleteUser as jest.Mock).mockResolvedValue(true as never);

    await UserController.deleteUserProfile(req, res);

    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith('userId', 99999999, 0);
    expect(MessageController.deleteNotePercentage).toHaveBeenCalledWith('restaurantId1', 4);
    expect(MessageController.deleteNotePercentage).toHaveBeenCalledWith('restaurantId2', 3);
    expect(MessageService.deleteAllMessagesForUser).toHaveBeenCalledWith('userId');
    expect(UserServices.deleteUser).toHaveBeenCalledWith('userId');
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
  });

  test('should return internal server error if error occurs while deleting user messages', async () => {
    (MessageService.queryMessagesForUser as jest.Mock).mockResolvedValue(undefined as never);

    await UserController.deleteUserProfile(req, res);

    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith('userId', 99999999, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while deleting user' });
  });

  test('should return internal server error if error occurs while deleting user', async () => {
    const messages = [
      {
        restaurant: {
          _id: 'restaurantId1',
        },
        note: 4,
      },
      {
        restaurant: {
          _id: 'restaurantId2',
        },
        note: 3,
      },
    ];

    (MessageService.queryMessagesForUser as jest.Mock).mockResolvedValue(messages as never);
    (MessageController.deleteNotePercentage as jest.Mock).mockResolvedValue(3.5 as never);
    (MessageService.deleteAllMessagesForUser as jest.Mock).mockResolvedValue(true as never);
    (UserServices.deleteUser as jest.Mock).mockResolvedValue(false as never);

    await UserController.deleteUserProfile(req, res);

    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith('userId', 99999999, 0);
    expect(MessageController.deleteNotePercentage).toHaveBeenCalledWith('restaurantId1', 4);
    expect(MessageController.deleteNotePercentage).toHaveBeenCalledWith('restaurantId2', 3);
    expect(MessageService.deleteAllMessagesForUser).toHaveBeenCalledWith('userId');
    expect(UserServices.deleteUser).toHaveBeenCalledWith('userId');
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while deleting user' });
  });

  test('should return internal server error if an error occurs', async () => {
    (MessageService.queryMessagesForUser as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await UserController.deleteUserProfile(req, res);

    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith('userId', 99999999, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while deleting user' });
  });
});


// ---------------------------------------------------------------

describe('UserController - getUserMessage', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      token: {
        _id: 'userId',
      },
      query: {
        limit: '10',
        offset: '0',
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return messages for the user', async () => {
    const messages = [
      { id: 'messageId1', content: 'Message 1' },
      { id: 'messageId2', content: 'Message 2' },
    ];

    (MessageService.queryMessagesForUser as jest.Mock).mockResolvedValue(messages as never);

    await UserController.getUserMessage(req, res);

    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith('userId', 10, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      length: messages.length,
      messages: messages,
    });
  });

  test('should return a not found status if no messages are found', async () => {
    (MessageService.queryMessagesForUser as jest.Mock).mockResolvedValue(undefined as never);

    await UserController.getUserMessage(req, res);

    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith('userId', 10, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'No message found' });
  });

  test('should return a bad request status if limit or offset are missing', async () => {
    req.query.limit = undefined;
    req.query.offset = undefined;

    await UserController.getUserMessage(req, res);

    expect(MessageService.queryMessagesForUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
  });

  test('should return an internal server error status if an error occurs', async () => {
    (MessageService.queryMessagesForUser as jest.Mock).mockRejectedValue(new Error('Internal server error') as never);

    await UserController.getUserMessage(req, res);

    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith('userId', 10, 0);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});