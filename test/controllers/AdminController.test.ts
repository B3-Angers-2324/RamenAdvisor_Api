import {describe, expect, test, beforeAll, afterAll, beforeEach, afterEach, jest, it} from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../../src/constants/HttpStatus';
import AdminService from '../../src/services/AdminService';
import AdminControler from '../../src/controllers/AdminController';
import ModeratorService from '../../src/services/ModeratorService';
import UserService from '../../src/services/UserService';
import MessageService from '../../src/services/MessageService';
import dotenv from 'dotenv';
import { TRequest } from '../../src/controllers/types/types';
import CheckInput from '../../src/tools/CheckInput';
import { CustomError } from '../../src/controllers/types/types';
import User from '../../src/models/UserModel';
import { uptime } from 'process';
dotenv.config();

jest.mock('jsonwebtoken');
jest.mock('../../src/services/AdminService');
jest.mock('../../src/services/UserService');
jest.mock('../../src/services/MessageService');

describe('AdminController - login', () => {
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

  test('should login as a moderator', async () => {
    const moderator = { password: 'moderatorPassword' };
    const token = 'moderatorToken';
    const secret_moderator = process.env.JWT_SECRET_MODO || "ASecretPhrase";

    req.body = {
      email: 'moderator@example.com',
      password: 'moderatorPassword',
    };

    jest.spyOn(ModeratorService, 'getOneModo').mockResolvedValueOnce(moderator);
    jest.spyOn(jwt, 'sign').mockReturnValueOnce(token as any);
    jest.spyOn(ModeratorService, 'updateToken').mockResolvedValueOnce(true);

    await AdminControler.login(req, res);

    expect(ModeratorService.getOneModo).toHaveBeenCalledWith('moderator@example.com');
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: undefined, moderator: true },
      secret_moderator,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    expect(ModeratorService.updateToken).toHaveBeenCalledWith('moderator@example.com', token);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ token: token });
  });

  test('should return unauthorized for wrong moderator password', async () => {
    const moderator = { password: 'moderatorPassword' };

    req.body = {
      email: 'moderator@example.com',
      password: 'wrongPassword',
    };

    jest.spyOn(ModeratorService, 'getOneModo').mockResolvedValueOnce(moderator);

    await AdminControler.login(req, res);

    expect(ModeratorService.getOneModo).toHaveBeenCalledWith('moderator@example.com');
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' });
  });

  test('should login as an admin', async () => {
    const admin = { password: 'adminPassword' };
    const token = 'adminToken';
    const secret_admin = process.env.JWT_SECRET_ADMIN || "ASecretPhrase";

    req.body = {
      email: 'admin@example.com',
      password: 'adminPassword',
    };

    jest.spyOn(ModeratorService, 'getOneModo').mockResolvedValueOnce(null);
    jest.spyOn(AdminService, 'getOneUser').mockResolvedValueOnce(admin);
    jest.spyOn(jwt, 'sign').mockReturnValueOnce(token as any);
    jest.spyOn(AdminService, 'updateToken').mockResolvedValueOnce(true);

    await AdminControler.login(req, res);

    expect(ModeratorService.getOneModo).toHaveBeenCalledWith('admin@example.com');
    expect(AdminService.getOneUser).toHaveBeenCalledWith('admin@example.com');
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: undefined, moderator: true },
      secret_admin,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    expect(AdminService.updateToken).toHaveBeenCalledWith('admin@example.com', token);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ token: token, ad: true });
  });

  test('should return unauthorized for wrong admin password', async () => {
    const admin = { password: 'adminPassword' };

    req.body = {
      email: 'admin@example.com',
      password: 'wrongPassword',
    };

    jest.spyOn(ModeratorService, 'getOneModo').mockResolvedValueOnce(null);
    jest.spyOn(AdminService, 'getOneUser').mockResolvedValueOnce(admin);

    await AdminControler.login(req, res);

    expect(ModeratorService.getOneModo).toHaveBeenCalledWith('admin@example.com');
    expect(AdminService.getOneUser).toHaveBeenCalledWith('admin@example.com');
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' });
  });

  test('should return user not found', async () => {
    req.body = {
      email: 'unknown@example.com',
      password: 'password',
    };

    jest.spyOn(ModeratorService, 'getOneModo').mockResolvedValueOnce(null);
    jest.spyOn(AdminService, 'getOneUser').mockResolvedValueOnce(null);

    await AdminControler.login(req, res);

    expect(ModeratorService.getOneModo).toHaveBeenCalledWith('unknown@example.com');
    expect(AdminService.getOneUser).toHaveBeenCalledWith('unknown@example.com');
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should handle internal server error', async () => {
    req.body = {
      email: 'admin@example.com',
      password: 'adminPassword',
    };

    jest.spyOn(ModeratorService, 'getOneModo').mockRejectedValueOnce(new Error('Database error'));

    await AdminControler.login(req, res);

    expect(ModeratorService.getOneModo).toHaveBeenCalledWith('admin@example.com');
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while logging in' });
  });
});

// ------------------------------------------------------------- //

describe('AdminController - getUsers', () => {
  let req: TRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      token: {
        _id: 'userId',
      },
      query: {
      },
    } as never as TRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should return a bad request status if no query parameters are provided', async () => {
    await AdminControler.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'names are required' });
  });

  it('should return a not found status if no users are found', async () => {
    const users : any[] = [];
    req.query.lastName = 'lastName';

    (UserService.getUsersByLastName as jest.Mock).mockResolvedValue(users as never);

    await AdminControler.getUsers(req, res);

    expect(UserService.getUsersByLastName).toHaveBeenCalledWith(req.query.lastName);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'No users found' });
  });

  it('should return an internal server error status if an error occurs', async () => {
    req.query.lastName = 'lastName';
    
    (UserService.getUsersByLastName as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await AdminControler.getUsers(req, res);

    expect(UserService.getUsersByLastName).toHaveBeenCalledWith(req.query.lastName);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting users' });
  });

  describe('it should call the right service method if the firstName query parameter is provided', () => {
    const users : any[] = [];

    (UserService.getUsersByFirstName as jest.Mock).mockResolvedValue(users as never);
    (UserService.getUsersByLastName as jest.Mock).mockResolvedValue(users as never);
    (UserService.getUsersByFirstNameAndLastName as jest.Mock).mockResolvedValue(users as never);

    test('should call the getUsersByFirstName service method', async () => {
      req.query.firstName = 'firstName';

      await AdminControler.getUsers(req, res);

      expect(UserService.getUsersByFirstName).toHaveBeenCalledWith(req.query.firstName);
    });

    test('should call the getUsersByLastName service method', async () => {
      req.query.lastName = 'lastName';

      await AdminControler.getUsers(req, res);

      expect(UserService.getUsersByLastName).toHaveBeenCalledWith(req.query.lastName);
    });

    test('should call the getUsersByFirstNameAndLastName service method', async () => {
      req.query.firstName = 'firstName';
      req.query.lastName = 'lastName';

      await AdminControler.getUsers(req, res);

      expect(UserService.getUsersByFirstNameAndLastName).toHaveBeenCalledWith(req.query.firstName, req.query.lastName);
    });
  });


  it('should return a ok status and the users if the query parameters are provided', async () => {
    const users = [{
      _id: 'userId',
      firstName: 'firstName',
      lastName: 'lastName',
      email: '@example.com',
      password: 'password123',
      isAdmin: false,
    }];

    req.query.lastName = 'lastName';

    (UserService.getUsersByLastName as jest.Mock).mockResolvedValue(users as never);

    await AdminControler.getUsers(req, res);

    expect(UserService.getUsersByLastName).toHaveBeenCalledWith(req.query.lastName);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      number: users.length,
      users,
    });
  });
});

// ------------------------------------------------------------- //

describe("AdminController - getUserProfile", () => {
  let req: TRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      token: {
        _id: 'userId',
      },
      params: {
      },
    } as never as TRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should return a bad request status if no user id is provided', async () => {
    await AdminControler.getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'No user id provided' });
  });

  it('should return a not found status if no user is found', async () => {
    const user = null;
    req.params.uid = 'userId';

    
    (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);

    await AdminControler.getUserProfile(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND)
    expect(res.json).toHaveBeenCalledWith({ message: 'No user found' });
  });
  
  it('should return an internal server error status if an error occurs', async () => {
    req.params.uid = 'userId';

    (UserService.getUserById as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await AdminControler.getUserProfile(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting users' });
  });

  it('should return an ok status and the user if the user id is provided', async () => {
    const user = {
      _id: 'userId',
      firstName: 'firstName',
      lastName: 'lastName',
      email: '@example.com',
      password: 'password123',
      isAdmin: false,
    };

    req.params.uid = 'userId';

    (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);

    await AdminControler.getUserProfile(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(user);
  });
});

// ------------------------------------------------------------- //

describe("AdminController - getUserMessage", () => {
  let req: TRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      token: {
        _id: 'userId',
      },
      params: {
      },
      query: {
      },
    } as never as TRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe('it should return a bad request status if one of the ', () => {
    it ('should return a bad request status if no user id is provided', async () => {
      req.query.limit = '10';
      req.query.offset = '0';
      await AdminControler.getUserMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'No user id provided' });
    });
    it("should return a bad request status if no limit is provided", async () => {
      req.params.uid = 'userId';
      req.query.offset = '0';

      await AdminControler.getUserMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
    });
    it("should return a bad request status if no offset is provided", async () => {
      req.params.uid = 'userId';
      req.query.limit = '10';

      await AdminControler.getUserMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
    });
  });

  it("should return a not found status if no user is found", async () => {
    const user = null;
    req.params.uid = 'userId';
    req.query.limit = '10';
    req.query.offset = '0';

    (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);

    await AdminControler.getUserMessage(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'No user found' });                                                                  
  });

  it("should return an internal server error status if an error occurs", async () => {
    req.params.uid = 'userId';
    req.query.limit = '10';
    req.query.offset = '0';

    (UserService.getUserById as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await AdminControler.getUserMessage(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting users' });
  });

  it("should return a not found status if no message is found", async () => {
    let user = {
      _id: 'userId'
    };
    req.params.uid = 'userId';
    req.query.limit = '10';
    req.query.offset = '0';

    (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);
    (MessageService.queryMessagesForUser as jest.Mock).mockResolvedValue(undefined as never);

    await AdminControler.getUserMessage(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith(user._id, parseInt(req.query.limit.toString())+1, parseInt(req.query.offset.toString()));
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'No message found' });
  });

  describe("should return an ok status and the messages if everything is ok", () => {
    let messages = [{
      _id: 'messageId',
      content: 'content',
      sender: 'senderId',
      receiver: 'receiverId',
      date: new Date(),
    },{
      _id: 'messageId2',
      content: 'content2',
      sender: 'senderId2',
      receiver: 'receiverId2',
      date: new Date(),
    }];
    let user = {
      _id: 'userId'
    };

    beforeEach(() => {
      req.params.uid = 'userId';

      (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);
      (MessageService.queryMessagesForUser as jest.Mock).mockResolvedValue(messages as never);
    });

    it("should return an ok status the messages and more at true", async () => {
      req.query.limit = '1';
      req.query.offset = '0';
  
      await AdminControler.getUserMessage(req, res);
  
      expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
      expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith(user._id, parseInt(req.query.limit.toString())+1, parseInt(req.query.offset.toString()));
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        length: messages.length,
        messages: messages,
        more: true
      });
    });

    it("should return an ok status the messages and more at false", async () => {
      req.query.limit = '3';
      req.query.offset = '0';
  
      await AdminControler.getUserMessage(req, res);
  
      expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
      expect(MessageService.queryMessagesForUser).toHaveBeenCalledWith(user._id, parseInt(req.query.limit.toString())+1, parseInt(req.query.offset.toString()));
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        length: messages.length,
        messages: messages,
        more: false
      });
    });
  });  
});

// ------------------------------------------------------------- //

describe("AdminController - banUser", () => {
  let req: TRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      token: {
        _id: 'modoId',
      },
      params: {
      },
      query: {
      },
    } as never as TRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it("should return a bad request status if no user id is provided", async () => {
    await AdminControler.banUser(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'No user id provided' });
  });

  it("should return a not found status if no user is found", async () => {
    const user = null;
    req.params.uid = 'userId';

    (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);

    await AdminControler.banUser(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'No user found' });
  });

  it("should return an internal server error status if an error occurs while fetching the user", async () => {
    req.params.uid = 'userId';

    (UserService.getUserById as jest.Mock).mockRejectedValue(new Error('Some error') as never);
    await AdminControler.banUser(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while banning user' });
  });
  it("should return an internal server error status if an error occurs while banning the user", async () => {
    let user = {
      _id: 'userId',
      ban: false,
    };
    req.params.uid = 'userId';

    (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);
    (UserService.updateUser as jest.Mock).mockRejectedValue(new Error('Some error') as never);

    await AdminControler.banUser(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(UserService.updateUser).toHaveBeenCalledWith(user._id, user);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while banning user' });
  });

  it("should return an Internal Server Error status if an error occurs while updating the user", async () => {
    let user = {
      _id: 'userId',
      ban: false,
    };
    req.params.uid = 'userId';

    (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);
    (UserService.updateUser as jest.Mock).mockResolvedValue(null as never);

    await AdminControler.banUser(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(UserService.updateUser).toHaveBeenCalledWith(user._id, user);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while banning user' });
  });

  it("should return an ok status if the user is banned", async () => {
    req.params.uid = 'userId';
    let user = {
      _id: 'userId',
      ban: false,
    };

    (UserService.getUserById as jest.Mock).mockResolvedValue(user as never);
    (UserService.updateUser as jest.Mock).mockResolvedValue(user as never);

    await AdminControler.banUser(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(req.params.uid);
    expect(UserService.updateUser).toHaveBeenCalledWith(user._id, user);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ message: 'User banned' });
  });
});

// ------------------------------------------------------------- //

describe('AdminController - addModerator', () => {
  let req: TRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      admin: true,
      body: {
        email: 'moderator@example.com',
        password: 'moderatorPassword',
      },
    } as never as TRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add a new moderator', async () => {
    const newModerator = {
      email: 'moderator@example.com',
      password: 'moderatorPassword',
    };

    jest.spyOn(CheckInput, 'email').mockReturnValueOnce(true);
    jest.spyOn(AdminService, 'getOneUser').mockResolvedValueOnce(null);
    jest.spyOn(ModeratorService, 'getOneModo').mockResolvedValueOnce(null);
    jest.spyOn(ModeratorService, 'addModerator').mockResolvedValueOnce(true);

    await AdminControler.addModerator(req, res);

    expect(CheckInput.email).toHaveBeenCalledWith(newModerator.email);
    expect(AdminService.getOneUser).toHaveBeenCalledWith(newModerator.email);
    expect(ModeratorService.getOneModo).toHaveBeenCalledWith(newModerator.email);
    expect(ModeratorService.addModerator).toHaveBeenCalledWith(newModerator);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ message: 'Moderator added' });
  });

  test('should return unauthorized if not an admin', async () => {
    req.admin = false;

    await AdminControler.addModerator(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  test('should return bad request if email or password is missing', async () => {
    req.body.email = undefined;

    await AdminControler.addModerator(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
  });

  test('should return bad request if email is invalid', async () => {
    jest.spyOn(CheckInput, 'email').mockReturnValueOnce(false);

    await AdminControler.addModerator(req, res);

    expect(CheckInput.email).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' });
  });

  // test('should return bad request if password is invalid', async () => {
  //   jest.spyOn(CheckInput, 'password').mockReturnValueOnce(false);

  //   await AdminControler.addModerator(req, res);

  //   expect(CheckInput.password).toHaveBeenCalledWith(req.body.password);
  //   expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  //   expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
  // });

  test('should return bad request if admin already exists with the same email', async () => {
    jest.spyOn(AdminService, 'getOneUser').mockResolvedValueOnce({});

    await AdminControler.addModerator(req, res);

    expect(AdminService.getOneUser).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin already exists with this mail' });
  });

  test('should return bad request if moderator already exists with the same email', async () => {
    jest.spyOn(ModeratorService, 'getOneModo').mockResolvedValueOnce({});

    await AdminControler.addModerator(req, res);

    expect(ModeratorService.getOneModo).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Moderator already exists with this mail' });
  });

  test('should return internal server error if error occurs while adding moderator', async () => {
    jest.spyOn(ModeratorService, 'addModerator').mockResolvedValueOnce(null);

    await AdminControler.addModerator(req, res);

    expect(ModeratorService.addModerator).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding moderator' });
  });

  test('should handle custom error', async () => {
    const customError = new CustomError('Custom error', HttpStatus.BAD_REQUEST);

    jest.spyOn(CheckInput, 'email').mockImplementation(() => {
      throw customError;
    });

    await AdminControler.addModerator(req, res);

    expect(CheckInput.email).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(customError.code);
    expect(res.json).toHaveBeenCalledWith({ message: customError.message });
  });
});

// ------------------------------------------------------------- //

describe('AdminController - deleteModerator', () => {
  let req: TRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      admin: true,
      params: {
        mid: 'moderatorId',
      },
    } as never as TRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete the moderator', async () => {
    const moderator = { _id: 'moderatorId' };

    jest.spyOn(ModeratorService, 'getOneModoById').mockResolvedValueOnce(moderator);
    jest.spyOn(ModeratorService, 'deleteModerator').mockResolvedValueOnce(true);

    await AdminControler.deleteModerator(req, res);

    expect(ModeratorService.getOneModoById).toHaveBeenCalledWith(req.params.mid);
    expect(ModeratorService.deleteModerator).toHaveBeenCalledWith(req.params.mid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ message: 'Moderator deleted' });
  });

  test('should return unauthorized if not an admin', async () => {
    req.admin = false;

    await AdminControler.deleteModerator(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  test('should return bad request if missing parameters', async () => {
    let custReq = {
      admin: true,
      params: {},
    } as never as TRequest;

    await AdminControler.deleteModerator(custReq, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameters' });
  });

  test('should return not found if moderator not found', async () => {
    jest.spyOn(ModeratorService, 'getOneModoById').mockResolvedValueOnce(null);

    await AdminControler.deleteModerator(req, res);

    expect(ModeratorService.getOneModoById).toHaveBeenCalledWith(req.params.mid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: 'Moderator not found' });
  });

  test('should return internal server error if error occurs while deleting moderator', async () => {
    jest.spyOn(ModeratorService, 'getOneModoById').mockResolvedValueOnce({ _id: 'moderatorId' });
    jest.spyOn(ModeratorService, 'deleteModerator').mockResolvedValueOnce(null);

    await AdminControler.deleteModerator(req, res);

    expect(ModeratorService.getOneModoById).toHaveBeenCalledWith(req.params.mid);
    expect(ModeratorService.deleteModerator).toHaveBeenCalledWith(req.params.mid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while deleting moderator' });
  });

  test('should handle custom error', async () => {
    const customError = new CustomError('Custom Error', HttpStatus.BAD_REQUEST);

    jest.spyOn(ModeratorService, 'getOneModoById').mockRejectedValueOnce(customError);

    await AdminControler.deleteModerator(req, res);

    expect(ModeratorService.getOneModoById).toHaveBeenCalledWith(req.params.mid);
    expect(res.status).toHaveBeenCalledWith(customError.code);
    expect(res.json).toHaveBeenCalledWith({ message: customError.message });
  });

  test('should handle generic error', async () => {
    const genericError = new Error('Generic Error');

    jest.spyOn(ModeratorService, 'getOneModoById').mockRejectedValueOnce(genericError);

    await AdminControler.deleteModerator(req, res);

    expect(ModeratorService.getOneModoById).toHaveBeenCalledWith(req.params.mid);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while deleting moderator' });
  });
});

// ------------------------------------------------------------- //

describe('AdminController - getModerators', () => {
  let req: TRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      admin: true,
    } as never as TRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the list of moderators', async () => {
    const moderators = [{ name: 'Moderator 1' }, { name: 'Moderator 2' }];

    jest.spyOn(ModeratorService, 'getModerators').mockResolvedValueOnce(moderators);

    await AdminControler.getModerators(req, res);

    expect(ModeratorService.getModerators).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(moderators);
  });

  test('should return an internal server error if an error occurs while getting moderators', async () => {
    jest.spyOn(ModeratorService, 'getModerators').mockRejectedValueOnce(new Error('Database error'));

    await AdminControler.getModerators(req, res);

    expect(ModeratorService.getModerators).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting moderators' });
  });

  test('should return unauthorized if the request is not from an admin', async () => {
    req.admin = false;

    await AdminControler.getModerators(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});