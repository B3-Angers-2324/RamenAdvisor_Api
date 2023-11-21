import {describe, expect, test} from '@jest/globals';
import { CustomError } from '../../../src/controllers/types/types';

describe('CustomError', () => {
  test('should create a CustomError instance with default code', () => {
    const error = new CustomError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(500);
  });

  test('should create a CustomError instance with specified code', () => {
    const error = new CustomError('Test error', 404);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(404);
  });
});