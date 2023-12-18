import { Request, Response } from 'express';
import {describe, expect, test, beforeAll, afterAll, it, afterEach, beforeEach, jest} from '@jest/globals';
import CheckInput from "../../src/tools/CheckInput";
import { TRequest } from '../../src/controllers/types/types';
import ImageController from '../../src/controllers/ImageContoller';
import ImageService from '../../src/services/ImageService';
import HttpStatus from '../../src/constants/HttpStatus';
import sharp from 'sharp';
import { ObjectId } from 'mongodb';

jest.mock('../../src/services/ImageService');
jest.mock('sharp');

describe('getImage', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {
            params: {
                id: 'existingId'
            }
        } as unknown as Request;
        res = {
            writeHead: jest.fn(),
            end: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
    });

    it('should return the image with a 200 status code', async () => {
        // mock
        (ImageService.queryImage as jest.Mock).mockResolvedValueOnce({
            binary: Buffer.from('test binary'),
            mimetype: 'image/png'
        } as never);
        
        // Act
        await ImageController.getImage(req, res);

        // Assert
        expect(res.writeHead).toHaveBeenCalledWith(200, {
            'Content-Type': 'image/png',
            'X-Name': 'foodtype_icon',
            'Access-Control-Expose-Headers': 'X-Name'
        });
    });

    it('should return an internal server error with a 500 status code if the image is not found', async () => {
        // Arrange
        req.params.id = 'nonExistingId';

        // Act
        await ImageController.getImage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({ "message": "Internal servers error" });
    });

    it('should return an internal server error with a 500 status code if an error occurs', async () => {
        // Arrange
        jest.spyOn(console, 'log').mockImplementation(() => {});

        // Act
        await ImageController.getImage(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({ "message": "Internal servers error" });
    });
});

// ----------------------------------------------------------